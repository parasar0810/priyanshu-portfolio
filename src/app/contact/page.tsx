import type { Metadata } from "next";
import { Container, ExternalLink, PageHeader } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Priyanshu Parasar by email, LinkedIn or GitHub.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, external: false, note: "Best for roles and interviews" },
  { label: "LinkedIn", value: `in/${site.linkedinHandle}`, href: site.linkedin, external: true, note: "Professional background" },
  { label: "GitHub", value: `@${site.githubHandle}`, href: site.github, external: true, note: "Source for my projects" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s talk"
        lede="I’m looking for software engineering internships and 2027 new-grad roles in backend, infrastructure and applied AI. Email is the fastest way to reach me."
      />
      <Container className="py-14 sm:py-16">
        <ul className="grid gap-4 md:grid-cols-3">
          {channels.map((c) => {
            const inner = (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{c.label}</p>
                <p className="mt-3 break-all text-lg font-semibold tracking-tight text-ink group-hover:text-accent-ink">{c.value}</p>
                <p className="mt-2 text-sm text-muted">{c.note}</p>
              </>
            );
            const cls =
              "group block h-full rounded-lg border border-line bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift";
            return (
              <li key={c.label}>
                {c.external ? (
                  <ExternalLink href={c.href} className={cls}>
                    {inner}
                  </ExternalLink>
                ) : (
                  <a href={c.href} className={cls}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-sm text-muted">Based in {site.location}.</p>
      </Container>
    </>
  );
}
