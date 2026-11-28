import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyBody, CaseStudyHeader, Measure, NoteGrid, SimpleTable, Wide } from "@/components/case-study";
import { ContactBand } from "@/components/contact-band";
import { UpiThumb } from "@/components/diagrams";
import { Screenshot } from "@/components/figure";
import { Callout } from "@/components/ui";
import { getProject } from "@/content/projects";

const project = getProject("upi-offline-mesh")!;

export const metadata: Metadata = {
  title: "UPI Offline Mesh — offline payment network simulation",
  description:
    "Node.js, Express and PostgreSQL simulation of offline payments: gossip routing through untrusted phones, AES-256-GCM + RSA-OAEP encryption, Ed25519-signed payments and at-most-once settlement per packet.",
  alternates: { canonical: "/projects/upi-offline-mesh" },
  openGraph: { url: "/projects/upi-offline-mesh", type: "article", images: ["/opengraph-image"] },
};

const toc = [
  { id: "idea", label: "The idea" },
  { id: "pipeline", label: "Settlement pipeline" },
  { id: "security", label: "Security model" },
  { id: "concurrency", label: "Concurrency" },
  { id: "tests", label: "Tests" },
  { id: "migration", label: "Java → Node.js" },
  { id: "limits", label: "Honest limits" },
];

const code = (s: string) => <code>{s}</code>;

