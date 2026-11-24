import type { Metadata } from "next";
import { FlagshipCard, ProjectCard } from "@/components/project-card";
import { Container, PageHeader } from "@/components/ui";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies: AegisOps, UPI Offline Mesh and OWN-AI.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const flagship = projects.find((p) => p.flagship)!;
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Case studies"
        lede="Each project includes the architecture, the decisions behind it, and an honest account of what did and didn’t work."
      />
      <Container className="py-14 sm:py-16">
        <h2 className="sr-only">All projects</h2>
        <FlagshipCard project={flagship} />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects
            .filter((p) => !p.flagship)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
        </div>
      </Container>
    </>
  );
}
