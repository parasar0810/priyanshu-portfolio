import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { ExperienceTimeline, Section, SkillsGrid } from "@/components/sections";
import { ButtonLink, PageHeader } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Internships at iSON Technologies (ML ticket-routing validation), Tata Technologies (ADAS traffic-sign detection) and Tata Motors (full-stack ticketing), plus technical skills.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Internships & skills"
        lede="Three internships across production ML evaluation, computer vision and full-stack development. Every number below is from my résumé."
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={site.resumePath} download>
            Download résumé
          </ButtonLink>
          <ButtonLink href={site.resumePath} variant="secondary" external>
            View résumé
          </ButtonLink>
        </div>
      </PageHeader>

      <Section id="timeline" index="01" label="Timeline" title="Where I’ve worked" description="Most recent first. Client and employer details are limited to what is on my résumé.">
        <ExperienceTimeline detailed />
      </Section>

      <Section id="skills" index="02" label="Skills" title="Technical skills" description="Grouped by area. Only technologies that appear on my résumé or in a public repository — no proficiency percentages.">
        <SkillsGrid />
      </Section>
      <ContactBand />
    </>
  );
}
