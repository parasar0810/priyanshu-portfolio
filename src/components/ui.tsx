import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent-ink", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h2 id={id} className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
          {title}
        </h2>
        {description && <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[0.72rem] text-ink-2">
      {children}
    </span>
  );
}

export function TagList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function ArrowIcon({ className, external }: { className?: string; external?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cx("h-3.5 w-3.5 shrink-0 transition-transform duration-200", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {external ? <path d="M5 11 11 5M6 5h5v5" /> : <path d="M3 8h10M9 4l4 4-4 4" />}
    </svg>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  download?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", external, download, className }: ButtonProps) {
  const styles = {
    primary: "bg-ink text-white hover:bg-ink-2 shadow-soft",
    secondary: "border border-line-strong bg-surface text-ink hover:border-ink-2 hover:bg-subtle",
    ghost: "text-ink hover:text-accent-ink",
  }[variant];
  const cls = cx(
    "group inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
    styles,
    className,
  );
  const icon = <ArrowIcon external={external} className="group-hover:translate-x-0.5" />;
  if (external || download) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {children}
        {download ? <DownloadIcon /> : icon}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
    </svg>
  );
}

export function ExternalLink({ href, children, className, ...rest }: ComponentProps<"a">) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("rounded-lg border border-line bg-surface shadow-soft", className)}>{children}</div>
  );
}

/** A restrained note used for honest caveats and engineering lessons. */
export function Callout({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: ReactNode;
  tone?: "neutral" | "accent" | "warn";
}) {
  const tones = {
    neutral: "border-line bg-subtle",
    accent: "border-accent/30 bg-accent-wash",
    warn: "border-amber-200 bg-warn-wash",
  }[tone];
  const titleTone = { neutral: "text-ink", accent: "text-accent-ink", warn: "text-warn-ink" }[tone];
  return (
    <aside className={cx("not-prose rounded-xl border px-5 py-4", tones)}>
      <p className={cx("mb-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em]", titleTone)}>{title}</p>
      <div className="text-[0.95rem] leading-relaxed text-ink-2 [&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ink">{children}</div>
    </aside>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="pb-10 pt-10 sm:pb-12 sm:pt-14">
      <Container>
        <div className="max-w-3xl animate-rise">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <h1 className="text-[2.1rem] font-semibold tracking-[-0.025em] text-ink sm:text-[2.6rem]">{title}</h1>
          {lede && <p className="mt-4 text-[1.05rem] leading-relaxed text-muted sm:text-lg">{lede}</p>}
          {children}
        </div>
      </Container>
    </header>
  );
}
