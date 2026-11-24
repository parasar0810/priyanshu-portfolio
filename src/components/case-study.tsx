import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/content/projects";
import { TechIcon } from "./tech-icon";
import { ArrowIcon, Container, Eyebrow, ExternalLink, TagList } from "./ui";

export function CaseStudyHeader({ project, children }: { project: Project; children?: ReactNode }) {
  return (
    <header className="pb-10 pt-8 sm:pt-10">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex items-center gap-2">
            <li><Link href="/projects" className="hover:text-ink">Projects</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{project.name}</li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <div className="animate-rise">
            <Eyebrow className="mb-3">{project.kind}</Eyebrow>
            <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.8rem] sm:leading-[1.06]">{project.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">{project.tagline}</p>
            <p className="mt-3 max-w-3xl text-[0.98rem] leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-6">
              <TagList items={project.stack} label={`${project.name} technologies`} />
            </div>
          </div>
          <aside aria-label="Project links and status" className="self-start rounded-lg border border-line bg-surface p-5 text-sm">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">Status</p>
            <p className="mt-1 text-ink">{project.status}</p>
            <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
              {project.repo && (
                <li>
                  <ExternalLink href={project.repo} className="group inline-flex items-center gap-2 font-medium text-ink hover:text-accent-ink">
                    <TechIcon slug="github" className="h-4 w-4" /> Source on GitHub <ArrowIcon external />
                  </ExternalLink>
                </li>
              )}
              {project.demo?.map((d) => (
                <li key={d.href}>
                  <ExternalLink href={d.href} className="group inline-flex items-center gap-2 font-medium text-ink hover:text-accent-ink">
                    <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> {d.label} <ArrowIcon external />
                  </ExternalLink>
                  {d.note && <p className="ml-4 text-xs text-muted">{d.note}</p>}
                </li>
              ))}
            </ul>
            {project.demo && (
              <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">
                The demo runs on a single EC2 instance and may be stopped to control cost.
              </p>
            )}
          </aside>
        </div>
        {children}
      </Container>
    </header>
  );
}

export function CaseStudyBody({ toc, children }: { toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <div className="border-t border-line">
      <Container className="py-12 sm:py-14">
        <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
          <nav aria-label="On this page" className="mb-10 hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">On this page</p>
              <ol className="space-y-1.5 border-l border-line text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:border-ink hover:text-ink">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <article className="prose-editorial min-w-0">{children}</article>
        </div>
      </Container>
    </div>
  );
}

/** Constrains running text to a readable measure while wide blocks use the full column. */
export function Measure({ children }: { children: ReactNode }) {
  return <div className="max-w-[46rem] [&>*+*]:mt-[1.15em]">{children}</div>;
}

export function Wide({ children }: { children: ReactNode }) {
  return <div className="not-prose my-8 [contain-intrinsic-size:auto_640px] [content-visibility:auto]">{children}</div>;
}

export function StatRow({ stats }: { stats: { value: string; label: string; note?: string }[] }) {
  return (
    <ul className="not-prose mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4" aria-label="Key results">
      {stats.map((s) => (
        <li key={s.label} className="bg-surface px-5 py-4">
          <p className="text-[1.6rem] font-semibold tracking-tight text-ink">{s.value}</p>
          <p className="mt-1 text-[0.82rem] leading-snug text-ink-2">{s.label}</p>
          {s.note && <p className="mt-1 font-mono text-[0.68rem] text-muted">{s.note}</p>}
        </li>
      ))}
    </ul>
  );
}

export function SimpleTable({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-line bg-surface" data-scroll-x>
      <table className="w-full min-w-[560px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-subtle">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-medium text-ink">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Two- or three-up grid of short titled notes — used for features and decisions. */
export function NoteGrid({ items, cols = 2 }: { items: { title: string; body: ReactNode; tag?: string }[]; cols?: 2 | 3 }) {
  return (
    <ul className={`not-prose my-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((it) => (
        <li key={it.title} className="bg-surface p-5">
          {it.tag && <p className="mb-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-accent-ink">{it.tag}</p>}
          <p className="font-semibold text-ink">{it.title}</p>
          <div className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-2 [&_code]:rounded [&_code]:bg-subtle [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.82em]">{it.body}</div>
        </li>
      ))}
    </ul>
  );
}
