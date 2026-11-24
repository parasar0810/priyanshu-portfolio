import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/sections";
import { ButtonLink, PageHeader } from "@/components/ui";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: "View or download Priyanshu Parasar’s résumé (PDF) — software engineer, backend systems and applied AI, Gurugram, India.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <>
      <PageHeader eyebrow="Résumé" title="Résumé" lede={`${site.designation}. ${site.location}. One page, PDF.`}>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={site.resumePath} download>
            Download PDF
          </ButtonLink>
          <ButtonLink href={site.resumePath} variant="secondary" external>
            View résumé
          </ButtonLink>
        </div>
      </PageHeader>

      <Section id="summary" index="01" label="Summary" title="At a glance">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Experience</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {experience.map((r) => (
                <li key={r.company} className="flex flex-col justify-between gap-1 py-3 sm:flex-row">
                  <p><span className="font-semibold text-ink">{r.company}</span><span className="text-muted"> — {r.title}</span></p>
                  <p className="shrink-0 font-mono text-xs text-muted">{r.period}</p>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-muted">Education</h3>
            <p className="mt-3 flex flex-col justify-between gap-1 border-y border-line py-3 sm:flex-row">
              <span className="font-semibold text-ink">BML Munjal University — B.Tech, Computer Science Engineering</span>
              <span className="font-mono text-xs text-muted">Aug 2023 — 2027</span>
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Projects</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {projects.map((p) => (
                <li key={p.slug} className="py-3">
                  <Link href={`/projects/${p.slug}`} className="font-semibold text-ink hover:text-accent-ink">{p.name}</Link>
                  <p className="text-sm text-muted">{p.tagline}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
