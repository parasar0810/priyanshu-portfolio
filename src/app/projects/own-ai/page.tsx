import type { Metadata } from "next";
import { CaseStudyBody, CaseStudyHeader, SimpleTable } from "@/components/case-study";
import { ContactBand } from "@/components/contact-band";
import { getProject } from "@/content/projects";

const project = getProject("own-ai")!;

export const metadata: Metadata = {
  title: "OWN-AI",
  description:
    "A from-scratch vector search and RAG platform in Python: HNSW, KD-tree and brute-force indexes, three distance metrics and a benchmarking workflow.",
  alternates: { canonical: "/projects/own-ai" },
  openGraph: { url: "/projects/own-ai", type: "article", images: ["/opengraph-image"] },
};

const toc = [
  { id: "why", label: "Why build it" },
  { id: "what", label: "What it does" },
  { id: "indexes", label: "Index strategies" },
];

export default function OwnAiPage() {
  return (
    <>
      <CaseStudyHeader project={project} />
      <CaseStudyBody toc={toc}>
        <h2 id="why">Why build it</h2>
        <p>
          Vector databases are usually used as a black box. OWN-AI implements the retrieval layer directly so the
          trade-offs between index structures are visible and measurable rather than hidden behind a client library.
        </p>

        <h2 id="what">What it does</h2>
        <ul>
          <li>Ingests documents, chunks them and stores 768-dimensional embeddings generated locally with Ollama.</li>
          <li>Searches with cosine, Euclidean or Manhattan distance.</li>
          <li>Exposes search and document question-answering through FastAPI REST endpoints.</li>
          <li>Benchmarks and visualises how each index strategy behaves, including search latency.</li>
        </ul>

        <h2 id="indexes">Index strategies</h2>
        <SimpleTable
          caption="Index strategies implemented in OWN-AI"
          head={["Index", "How it searches", "Trade-off"]}
          rows={[
            ["Brute force", "Compares the query with every vector", "Exact results; cost grows linearly with the corpus"],
            ["KD-tree", "Partitions space along coordinate axes", "Fast in low dimensions; degrades as dimensionality rises"],
            ["HNSW", "Navigates a layered proximity graph", "Approximate; designed for high-dimensional search"],
          ]}
        />
        <p className="text-sm text-muted">
          The source for OWN-AI isn’t published on GitHub yet, so this page describes the project at the level of my
          résumé.
        </p>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
