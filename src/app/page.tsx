import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactBand } from "@/components/contact-band";
import {
  ExperienceTimeline,
  Hero,
  MoreSystems,
  ProjectRow,
  Section,
  SkillsGrid,
  TextLink,
} from "@/components/sections";
import { TechIcon } from "@/components/tech-icon";
import { ArrowIcon, ExternalLink } from "@/components/ui";
import { projects } from "@/content/projects";
import { formatDate, posts } from "@/content/writing";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const loop = [
  { step: "Observe", detail: "Prometheus alert → authenticated webhook" },
  { step: "Investigate", detail: "9 AI roles · MCP tools · A2A" },
  { step: "Decide", detail: "AegisCausal + deterministic policy" },
  { step: "Act", detail: "Human approves a registered hook" },
  { step: "Verify", detail: "Re-measure, attribute, record" },
];

export default function Home() {
  const flagship = projects.find((p) => p.flagship)!;
  const others = projects.filter((p) => !p.flagship);

  return (
    <>
      <Hero />

      {/* 01 — Flagship */}
      <Section
        id="flagship"
        index="01"
        label="Flagship"
        title="AegisOps — incident investigation that a human can trust"
        description={flagship.problem}
        action={<TextLink href="/projects/aegisops">Full case study</TextLink>}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-10">
          <Link href="/projects/aegisops" className="group block">
            <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
              <Image
                src="/images/aegisops/03_workspace_investigation.png"
                alt="AegisOps incident workspace: the investigation timeline of agent steps, cited evidence and the current diagnosis."
                width={1365}
                height={768}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <p className="mt-2.5 font-mono text-[0.7rem] text-muted">Unedited capture · incident workspace with agent steps and cited evidence</p>
          </Link>

          <div className="flex flex-col">
            <p className="text-[0.98rem] leading-relaxed text-ink-2">{flagship.summary}</p>
            <ol className="mt-6 divide-y divide-line border-y border-line" aria-label="The AegisOps loop">
              {loop.map((l, i) => (
                <li key={l.step} className="grid grid-cols-[2rem_6.5rem_1fr] items-baseline gap-2 py-2.5 text-sm">
                  <span className="font-mono text-xs text-accent-ink">0{i + 1}</span>
                  <span className="font-semibold text-ink">{l.step}</span>
                  <span className="text-ink-2">{l.detail}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line" aria-label="AegisOps results">
              {flagship.facts.map((f) => (
                <li key={f.label} className="bg-surface px-4 py-3">
                  <p className="font-semibold tracking-tight text-ink">{f.value}</p>
                  <p className="mt-0.5 text-xs leading-snug text-muted">{f.label}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/projects/aegisops" className="group inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2">
                Read the case study <ArrowIcon className="group-hover:translate-x-0.5" />
              </Link>
              <ExternalLink href={flagship.repo} className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                <TechIcon slug="github" className="h-4 w-4" /> Source on GitHub
              </ExternalLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 02 — Selected work */}
      <Section
        id="work"
        index="02"
        label="Selected work"
        title="More systems I’ve designed and built"
        description="Each links to a technical write-up. Diagrams are labelled as diagrams; screenshots are unedited."
        action={<TextLink href="/projects">All projects</TextLink>}
      >
        <div className="divide-y divide-line border-t border-line">
          {others.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i + 2} />
          ))}
        </div>
        <MoreSystems />
      </Section>

      {/* 03 — Experience */}
      <Section
        id="experience"
        index="03"
        label="Experience"
        title="Internships"
        description="ML evaluation in production, computer vision, and full-stack development."
        action={<TextLink href="/experience">Full details</TextLink>}
      >
        <ExperienceTimeline />
      </Section>

      {/* 04 — Skills */}
      <Section id="skills" index="04" label="Skills" title="Tools I’ve used in shipped work" description="Only technologies that appear on my résumé or in a public repository.">
        <SkillsGrid />
      </Section>

      {/* 05 — Writing */}
      <Section
        id="writing"
        index="05"
        label="Writing"
        title="Engineering notes"
        description="Write-ups of results that surprised me and bugs I learned from."
        action={<TextLink href="/writing">All writing</TextLink>}
      >
        <ul className="grid gap-x-10 border-t border-line md:grid-cols-2">
          {posts.slice(0, 6).map((p) => (
            <li key={p.slug} className="border-b border-line">
              <Link href={`/writing/${p.slug}`} className="group flex items-start justify-between gap-6 py-4">
                <span>
                  <span className="block font-medium leading-snug text-ink group-hover:text-accent-ink">{p.title}</span>
                  <span className="mt-1 block font-mono text-xs text-muted">
                    {p.project} · {p.readingTime} · <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </span>
                </span>
                <ArrowIcon className="mt-1.5 text-muted group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <ContactBand />
    </>
  );
}
