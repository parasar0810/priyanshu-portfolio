import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyBody, CaseStudyHeader, SimpleTable } from "@/components/case-study";
import { ContactBand } from "@/components/contact-band";
import { Callout } from "@/components/ui";
import { getProject } from "@/content/projects";

const project = getProject("upi-offline-mesh")!;

export const metadata: Metadata = {
  title: "UPI Offline Mesh case study",
  description:
    "A Spring Boot backend for mesh-routed offline payments: hybrid encryption through untrusted phones, exactly-once settlement and replay protection.",
  alternates: { canonical: "/projects/upi-offline-mesh" },
  openGraph: { url: "/projects/upi-offline-mesh", type: "article", images: ["/opengraph-image"] },
};

const toc = [
  { id: "idea", label: "The idea" },
  { id: "pipeline", label: "Ingest pipeline" },
  { id: "problems", label: "Three hard problems" },
  { id: "tests", label: "Tests" },
  { id: "limits", label: "Honest limits" },
];

const code = (s: string) => <code>{s}</code>;

export default function UpiCaseStudy() {
  return (
    <>
      <CaseStudyHeader project={project} />
      <CaseStudyBody toc={toc}>
        <h2 id="idea">The idea</h2>
        <p>
          You’re in a basement with no signal and you send a friend ₹500. Your phone encrypts the payment and
          broadcasts it to nearby phones; the packet hops device to device until one of them walks outside, gets 4G
          and uploads it. The backend decrypts, deduplicates and settles.
        </p>
        <p>
          This repository is the server side of that system plus a software simulator of the mesh, so the whole flow
          runs on one laptop without Bluetooth hardware. A dashboard walks through it: inject a payment, run gossip
          rounds, let the bridge phone upload, and watch balances and the ledger change.
        </p>

        <h2 id="pipeline">The ingest pipeline</h2>
        <p>Every packet a bridge uploads to {code("/api/bridge/ingest")} goes through five steps, in this order:</p>
        <ol>
          <li>Hash the ciphertext with SHA-256.</li>
          <li>Atomically claim the hash in the idempotency cache. Duplicates stop here, before any expensive work.</li>
          <li>Decrypt: RSA-OAEP unwraps the AES key; AES-256-GCM decrypts the payload and verifies its tag.</li>
          <li>Check freshness: the signed timestamp must be within the last 24 hours.</li>
          <li>Settle in one {code("@Transactional")} unit: debit, credit, ledger row. Accounts use {code("@Version")} optimistic locking as defence in depth.</li>
        </ol>

        <h2 id="problems">Three hard problems</h2>
        <SimpleTable
          caption="Problems and solutions"
          head={["Problem", "Approach", "Where"]}
          rows={[
            [
              "Strangers carry your payment",
              "Hybrid encryption: a fresh AES-256-GCM key per packet, wrapped with the server’s RSA public key. Any flipped bit fails the GCM tag.",
              code("HybridCryptoService"),
            ],
            [
              "Three bridges upload the same packet at once",
              "Atomic putIfAbsent on SHA-256(ciphertext), backed by a unique index on transactions.packet_hash.",
              code("IdempotencyService"),
            ],
            [
              "A captured packet is replayed later",
              "signedAt and a nonce inside the encrypted payload; packets older than 24 h are rejected.",
              code("BridgeIngestionService"),
            ],
          ]}
        />
        <p>
          The key design decision is what to deduplicate on. The packet ID can be rewritten by an intermediate, and
          the plaintext requires decrypting every duplicate first. The ciphertext is authenticated and byte-identical
          across honest deliveries, so it’s the right key.{" "}
          <Link href="/writing/deduplicate-before-you-decrypt">I wrote up that reasoning in more detail.</Link>
        </p>

        <h2 id="tests">Tests</h2>
        <ul>
          <li>{code("encryptDecryptRoundTrip")} — hybrid encryption is symmetric.</li>
          <li>{code("tamperedCiphertextIsRejected")} — one flipped byte returns {code("INVALID")}, not a crash or a settlement.</li>
          <li>
            {code("singlePacketDeliveredByThreeBridgesSettlesExactlyOnce")} — three threads deliver one packet at the
            same time; exactly one settles, two are dropped as duplicates, and the sender is debited once.
          </li>
        </ul>

        <h2 id="limits">Honest limits</h2>
        <p>
          This is a teaching demo of <strong>mesh-routed deferred settlement</strong>, not real-time offline UPI. The
          production swaps are documented in the README: PostgreSQL instead of H2, Redis {code("SET NX EX")} instead of
          an in-process map, keys in an HSM instead of regenerated at startup, mutual TLS for bridges, and real BLE
          instead of a simulator.
        </p>
        <Callout title="What the design can’t solve" tone="warn">
          The receiver can’t verify the sender has funds, and a sender can double-spend across two disconnected
          places — whichever packet reaches the server first wins. Real offline UPI addresses this with a pre-funded,
          hardware-backed wallet. Background Bluetooth on modern phones is also heavily restricted, which is why the
          mesh here is simulated.
        </Callout>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
