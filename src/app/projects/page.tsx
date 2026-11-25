import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MoreSystems, ProjectRow, Section, TextLink } from "@/components/sections";
import { PageHeader } from "@/components/ui";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Technical case studies: AegisOps (multi-agent incident response), Live Meeting Copilot (real-time agents), OWN-AI (vector database from first principles), UPI Offline Mesh, plus FlowGuard, Meterly and AegisPay.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const flagship = projects.find((p) => p.flagship)!;
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Case studies"
        lede="Ordered by depth. Each write-up covers the problem, architecture, decisions, testing and what didn’t work."
      />

      <Section id="flagship" index="01" label="Flagship" title={flagship.name} description={flagship.tagline} action={<TextLink href="/projects/aegisops">Read the case study</TextLink>}>
        <Link href="/projects/aegisops" className="group grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10">
          <div className="overflow-hidden rounded-lg border border-line shadow-soft transition-shadow group-hover:shadow-lift">
            <Image src="/images/aegisops/05_causal_graph.png" alt="AegisCausal dependency graph and competing explanations from AegisOps." width={1365} height={768} sizes="(min-width: 768px) 640px, 100vw" className="h-auto w-full" />
          </div>
          <div>
            <p className="text-[0.98rem] leading-relaxed text-ink-2">{flagship.summary}</p>
            <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {flagship.facts.map((f) => (
                <li key={f.label} className="bg-surface px-4 py-3">
                  <p className="font-semibold text-ink">{f.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{f.label}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-xs text-muted">{flagship.stack.join(" · ")}</p>
          </div>
        </Link>
      </Section>

      <Section id="selected" index="02" label="Selected work" title="Systems with full write-ups">
        <div className="divide-y divide-line border-t border-line">
          {projects.filter((p) => !p.flagship).map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i + 2} />
          ))}
        </div>
      </Section>

      <Section id="more" index="03" label="Also built" title="Smaller backend systems" description="Public repositories with focused scope — linked to source rather than full case studies.">
        <MoreSystems />
      </Section>
    </>
  );
}
