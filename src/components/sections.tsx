import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { experience, skills } from "@/content/experience";
import { moreSystems, type Project } from "@/content/projects";
import { highlights, site } from "@/content/site";
import { MeetingThumb, OwnAiThumb, UpiThumb } from "./diagrams";
import { TechIcon } from "./tech-icon";
import { ArrowIcon, Container, DownloadIcon, ExternalLink, cx } from "./ui";

/* ------------------------------------------------------------------ */
/* Section header: numbered mono label + title on one compact row.    */
/* ------------------------------------------------------------------ */
export function Section({
  index, label, title, description, action, id, children, className,
}: {
  index: string; label: string; title: string; description?: ReactNode; action?: ReactNode; id: string; children: ReactNode; className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cx("border-t border-line py-14 sm:py-16", className)}>
      <Container>
        <div className="mb-8 grid gap-3 lg:grid-cols-[13rem_1fr_auto] lg:items-start lg:gap-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted lg:pt-2.5">
            <span className="text-accent-ink">{index}</span> — {label}
          </p>
          <div className="max-w-2xl">
            <h2 id={id} className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">{title}</h2>
            {description && <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{description}</p>}
          </div>
          {action && <div className="lg:pt-2">{action}</div>}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-ink">
      {children} <ArrowIcon className="group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Icons for social links                                             */
/* ------------------------------------------------------------------ */
export function SocialLinks({ className }: { className?: string }) {
  const item = "inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink";
  return (
    <ul className={cx("flex flex-wrap items-center gap-x-5 gap-y-2", className)} aria-label="Profiles">
      <li>
        <ExternalLink href={site.github} className={item}>
          <TechIcon slug="github" /> GitHub
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href={site.linkedin} className={item}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
          LinkedIn
        </ExternalLink>
      </li>
      <li>
        <a href={`mailto:${site.email}`} className={item}>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" /><path d="m2.5 4.5 5.5 4 5.5-4" /></svg>
          {site.email}
        </a>
      </li>
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */
export function Hero() {
  return (
    <section className="overflow-hidden">
      <Container className="grid gap-12 pb-12 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:pb-16">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-wash px-3 py-1 text-xs font-medium text-accent-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {site.availability}
          </p>
          <h1 className="mt-6 text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-5xl">
            {site.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-ink-2 sm:text-xl">{site.designation}</p>
          <p className="mt-5 max-w-xl text-[1.04rem] leading-relaxed text-muted">
            I build backend services and the infrastructure around AI models — evaluation harnesses, policy gates, observability and
            idempotent data paths. My flagship project, <Link href="/projects/aegisops" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">AegisOps</Link>,
            investigates production incidents with nine AI agents, then waits for a human to approve the fix and re-measures the
            service before calling it recovered.
          </p>
          <dl className="mt-6 grid max-w-xl grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex gap-2"><dt className="text-muted">Based in</dt><dd className="font-medium text-ink">{site.location}</dd></div>
            <div className="flex gap-2"><dt className="text-muted">Education</dt><dd className="font-medium text-ink">B.Tech CSE · 2027</dd></div>
            <div className="flex gap-2 sm:col-span-2"><dt className="text-muted">Now</dt><dd className="font-medium text-ink">AI & Automation Engineer Intern, iSON Technologies</dd></div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="group inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-ink-2">
              View projects <ArrowIcon className="group-hover:translate-x-0.5" />
            </Link>
            <a href={site.resumePath} download className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-ink-2">
              Download résumé <DownloadIcon />
            </a>
          </div>
          <SocialLinks className="mt-7" />
        </div>

        {/* Real screenshots from AegisOps, layered. */}
        <div className="relative animate-rise [animation-delay:120ms]">
          <figure>
            <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-lift">
              <div className="flex items-center gap-1.5 border-b border-line bg-subtle px-3 py-2" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" />
                <span className="ml-2 font-mono text-[0.68rem] text-ink-2">AegisOps · incident dashboard</span>
              </div>
              <Image
                src="/images/aegisops/01_dashboard.png"
                alt="AegisOps dashboard showing open incidents, pending approvals, resolved and verified incidents with MTTR, and AI usage."
                width={1365}
                height={768}
                preload
                sizes="(min-width: 1024px) 620px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <div className="absolute -bottom-8 -left-10 hidden w-[52%] overflow-hidden rounded-lg border border-line bg-surface shadow-lift lg:block">
              <Image
                src="/images/aegisops/05_causal_graph.png"
                alt="AegisCausal dependency graph and competing causal explanations."
                width={1365}
                height={768}
                sizes="320px"
                className="aspect-[16/10] w-full object-cover object-[62%_0%]"
              />
            </div>
            <figcaption className="mt-3 text-right font-mono text-[0.7rem] text-muted lg:mt-4 lg:pl-[50%]">
              Unedited captures · AegisOps dashboard and AegisCausal
            </figcaption>
          </figure>
        </div>
      </Container>

      {/* Verified highlights */}
      <Container>
        <ul aria-label="Verified highlights" className="grid grid-cols-2 gap-px overflow-hidden border-y border-line bg-line lg:grid-cols-5">
          {highlights.map((h, i) => (
            <li key={h.label} className={cx("bg-canvas py-4 pr-3 sm:px-4 lg:py-5", i === 0 && "lg:pl-0", i === highlights.length - 1 && "col-span-2 lg:col-span-1")}>
              <p className="font-mono text-[0.98rem] font-semibold tracking-tight text-ink sm:text-[1.05rem]">{h.value}</p>
              <p className="mt-1 text-[0.8rem] leading-snug text-ink-2">{h.label}</p>
              <p className="mt-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">{h.source}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Project thumbnails and rows                                        */
/* ------------------------------------------------------------------ */
export function ProjectThumb({ project, className }: { project: Project; className?: string }) {
  const isShot = !!project.cover;
  return (
    <div className={cx("relative overflow-hidden rounded-md border border-line bg-subtle", className)}>
      {isShot ? (
        <Image
          src={project.cover!.src}
          alt={project.cover!.alt}
          width={project.cover!.width}
          height={project.cover!.height}
          sizes="(min-width: 1024px) 420px, 100vw"
          className="aspect-[16/10] w-full object-cover object-left-top"
        />
      ) : project.thumb === "meeting" ? (
        <MeetingThumb />
      ) : project.thumb === "ownai" ? (
        <OwnAiThumb />
      ) : (
        <UpiThumb />
      )}
      <span className="absolute right-2 top-2 rounded bg-surface/90 px-1.5 py-0.5 font-mono text-[0.62rem] text-ink-2 ring-1 ring-line">
        {isShot ? "Screenshot" : "Architecture diagram"}
      </span>
    </div>
  );
}

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group relative grid gap-6 py-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <Link href={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true" className="block">
        <ProjectThumb project={project} className="transition-shadow duration-300 group-hover:shadow-lift" />
      </Link>
      <div className="min-w-0">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          {String(index).padStart(2, "0")} · {project.kind}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent-ink">{project.name}</Link>
        </h3>
        <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ink-2">{project.tagline}</p>
        <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-ink-2 sm:grid-cols-2">
          {project.features.map((f) => (
            <li key={f} className="flex gap-2"><span className="mt-[0.55rem] h-px w-2.5 shrink-0 bg-accent" aria-hidden="true" />{f}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <p className="font-mono text-xs text-muted">{project.stack.slice(0, 5).join(" · ")}</p>
          <div className="flex items-center gap-5">
            {project.repo && (
              <ExternalLink href={project.repo} className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                <TechIcon slug="github" className="h-3.5 w-3.5" /> Source
              </ExternalLink>
            )}
            <TextLink href={`/projects/${project.slug}`}>Case study</TextLink>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MoreSystems() {
  return (
    <div className="mt-4">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">More backend systems</h3>
      <ul className="divide-y divide-line border-y border-line">
        {moreSystems.map((s) => (
          <li key={s.name} className="grid gap-2 py-4 md:grid-cols-[12rem_1fr_auto] md:gap-8">
            <div>
              <p className="font-semibold text-ink">{s.name}</p>
              <p className="text-sm text-muted">{s.what}</p>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-ink-2">{s.detail}</p>
              <p className="mt-1.5 font-mono text-xs text-muted">{s.stack.join(" · ")}</p>
            </div>
            <ExternalLink href={s.repo} className="inline-flex items-center gap-1.5 self-start text-sm text-ink-2 hover:text-ink">
              <TechIcon slug="github" className="h-3.5 w-3.5" /> Source <ArrowIcon external />
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Experience timeline                                                */
/* ------------------------------------------------------------------ */
export function ExperienceTimeline({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="relative">
      {experience.map((r, i) => (
        <li key={r.company} className="relative grid gap-4 pb-10 last:pb-0 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
          {/* rail */}
          {i < experience.length - 1 && <span aria-hidden="true" className="absolute left-[1.05rem] top-11 hidden h-[calc(100%-2.75rem)] w-px bg-line md:left-[calc(13rem+1.55rem)] md:block" />}
          <div className="flex items-center gap-3 md:block">
            <p className="font-mono text-xs text-muted"><time dateTime={r.start}>{r.period}</time></p>
            {r.current && (
              <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-wash px-2 py-0.5 text-[0.7rem] font-medium text-accent-ink md:mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Current
              </p>
            )}
          </div>
          <div className="relative md:pl-12">
            <span aria-hidden="true" className="absolute left-0 top-0 hidden h-8 w-8 place-items-center rounded-md border border-line bg-surface font-mono text-[0.7rem] font-semibold text-ink md:grid">
              {r.initials}
            </span>
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              {r.company} <span className="font-normal text-muted">· {r.title}</span>
            </h3>
            <p className="mt-1 text-[0.96rem] leading-relaxed text-ink-2">{r.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${r.company} results`}>
              {r.metrics.map((m) => (
                <li key={m.label} className="rounded-md border border-line bg-surface px-3 py-2">
                  <p className="font-mono text-sm font-semibold text-ink">{m.value}</p>
                  <p className="text-[0.74rem] text-muted">{m.label}</p>
                </li>
              ))}
            </ul>
            {detailed && (
              <ul className="mt-4 space-y-2 text-[0.95rem] leading-relaxed text-ink-2">
                {r.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5"><span className="mt-[0.7rem] h-px w-2.5 shrink-0 bg-muted" aria-hidden="true" />{h}</li>
                ))}
              </ul>
            )}
            <p className="mt-3 font-mono text-xs text-muted">{r.stack.join(" · ")}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                             */
/* ------------------------------------------------------------------ */
export function SkillsGrid() {
  return (
    <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((g) => (
        <div key={g.group} className="bg-surface p-5">
          <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">{g.group}</dt>
          <dd className="mt-3">
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li key={s.name} className="inline-flex items-center gap-1.5 rounded border border-line bg-canvas px-2 py-1 text-[0.8rem] text-ink">
                  <TechIcon slug={s.icon} className="h-3.5 w-3.5 text-ink-2" />
                  {s.name}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
