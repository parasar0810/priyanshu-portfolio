/**
 * Projects. Sources:
 *  - AegisOps: github.com/parasar0810/Aegisops (README, AEGISBENCH_RESULTS.md, AEGISOPS_FINAL_TEST_REPORT.md)
 *  - UPI Offline Mesh: github.com/parasar0810/UpiWithoutInternet (README + source tree)
 *  - OWN-AI: résumé only — the public GitHub repository is currently empty.
 */
export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  year: string;
  status: string;
  stack: string[];
  repo?: string;
  repoNote?: string;
  cover?: { src: string; alt: string; width: number; height: number };
  facts: { label: string; value: string }[];
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    slug: "aegisops",
    name: "AegisOps",
    tagline: "Multi-agent incident investigation with human-approved, verified remediation.",
    summary:
      "A FastAPI platform that turns a Prometheus alert into an evidence-backed diagnosis, a remediation a human must approve, and an independently verified recovery — with every step recorded in a hash-chained, replayable log.",
    year: "2026",
    status: "Research & portfolio project · ran on AWS EC2",
    stack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Google ADK",
      "CrewAI",
      "MCP",
      "A2A",
      "Gemini",
      "Prometheus",
      "Alertmanager",
      "Docker",
      "AWS",
    ],
    repo: "https://github.com/parasar0810/Aegisops",
    cover: {
      src: "/images/aegisops/05_causal_graph.png",
      alt: "AegisOps causal view: a dependency graph from shopfront-web to shopfront-api to shopfront-db, with competing causal explanations and an evidence timeline.",
      width: 1365,
      height: 768,
    },
    facts: [
      { label: "Live AWS scenarios", value: "8 / 8 passed" },
      { label: "Automated tests", value: "129" },
      { label: "Benchmark scenarios", value: "15 + 3 hard" },
      { label: "Accuracy vs single LLM", value: "No significant gain" },
    ],
    flagship: true,
  },
  {
    slug: "upi-offline-mesh",
    name: "UPI Offline Mesh",
    tagline: "Mesh-routed deferred settlement: encrypted payments that settle exactly once.",
    summary:
      "A Spring Boot backend and mesh simulator for offline payments. Packets hop between untrusted phones under hybrid RSA-OAEP + AES-GCM encryption; the server deduplicates by ciphertext hash, rejects tampered or replayed packets, and settles in a single transaction.",
    year: "2026",
    status: "Teaching demo · server side + simulator",
    stack: ["Java 17", "Spring Boot 3", "Spring Data JPA", "H2", "RSA-OAEP", "AES-256-GCM", "JUnit"],
    repo: "https://github.com/parasar0810/UpiWithoutInternet",
    facts: [
      { label: "Settlement guarantee", value: "Exactly once" },
      { label: "Concurrency test", value: "3 bridges, 1 packet" },
      { label: "Replay window", value: "24 h freshness" },
    ],
  },
  {
    slug: "own-ai",
    name: "OWN-AI",
    tagline: "A from-scratch vector search and RAG platform for comparing index strategies.",
    summary:
      "A Python platform that implements HNSW, KD-tree and brute-force indexes over 768-dimensional embeddings, exposes search and document Q&A over REST, and benchmarks how each strategy behaves.",
    year: "2026",
    status: "Personal project",
    stack: ["Python", "FastAPI", "NumPy", "Ollama", "HNSW", "KD-tree"],
    repoNote: "Source not yet published on GitHub.",
    facts: [
      { label: "Index types", value: "HNSW · KD-tree · brute force" },
      { label: "Distance metrics", value: "Cosine · Euclidean · Manhattan" },
      { label: "Embedding size", value: "768-D" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
