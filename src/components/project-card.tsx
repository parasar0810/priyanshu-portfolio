import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowIcon, TagList } from "./ui";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted">{project.year}</p>
        <p className="min-w-0 truncate font-mono text-xs text-muted">{project.status}</p>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-ink">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{project.tagline}</p>
      <dl className="mt-5 grid grid-cols-1 gap-2 border-t border-line pt-4">
        {project.facts.slice(0, 3).map((f) => (
          <div key={f.label} className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-muted">{f.label}</dt>
            <dd className="text-right font-medium text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex-1">
        <TagList items={project.stack.slice(0, 6)} label={`${project.name} technologies`} />
      </div>
      <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink">
        Read the case study <ArrowIcon className="group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}

export function FlagshipCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col p-7 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">Flagship project</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
              {project.name}
            </Link>
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-ink-2">{project.tagline}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{project.summary}</p>
          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6">
            {project.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="mt-1 font-semibold tracking-tight text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink">
            Read the full case study <ArrowIcon className="group-hover:translate-x-0.5" />
          </p>
        </div>
        {project.cover && (
          <div className="relative border-t border-line bg-subtle p-5 sm:p-8 lg:border-l lg:border-t-0">
            <div className="overflow-hidden rounded-xl border border-line shadow-lift transition-transform duration-500 group-hover:-translate-y-0.5">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={project.cover.width}
                height={project.cover.height}
                sizes="(min-width: 1024px) 560px, 100vw"
                preload
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 font-mono text-[0.7rem] text-muted">Unedited capture · AegisCausal view</p>
          </div>
        )}
      </div>
    </article>
  );
}
