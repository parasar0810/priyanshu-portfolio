import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand } from "@/components/contact-band";
import { Container, PageHeader } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Education, interests and how Priyanshu Parasar approaches engineering.",
  alternates: { canonical: "/about" },
};

const facts = [
  { k: "Education", v: "B.Tech, Computer Science Engineering" },
  { k: "University", v: "BML Munjal University" },
  { k: "Years", v: "Aug 2023 — 2027" },
  { k: "Location", v: site.location },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Backend engineering, with AI where it earns its place"
        lede="I’m a computer science student who likes the unglamorous parts of systems: the evaluation harness, the idempotency key, the policy check that sits between a model and production."
      />
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div className="prose-editorial max-w-[44rem]">
            <h2 className="!mt-0">What I work on</h2>
            <p>
              Most of what I build sits where backend engineering meets applied AI. At iSON Technologies I’ve spent my
              internship on the evaluation side of an ML ticket-routing model: building a holdout, tracing a low
              automation ceiling to mislabeled training data, and turning diagnostic scripts into a service fast enough
              to run per ticket. Before that I trained and served a traffic-sign classifier at Tata Technologies, and
              built a ticket-management system at Tata Motors.
            </p>
            <p>
              My own projects follow the same thread. <Link href="/projects/aegisops">AegisOps</Link> asks how an AI
              system can help during a production incident without being trusted blindly.{" "}
              <Link href="/projects/live-meeting-copilot">Live Meeting Copilot</Link> runs four AI agents concurrently over a streaming transcript without letting a slow client stall the rest.{" "}
              <Link href="/projects/upi-offline-mesh">UPI Offline Mesh</Link> is about getting exactly-once settlement
              out of an unreliable, adversarial delivery path. <Link href="/projects/own-ai">OWN-AI</Link> rebuilds
              vector search from the index structures up — and measures where each one wins.
            </p>

            <h2>How I approach engineering</h2>
            <ul>
              <li>
                <strong>Put deterministic checks around probabilistic components.</strong> Models are good at ranking
                and explaining; allowlists, schemas and human approval decide what actually runs.
              </li>
              <li>
                <strong>Build the evaluation before the claim.</strong> A baseline, identical inputs and a paired test
                tell you more than a demo — even, or especially, when the answer is “no difference”.
              </li>
              <li>
                <strong>Write down the limits.</strong> The AegisOps and UPI Offline Mesh READMEs both end with
                what the system doesn’t do. Naming limits up front keeps the claims honest.
              </li>
            </ul>

            <h2>Interests</h2>
            <p>
              Reliability and incident response, observability, distributed-systems correctness (idempotency,
              concurrency, transactions), and evaluation methodology for LLM systems.
            </p>
          </div>

          <aside aria-label="Quick facts" className="lg:pt-1">
            <dl className="rounded-lg border border-line bg-surface p-6 shadow-soft">
              {facts.map((f) => (
                <div key={f.k} className="border-b border-line py-3 first:pt-0 last:border-0 last:pb-0">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">{f.k}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Container>
      <ContactBand />
    </>
  );
}