export default function UpiCaseStudy() {
  return (
    <>
      <CaseStudyHeader project={project}>
        <div className="mt-8">
          <Screenshot
            src="/images/upi/console.png"
            alt="UPI Offline Mesh simulation console: mesh network map with devices and bridges, payment form, account balances and the security and failure lab."
            width={1440}
            height={1250}
            label="UPI Offline Mesh · simulation console"
            sizes="(min-width: 1200px) 1136px, 100vw"
            caption="The simulation console after real scenario runs: mesh map, payment form, balances read from PostgreSQL, and the security lab."
          />
        </div>
      </CaseStudyHeader>
      <CaseStudyBody toc={toc}>
        <Measure>
          <h2 id="idea" className="!mt-0">The idea</h2>
          <p>
            You’re somewhere with no signal and send a friend ₹500. Your phone signs and encrypts the payment and hands it to
            nearby phones. They pass it along hop by hop without being able to read or alter it, until one of them reaches the
            internet and uploads it. Because gossip delivers copies everywhere, several phones may upload the same packet at
            the same moment — and the backend must still settle it exactly once.
          </p>
          <Callout title="Simulation only">
            Accounts, balances and devices are fictional and no money moves. The mesh runs in memory; it does not use real
            Bluetooth, Wi-Fi Direct or NFC.
          </Callout>
        </Measure>
        <Wide>
          <figure className="overflow-hidden rounded-lg border border-line">
            <UpiThumb />
            <figcaption className="border-t border-line bg-surface px-4 py-2.5 text-sm text-muted">Architecture diagram: offline gossip, then a single transactional ingestion path.</figcaption>
          </figure>
        </Wide>

        <Measure>
          <h2 id="pipeline">Settlement pipeline</h2>
          <p>Every upload goes through one function, {code("ingest()")}, inside one PostgreSQL transaction:</p>
          <ol>
            <li>Hash the ciphertext (SHA-256).</li>
            <li>Claim it: {code("INSERT INTO processed_packets … ON CONFLICT DO NOTHING RETURNING")}. Exactly one concurrent caller gets a row; the rest are duplicates.</li>
            <li>Decrypt (RSA-OAEP unwraps the AES key; AES-256-GCM decrypts and verifies the tag).</li>
            <li>Verify the sender’s Ed25519 signature against the account’s registered public key.</li>
            <li>Check freshness (24 h window, 5 min clock-skew tolerance).</li>
            <li>Lock both accounts {code("FOR UPDATE")} one statement each in sorted order, check balance, debit, credit, record.</li>
            <li>Commit — or roll back, which also releases the claim so the packet can be retried.</li>
          </ol>
          <p>
            <strong>The guarantee, scoped precisely:</strong> within this database there is at most one committed settlement per
            packet hash, enforced by a primary key and unique constraints. Delivery through the mesh is deliberately at-least-once.
          </p>
        </Measure>

        <Measure><h2 id="security">Security model</h2></Measure>
        <NoteGrid
          items={[
            { tag: "Confidentiality + integrity", title: "Hybrid encryption", body: <>A fresh AES-256-GCM key and IV per packet, wrapped with the server’s 2048-bit RSA-OAEP (SHA-256) key. Relays see only ciphertext; any flipped bit fails the GCM tag.</> },
            { tag: "Authentication", title: "Ed25519 signatures", body: <>The sender’s device signs a canonical encoding of sender, receiver, amount, nonce and timestamp. Encryption alone can’t prove who sent a packet — anyone with the server’s public key can encrypt.</> },
            { tag: "Idempotency", title: "Hash of the ciphertext", body: <>Relays could rewrite the outer packet id, so devices and the backend de-duplicate on SHA-256 of the authenticated ciphertext instead.</> },
            { tag: "Replay protection", title: "Three layers", body: <>Identical packet → duplicate. Re-encrypted copy of a signed payment → <code>UNIQUE(nonce)</code> rejects it. Old packet → freshness window.</> },
          ]}
        />

        <Measure>
          <h2 id="concurrency">Concurrency — two bugs found by testing against real PostgreSQL</h2>
          <ul>
            <li><strong>Deadlock.</strong> The first version locked both accounts with one {code("SELECT … ORDER BY vpa FOR UPDATE")}. Concurrent opposite transfers (A→B, B→A) deadlocked: PostgreSQL does not guarantee that rows are locked in the sorted order. Locking each row with its own statement, in sorted order, fixed it.</li>
            <li><strong>A test poisoning the pool.</strong> A “simulated DB failure” connection went back into the pool still patched, breaking later tests — a reminder that test isolation matters as much as the code under test.</li>
          </ul>
        </Measure>

        <Measure><h2 id="tests">Tests</h2></Measure>
        <SimpleTable
          caption="Selected tests"
          head={["Test", "Result"]}
          rows={[
            ["20 concurrent deliveries of one packet", "1 SETTLED, 19 DUPLICATE_DROPPED"],
            ["10 concurrent ₹300 payments from a ₹1,000 balance", "exactly 3 settle; balance never negative"],
            ["Concurrent opposite transfers", "total money conserved"],
            ["Settlement fails mid-transaction", "claim released; retry settles"],
            ["Tampered / forged / expired / re-encrypted replay", "INVALID with the specific reason"],
            ["Full HTTP flow: create → 3 gossip rounds → 2 bridges upload", "one SETTLED, one DUPLICATE_DROPPED"],
          ]}
        />
        <Measure>
          <p>38 {code("node:test")} cases (including per-visitor isolation) run against a real PostgreSQL 16: stable across repeated runs, and in GitHub Actions with a PostgreSQL service container.</p>

          <h2 id="migration">From Java to Node.js</h2>
          <p>
            The first version was Java 17 / Spring Boot with an in-memory H2 database, still in the repository under{" "}
            {code("legacy/java")}. In November 2026 it was reimplemented in JavaScript with AI pair-programming assistance. Two defects in
            the original were fixed in the process: payments weren’t signed (so the sender wasn’t authenticated), and the idempotency
            claim was stored in memory before settlement, so a failed settlement could leave a payment permanently unsettled.{" "}
            <Link href="/writing/deduplicate-before-you-decrypt">More on the idempotency design.</Link>
          </p>

          <h2 id="limits">Honest limits</h2>
          <ul>
            <li><strong>Deferred settlement, not real-time offline payment.</strong> The receiver can’t verify funds offline; a sender can double-spend across disconnected groups until one packet reaches the backend. Real offline UPI uses a pre-funded hardware wallet for this reason.</li>
            <li>Device keys live in the simulator’s memory; the server’s RSA key regenerates on start (production: secure enclave, KMS/HSM).</li>
            <li>Bridges aren’t authenticated (production: mutual TLS and per-bridge rate limits).</li>
            <li>The live demo gives every visitor a private sandbox (own phones, keys, accounts and ledger, keyed by an HttpOnly cookie). Sandboxes live in one server process, so a restart clears them; it runs on free hosting (Render + Neon PostgreSQL).</li>
          </ul>
        </Measure>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
