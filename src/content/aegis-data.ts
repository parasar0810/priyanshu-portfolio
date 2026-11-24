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
  { id: "A", name: "Checkout HTTP 500", detect: 60.0, investigate: 22.1, recover: 48.9, fix: "rollback_feature_flag", attribution: "attributed" },
  { id: "B", name: "DB pool exhaustion", detect: 24.4, investigate: 32.2, recover: 49.2, fix: "reset_db_pool", attribution: "attributed" },
  { id: "C", name: "Slow recommendations", detect: 51.5, investigate: 25.6, recover: 49.1, fix: "disable_recommendations", attribution: "attributed" },
  { id: "D", name: "CPU saturation", detect: 47.2, investigate: 23.3, recover: 49.9, fix: "stop_background_jobs", attribution: "attributed" },
  { id: "E", name: "Memory pressure", detect: 26.1, investigate: 15.8, recover: 48.9, fix: "release_memory", attribution: "attributed" },
  { id: "F", name: "API unavailable", detect: 41.2, investigate: 15.7, recover: 48.6, fix: "restart_service", attribution: "unknown" },
  { id: "G", name: "DB lock, misleading alert", detect: 45.6, investigate: 26.0, recover: 52.2, fix: "cancel_blocking_query", attribution: "attributed" },
  { id: "H", name: "CPU-starved API", detect: 44.4, investigate: 26.4, recover: 48.9, fix: "stop_background_jobs", attribution: "attributed" },
] as const;

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
