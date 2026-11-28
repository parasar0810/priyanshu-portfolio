/**
 * Projects. Every fact is traceable to the named repository.
 *  - AegisOps: github.com/parasar0810/Aegisops (README, AEGISBENCH_RESULTS.md, AEGISOPS_FINAL_TEST_REPORT.md, source)
 *  - Live Meeting Copilot: github.com/parasar0810/Live-meeting-transcript (README, DESIGN.md, tests/)
 *  - OWN-AI: github.com/parasar0810/OWN-AI (ownai/, tests/, docs/ENGINEERING_NOTES.md, benchmarks/results.json)
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
  demoNote?: string;
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
    demoNote: "The demo runs on a single EC2 instance and may be stopped to control cost.",
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
    kind: "Vector search · RAG · Algorithms",
    tagline: "A vector database from first principles: brute force, KD-tree and HNSW, measured side by side.",
    problem:
      "Vector databases are usually used as black boxes. Building the index structures directly makes their trade-offs visible and measurable.",
    summary:
      "Brute-force, KD-tree and HNSW k-NN written from scratch in Python and NumPy under cosine, euclidean and manhattan distance, with a reproducible recall/latency benchmark, a FastAPI service, a React index explorer and a citation-checked RAG pipeline on local Ollama models.",
    year: "2026",
    status: "Personal project · Python, 2026",
    stack: ["Python", "NumPy", "FastAPI", "Pydantic", "HNSW", "KD-tree", "Ollama", "React", "pytest"],
    repo: "https://github.com/parasar0810/OWN-AI",
    demo: [{ label: "Live demo", href: "https://own-ai-jka3.onrender.com", note: "Search playground, index explorer, benchmarks" }],
    demoNote: "Free hosting: the first visit after idle takes up to a minute to wake. The RAG assistant needs a local Ollama and is disabled online.",
    thumb: "ownai",
    cover: { src: "/images/ownai/explorer.png", alt: "OWN-AI index explorer showing real HNSW links and KD-tree splits.", width: 1440, height: 1169 },
    facts: [
      { label: "HNSW recall@10 after heuristic fix", value: "0.93 → 1.00" },
      { label: "Index types", value: "HNSW · KD-tree · brute force" },
      { label: "Automated tests", value: "68 passing" },
    ],
    features: [
      "Found and fixed HNSW graph fragmentation (73/600 → 600/600 reachable)",
      "Exact KD-tree for every metric, including cosine",
      "Seeded benchmark: latency and recall@10 against brute force",
      "RAG answers must cite passages or refuse",
    ],
  },
  {
    slug: "upi-offline-mesh",
    name: "UPI Offline Mesh",
    kind: "Distributed systems · Cryptography · PostgreSQL",
    tagline: "An offline payment network simulation: signed, encrypted payments that settle exactly once.",
    problem:
      "When a payment travels through a gossip mesh, the server receives the same packet several times — sometimes simultaneously — through intermediaries it can’t trust.",
    summary:
      "A Node.js, Express and PostgreSQL simulation. Phones gossip encrypted, Ed25519-signed payments; bridges upload concurrently; the backend claims each packet hash and settles inside one transaction, so duplicates, tampering, forgery and replays are rejected.",
    year: "2026",
    status: "Simulation · Java original reimplemented in Node.js (Nov 2026)",
    stack: ["Node.js", "Express", "PostgreSQL", "node:crypto", "AES-256-GCM", "RSA-OAEP", "Ed25519", "React"],
    repo: "https://github.com/parasar0810/UpiWithoutInternet",
    demo: [{ label: "Live simulation", href: "https://upi-offline-mesh-0r6x.onrender.com", note: "Node.js + PostgreSQL (Neon)" }],
    demoNote: "Free hosting: the first visit after idle takes up to a minute to wake. Each visitor gets a private sandbox, cleared after 30 minutes idle or on restart; no real money is involved.",
    thumb: "upi",
    cover: { src: "/images/upi/console.png", alt: "UPI Offline Mesh simulation console with mesh map, payment form and balances.", width: 1440, height: 1250 },
    facts: [
      { label: "Concurrent duplicate deliveries", value: "20 → 1 settlement" },
      { label: "Tests (real PostgreSQL)", value: "38 passing" },
      { label: "Sender authentication", value: "Ed25519" },
    ],
    features: [
      "Claim + settle in one PostgreSQL transaction",
      "Ed25519 signatures authenticate the sender",
      "Deadlock-free locking for opposite transfers",
      "Interactive mesh map and failure lab",
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
