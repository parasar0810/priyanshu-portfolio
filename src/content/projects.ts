/**
 * Projects. Every fact is traceable to the named repository.
 *  - AegisOps: github.com/parasar0810/Aegisops (README, AEGISBENCH_RESULTS.md, AEGISOPS_FINAL_TEST_REPORT.md, source)
 *  - Live Meeting Copilot: github.com/parasar0810/Live-meeting-transcript (README, DESIGN.md, tests/)
 *  - OWN-AI: github.com/parasar0810/OWN-AI (main.cpp, README)
 *  - UPI Offline Mesh: github.com/parasar0810/UpiWithoutInternet (README, source, tests)
 *  - FlowGuard / Meterly / AegisPay: their repositories' READMEs and source trees
 */
export type Thumb = "aegisops" | "meeting" | "ownai" | "upi";

export type Project = {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  problem: string;
  summary: string;
  year: string;
  status: string;
  stack: string[];
  repo?: string;
  demo?: { label: string; href: string; note?: string }[];
  thumb: Thumb;
  cover?: { src: string; alt: string; width: number; height: number };
  facts: { label: string; value: string }[];
  features: string[];
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    slug: "aegisops",
    name: "AegisOps",
    kind: "Agentic AI · Incident response · Observability",
    tagline: "Multi-agent incident investigation with human-approved, independently verified remediation.",
    problem:
      "An alert names a symptom, not a cause. On-call engineers stitch together dashboards, logs and guesses, try a restart, and assume it worked — and the reasoning is rarely recorded.",
    summary:
      "A FastAPI platform that turns a Prometheus alert into an evidence-backed diagnosis, a fix a human must approve, and a recovery that is re-measured before it is believed — every step written to a hash-chained, replayable log.",
    year: "2026",
    status: "Research & portfolio project · deployed on AWS EC2",
    stack: ["Python", "FastAPI", "Pydantic", "Google ADK", "CrewAI", "MCP", "A2A", "Gemini", "Prometheus", "Alertmanager", "Docker", "AWS"],
    repo: "https://github.com/parasar0810/Aegisops",
    demo: [
      { label: "NovaCart demo store", href: "https://novacart.13-205-64-4.sslip.io", note: "The monitored application" },
      { label: "AegisOps console", href: "https://13-205-64-4.sslip.io", note: "Sign-in required" },
    ],
    thumb: "aegisops",
    cover: {
      src: "/images/aegisops/01_dashboard.png",
      alt: "AegisOps dashboard: active incidents, pending approvals, resolved and verified incidents with MTTR, AI usage and service health for the monitored application.",
      width: 1365,
      height: 768,
    },
    facts: [
      { label: "Live AWS fault scenarios", value: "8 / 8 passed" },
      { label: "Automated tests", value: "117 + 12" },
      { label: "Production AI roles", value: "9" },
      { label: "Multi-agent vs single LLM", value: "No significant accuracy gain" },
    ],
    features: [
      "AegisCausal finds the initiating component, not the loudest alert",
      "Only pre-registered HTTP hooks can run — after policy and human approval",
      "Recovery re-measured and attributed before an incident closes",
      "AegisBench: honest single- vs multi-agent comparison on identical evidence",
    ],
    flagship: true,
  },
  {
    slug: "live-meeting-copilot",
    name: "Live Meeting Copilot",
    kind: "Real-time backend · Concurrent agents · RAG",
    tagline: "Four concurrent AI agents over a streaming transcript, fanned out to every viewer in real time.",
    problem:
      "Useful meeting help — fact-checks, action items, context — is only valuable while the conversation is still happening, which turns an LLM feature into a real-time concurrency problem.",
    summary:
      "A FastAPI WebSocket backend: transcript chunks stream in, a regex supervisor decides which of four LangGraph agents to run, the agents execute concurrently, and results broadcast to all connected clients through bounded per-client queues.",
    year: "2026",
    status: "Personal project · single-process design, documented",
    stack: ["Python", "FastAPI", "WebSockets", "asyncio", "LangGraph", "ChromaDB", "OpenAI API", "pytest"],
    repo: "https://github.com/parasar0810/Live-meeting-transcript",
    thumb: "meeting",
    facts: [
      { label: "Concurrent agents", value: "4" },
      { label: "Routing LLM calls", value: "0 (regex supervisor)" },
      { label: "Test suites", value: "Concurrency · failure · load · security" },
    ],
    features: [
      "Regex supervisor: no LLM call in the routing path",
      "Drop-oldest backpressure so ingestion never blocks",
      "Per-client queues: a slow browser can’t stall the others",
      "Late joiners receive full history before live updates",
    ],
  },
  {
    slug: "own-ai",
    name: "OWN-AI",
    kind: "Vector search · RAG · Systems programming",
    tagline: "A vector database written from scratch, with HNSW, KD-tree and brute-force search side by side.",
    problem:
      "Vector databases are usually used as black boxes. Building the index structures directly makes their trade-offs visible and measurable.",
    summary:
      "A C++ server implementing HNSW, a KD-tree and brute-force k-NN under cosine, Euclidean and Manhattan distance, plus a RAG pipeline that chunks documents, embeds them locally with Ollama and answers questions over the retrieved chunks.",
    year: "2026",
    status: "Personal project",
    stack: ["C++17", "cpp-httplib", "HNSW", "KD-tree", "Ollama", "nomic-embed-text", "llama3.2"],
    repo: "https://github.com/parasar0810/OWN-AI",
    thumb: "ownai",
    facts: [
      { label: "Index types", value: "HNSW · KD-tree · brute force" },
      { label: "Distance metrics", value: "Cosine · Euclidean · Manhattan" },
      { label: "Document embeddings", value: "768-D (nomic-embed-text)" },
    ],
    features: [
      "Three k-NN algorithms behind one interface, timed per query",
      "HNSW with M = 16, ef_construction = 200",
      "250-word chunks with 30-word overlap for RAG",
      "REST API for insert, delete, search, benchmark and graph stats",
    ],
  },
  {
    slug: "upi-offline-mesh",
    name: "UPI Offline Mesh",
    kind: "Distributed systems · Cryptography · Idempotency",
    tagline: "Encrypted payments that hop between untrusted phones and settle exactly once.",
    problem:
      "When a payment travels through a gossip mesh, the server will receive the same packet several times — sometimes simultaneously — and through intermediaries it can’t trust.",
    summary:
      "A Spring Boot backend and mesh simulator. Packets travel under hybrid RSA-OAEP + AES-GCM encryption; the server deduplicates on the ciphertext hash before decrypting, rejects tampered or replayed packets, and settles in one transaction.",
    year: "2026",
    status: "Teaching demo · server side + simulator",
    stack: ["Java 17", "Spring Boot 3", "Spring Data JPA", "H2", "RSA-OAEP", "AES-256-GCM", "JUnit"],
    repo: "https://github.com/parasar0810/UpiWithoutInternet",
    thumb: "upi",
    facts: [
      { label: "Settlement guarantee", value: "Exactly once" },
      { label: "Concurrency test", value: "3 bridges, 1 packet" },
      { label: "Replay window", value: "24 h freshness" },
    ],
    features: [
      "Atomic claim on SHA-256(ciphertext) before any decryption",
      "GCM tag rejects any flipped bit",
      "Signed timestamp + nonce defeat replays",
      "Unique index on packet hash as defence in depth",
    ],
  },
];

