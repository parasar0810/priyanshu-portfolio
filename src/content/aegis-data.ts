/**
 * Numbers used in the AegisOps charts. Every value is copied from the AegisOps
 * repository; the source file is named next to each dataset.
 */

/** AEGISBENCH_RESULTS.md §3 — run bench-20261121-153620-b3ea, 15 scenarios × 2 repeats (n = 30). */
export const mainRun = [
  { approach: "Deterministic rules", top1: 0.87, lo: 0.7, hi: 0.95, llm: false },
  { approach: "Causal-rule ablation", top1: 0.93, lo: 0.79, hi: 0.98, llm: false },
  { approach: "Single LLM call", top1: 0.93, lo: 0.79, hi: 0.98, llm: true },
  { approach: "AegisOps multi-agent", top1: 0.93, lo: 0.79, hi: 0.98, llm: true, highlight: true },
] as const;

/** Same run — cost of the two LLM approaches. Costs are estimates from token counts. */
export const costOfAgents = [
  { metric: "LLM calls per run", single: 1.77, multi: 10.63, format: (v: number) => v.toFixed(2) },
  { metric: "Median latency", single: 5.7, multi: 44.7, format: (v: number) => `${v.toFixed(1)} s` },
  { metric: "Est. cost per run", single: 0.0007, multi: 0.0053, format: (v: number) => `$${v.toFixed(4)}` },
] as const;

/** Same run — accuracy by difficulty. */
export const byDifficulty = [
  { approach: "Deterministic rules", easy: 1.0, medium: 1.0, hard: 0.5 },
  { approach: "Causal-rule ablation", easy: 1.0, medium: 1.0, hard: 0.75 },
  { approach: "Single LLM call", easy: 1.0, medium: 0.9, hard: 0.88 },
  { approach: "AegisOps multi-agent", easy: 1.0, medium: 1.0, hard: 0.75 },
] as const;

/** AEGISOPS_FINAL_TEST_REPORT.md §3 — one live run per scenario on AWS. Seconds. */
export const liveScenarios = [
  { id: "A", name: "Checkout HTTP 500", alert: "5xx rate", impact: "POST /api/checkout → 500", diagnosis: "bad_deployment · novacart-api", conf: 0.95, detect: 60.0, investigate: 22.1, recover: 48.9, fix: "rollback_feature_flag", after: "checkout → 201", attribution: "attributed" },
  { id: "B", name: "DB pool exhaustion", alert: "Pool exhausted", impact: "GET /api/products → 503 in 2.0 s", diagnosis: "database_failure · novacart-db", conf: 0.9, detect: 24.4, investigate: 32.2, recover: 49.2, fix: "reset_db_pool", after: "→ 200 in 0.01 s", attribution: "attributed" },
  { id: "C", name: "Slow recommendations", alert: "p95 latency", impact: "product page 2.62 s", diagnosis: "high_latency · novacart-recs", conf: 0.98, detect: 51.5, investigate: 25.6, recover: 49.1, fix: "disable_recommendations", after: "→ 0.02 s", attribution: "attributed" },
  { id: "D", name: "CPU saturation", alert: "CPU", impact: "product page 1.0 s", diagnosis: "cpu_saturation · novacart-api", conf: 0.85, detect: 47.2, investigate: 23.3, recover: 49.9, fix: "stop_background_jobs", after: "→ 0.02 s", attribution: "attributed" },
  { id: "E", name: "Memory pressure", alert: "Memory", impact: "memory at 90% of limit", diagnosis: "memory_exhaustion · novacart-api", conf: 0.85, detect: 26.1, investigate: 15.8, recover: 48.9, fix: "release_memory", after: "memory 16%", attribution: "attributed" },
  { id: "F", name: "API unavailable", alert: "API down", impact: "connection refused", diagnosis: "service_unavailable · novacart-api", conf: 0.85, detect: 41.2, investigate: 15.7, recover: 48.6, fix: "restart_service", after: "→ 200", attribution: "unknown" },
  { id: "G", name: "DB lock, misleading alert", alert: "5xx rate on novacart-api", impact: "product page 503 in 3.5 s", diagnosis: "database_failure · novacart-db", conf: 0.95, detect: 45.6, investigate: 26.0, recover: 52.2, fix: "cancel_blocking_query", after: "→ 0.02 s", attribution: "attributed" },
  { id: "H", name: "CPU-starved API", alert: "CPU", impact: "product page 1.75 s", diagnosis: "cpu_saturation · novacart-api", conf: 0.8, detect: 44.4, investigate: 26.4, recover: 48.9, fix: "stop_background_jobs", after: "→ 0.02 s", attribution: "attributed" },
] as const;

export type LiveScenario = (typeof liveScenarios)[number];

/** AEGISBENCH_RESULTS.md §9 — runs 9d87 (fixed) vs f067 (interactive), 7 hard scenarios × 2, paired. */
export const acquisition = {
  fixed: { top1: 0.93, initiating: 0.8, remediation: 0.86 },
  interactive: { top1: 1.0, initiating: 1.0, remediation: 1.0 },
  diagnosisP: 1.0,
  requestsExecuted: 14,
  requestsUseful: 6,
  llmChosen: 2,
  afterStopRule: { executed: 7, usefulRate: 0.86 },
} as const;
