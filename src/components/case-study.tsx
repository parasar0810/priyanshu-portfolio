import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/content/projects";
import { ButtonLink, Container, Eyebrow, TagList } from "./ui";

export function CaseStudyHeader({ project, children }: { project: Project; children?: ReactNode }) {
  return (
    <header className="border-b border-line pb-12 pt-10 sm:pb-16 sm:pt-14">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/projects" className="hover:text-ink">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {project.name}
            </li>
          </ol>
        </nav>
        <div className="max-w-3xl animate-rise">
          <Eyebrow className="mb-4">
            Case study · {project.year}
          </Eyebrow>
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-[3.25rem] sm:leading-[1.05]">
            {project.name}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-2">{project.tagline}</p>
          <p className="mt-4 text-base leading-relaxed text-muted">{project.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {project.repo ? (
              <ButtonLink href={project.repo} external>
                View source on GitHub
              </ButtonLink>
            ) : (
              <span className="rounded-lg border border-dashed border-line-strong px-4 py-2.5 text-sm text-muted">
                {project.repoNote}
              </span>
            )}
            <span className="text-sm text-muted">{project.status}</span>
          </div>
        </div>
        <div className="mt-10 max-w-3xl">
          <TagList items={project.stack} label={`${project.name} technologies`} />
        </div>
        {children}
      </Container>
    </header>
  );
}

export function CaseStudyBody({ toc, children }: { toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <Container className="py-14 sm:py-16">
      <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="On this page" className="mb-10 hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">On this page</p>
            <ol className="space-y-2 border-l border-line text-sm">
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
        <article className="prose-editorial min-w-0 max-w-[50rem]">{children}</article>
      </div>
    </Container>
  );
}

/** Wide block that breaks out of the prose measure on large screens. */
export function Wide({ children }: { children: ReactNode }) {
  return <div className="not-prose my-10">{children}</div>;
}

export function StatRow({ stats }: { stats: { value: string; label: string; note?: string }[] }) {
  return (
    <dl className="not-prose mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface px-5 py-5">
          <dt className="text-xs leading-snug text-muted">{s.label}</dt>
          <dd className="mt-2 text-2xl font-semibold tracking-tight text-ink">{s.value}</dd>
          {s.note && <dd className="mt-1 text-xs leading-snug text-muted">{s.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function SimpleTable({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[560px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-subtle">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-medium text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
