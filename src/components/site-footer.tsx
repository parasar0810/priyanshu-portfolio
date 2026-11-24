import Link from "next/link";
import { nav, site } from "@/content/site";
import { Container, ExternalLink } from "./ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <p className="font-semibold text-ink">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            {site.designation}. {site.education}.
          </p>
          <p className="mt-2 text-sm text-ink-2">{site.location}</p>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">Site</p>
          <ul className="space-y-2 text-sm">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/resume", label: "Résumé" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink-2 hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="text-ink-2 hover:text-ink">
                Email
              </a>
            </li>
            <li>
              <ExternalLink href={site.github} className="text-ink-2 hover:text-ink">
                GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={site.linkedin} className="text-ink-2 hover:text-ink">
                LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© 2026 {site.name}</p>
        <p>Built with Next.js, TypeScript and Tailwind CSS. Screenshots are unedited captures from the projects.</p>
      </Container>
    </footer>
  );
}
