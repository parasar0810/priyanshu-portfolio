import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { ButtonLink, Container, PageHeader, TagList } from "@/components/ui";
import { experience, skills } from "@/content/experience";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description: "Internships at iSON Technologies, Tata Technologies and Tata Motors.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Internships"
        lede="Three internships across ML evaluation, computer vision and full-stack development."
      >
        <div className="mt-7">
          <ButtonLink href={site.resumePath} variant="secondary" download>
            Download résumé (PDF)
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="py-14 sm:py-16">
        <ol className="relative space-y-6">
          {experience.map((r) => (
            <li key={r.company}>
              <article className="grid gap-6 rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8 md:grid-cols-[14rem_1fr] md:gap-10">
                <div>
                  <p className="font-mono text-xs text-muted">
                    <time dateTime={r.start}>{r.period}</time>
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{r.company}</h2>
                  <p className="mt-1 text-sm text-ink-2">{r.title}</p>
                  {r.current && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-wash px-2.5 py-0.5 text-xs font-medium text-accent-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      Current
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[0.98rem] leading-relaxed text-ink">{r.summary}</p>
                  <div className="prose-editorial mt-4 !text-[0.95rem]">
                    <ul>
                      {r.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5">
                    <TagList items={r.stack} label={`${r.company} skills`} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <section aria-labelledby="skills" className="mt-20">
          <h2 id="skills" className="text-2xl font-semibold tracking-tight text-ink">
            Skills
          </h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-3 py-4 sm:grid-cols-[13rem_1fr]">
                <dt className="text-sm font-medium text-ink">{s.group}</dt>
                <dd>
                  <TagList items={s.items} label={s.group} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
      <ContactBand />
    </>
  );
}