/** Smaller systems shown as a compact index rather than full case studies. */
export const moreSystems = [
  {
    name: "FlowGuard",
    what: "Distributed API rate-limiting middleware",
    detail: "Token-bucket and sliding-window limits as atomic Redis Lua scripts, tiered API keys, IP abuse blocking and asynchronous request logging to PostgreSQL. Unit tests cover the filter, services and an in-memory limiter.",
    stack: ["Java 17", "Spring Boot", "Redis", "Lua", "PostgreSQL"],
    repo: "https://github.com/parasar0810/Flowguard",
  },
  {
    name: "Meterly",
    what: "Multi-tenant SaaS billing platform",
    detail: "Subscriptions, metered usage, invoicing, refunds and credits with a double-entry ledger, idempotency and Hangfire dunning jobs, organised as CQRS with MediatR. xUnit unit and integration tests.",
    stack: ["C# / .NET 8", "ASP.NET Core", "EF Core", "PostgreSQL", "Blazor"],
    repo: "https://github.com/parasar0810/meterly",
  },
  {
    name: "AegisPay",
    what: "Idempotent payment processing",
    detail: "Idempotency-Key deduplication, database unique constraints against double charges, retries for transient bank failures and a scheduled reconciliation job for stuck payments.",
    stack: ["Java 17", "Spring Boot", "MySQL"],
    repo: "https://github.com/parasar0810/-AegisPay-",
  },
] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
