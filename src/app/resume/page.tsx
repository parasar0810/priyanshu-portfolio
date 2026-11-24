import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Download Priyanshu Parasar’s résumé (PDF).",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <>
      <PageHeader eyebrow="Résumé" title="Résumé" lede="A one-page summary. The PDF is the version I send with applications.">
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={site.resumePath} download>
            Download PDF
          </ButtonLink>
          <ButtonLink href={site.resumePath} variant="secondary" external>
            Open in browser
          </ButtonLink>
        </div>
      </PageHeader>
      <Container className="py-14 sm:py-16">
        <div className="max-w-3xl space-y-12">
          <section aria-labelledby="r-edu">
            <h2 id="r-edu" className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Education</h2>
            <div className="mt-4 flex flex-col justify-between gap-1 sm:flex-row">
              <p className="font-semibold text-ink">BML Munjal University — B.Tech, Computer Science Engineering</p>
              <p className="font-mono text-xs text-muted">Aug 2023 — 2027</p>
            </div>
          </section>
          <section aria-labelledby="r-exp">
            <h2 id="r-exp" className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Experience</h2>
            <ul className="mt-4 space-y-4">
              {experience.map((r) => (
                <li key={r.company} className="flex flex-col justify-between gap-1 sm:flex-row">
                  <p>
                    <span className="font-semibold text-ink">{r.company}</span>
                    <span className="text-muted"> — {r.title}</span>
                  </p>
                  <p className="shrink-0 font-mono text-xs text-muted">{r.period}</p>
                </li>
              ))}
            </ul>
            <Link href="/experience" className="mt-4 inline-block text-sm font-medium text-accent-ink hover:underline">
              Full details →
            </Link>
          </section>
          <section aria-labelledby="r-proj">
            <h2 id="r-proj" className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Projects</h2>
            <ul className="mt-4 space-y-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="font-semibold text-ink hover:text-accent-ink">
                    {p.name}
                  </Link>
                  <span className="text-muted"> — {p.tagline}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
