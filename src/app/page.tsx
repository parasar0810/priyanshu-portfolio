import type { Metadata } from "next";
import Link from "next/link";
import { FlagshipCard, ProjectCard } from "@/components/project-card";
import { ArrowIcon, ButtonLink, Container, SectionHeading } from "@/components/ui";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { ContactBand } from "@/components/contact-band";
import { formatDate, posts } from "@/content/writing";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const principles = [
  {
    title: "Deterministic code decides what runs",
    body: "Models rank and explain. Allowlists, policy checks and a human approval sit between a model and anything that changes state.",
  },
  {
    title: "Measure before claiming",
    body: "Baselines, paired tests and confidence intervals — and publishing the result when it says no.",
  },
  {
    title: "Prove the fix worked",
    body: "Recovery is re-measured after acting, and attributed to the action only when the evidence supports it.",
  },
];

export default function Home() {
  const flagship = projects.find((p) => p.flagship)!;
  const others = projects.filter((p) => !p.flagship);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="max-w-3xl animate-rise">
            <p className="flex items-center gap-2 font-mono text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {site.education}
            </p>
            <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-6xl">
              I build backend systems that make AI accountable.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              I’m {site.name}, a computer science student working on backend engineering and applied AI. My latest
              project, <Link href="/projects/aegisops" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">AegisOps</Link>, investigates production incidents with a team of LLM agents — then waits for a
              human to approve the fix and verifies that the service actually recovered.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/projects/aegisops">Read the AegisOps case study</ButtonLink>
              <ButtonLink href={site.resumePath} variant="secondary" download>
                Download résumé
              </ButtonLink>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {[
              { k: "Currently", v: "AI & Automation Intern, iSON Technologies" },
              { k: "Focus", v: "Backend systems · applied AI · observability" },
              { k: "Based in", v: site.location },
              { k: "Graduating", v: "2027" },
            ].map((x) => (
              <div key={x.k} className="bg-surface px-5 py-4">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">{x.k}</dt>
                <dd className="mt-1.5 text-sm font-medium leading-snug text-ink">{x.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Flagship */}
      <section aria-labelledby="work" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="work"
            eyebrow="Selected work"
            title="Systems I’ve designed, built and measured"
            action={
              <Link href="/projects" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-ink">
                All projects <ArrowIcon className="group-hover:translate-x-0.5" />
              </Link>
            }
          />
          <FlagshipCard project={flagship} />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section aria-labelledby="approach" className="border-y border-line bg-surface py-20 sm:py-24">
        <Container>
          <SectionHeading id="approach" eyebrow="How I work" title="Three habits that show up in everything I build" />
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.title} className="bg-surface p-6 sm:p-7">
                <span className="font-mono text-xs text-accent-ink">0{i + 1}</span>
                <h3 className="mt-3 font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Experience */}
      <section aria-labelledby="exp" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="exp"
            eyebrow="Experience"
            title="Where I’ve worked"
            action={
              <Link href="/experience" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-ink">
                Full experience <ArrowIcon className="group-hover:translate-x-0.5" />
              </Link>
            }
          />
          <ul className="divide-y divide-line border-y border-line">
            {experience.map((r) => (
              <li key={r.company} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <p className="font-mono text-xs leading-6 text-muted">{r.period}</p>
                <div>
                  <p className="font-semibold text-ink">
                    {r.company} <span className="font-normal text-muted">· {r.title}</span>
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{r.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Writing */}
      <section aria-labelledby="writing" className="pb-8">
        <Container>
          <SectionHeading
            id="writing"
            eyebrow="Writing"
            title="Engineering notes"
            description="Short write-ups of things that went wrong, or turned out differently than I expected."
            action={
              <Link href="/writing" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-ink">
                All writing <ArrowIcon className="group-hover:translate-x-0.5" />
              </Link>
            }
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/writing/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <p className="font-mono text-xs text-muted">
                    {p.project} · {p.readingTime}
                  </p>
                  <h3 className="mt-3 flex-1 font-semibold leading-snug tracking-tight text-ink group-hover:text-accent-ink">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-xs text-muted">
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ContactBand />
    </>
  );
}
