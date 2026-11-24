import { cx } from "./ui";

type Node = { name: string; detail: string; kind?: "ai" | "gate" | "human" | "infra" };

const stages: { step: string; title: string; nodes: Node[] }[] = [
  {
    step: "01",
    title: "Observe",
    nodes: [
      { name: "NovaCart", detail: "FastAPI + PostgreSQL store with a Chaos Lab", kind: "infra" },
      { name: "Prometheus", detail: "5 s scrape · 7 alert rules", kind: "infra" },
      { name: "Alertmanager", detail: "Webhook with a per-app ingest key", kind: "infra" },
    ],
  },
  {
    step: "02",
    title: "Investigate",
    nodes: [
      { name: "Google ADK", detail: "Sequential / parallel / loop workflow", kind: "ai" },
      { name: "MCP tools", detail: "Health, metrics, logs, PromQL", kind: "ai" },
      { name: "CrewAI over A2A", detail: "RCA analyst · critic · strategist", kind: "ai" },
      { name: "Gemini", detail: "Model router with failover & budgets", kind: "ai" },
    ],
  },
  {
    step: "03",
    title: "Decide",
    nodes: [
      { name: "AegisCausal", detail: "Deterministic consistency test", kind: "gate" },
      { name: "Policy engine", detail: "Registered hook · category · confidence ≥ 0.5", kind: "gate" },
    ],
  },
  {
    step: "04",
    title: "Act",
    nodes: [
      { name: "Human approval", detail: "Bound to the incident version", kind: "human" },
      { name: "Registered hook", detail: "Allowlisted HTTP POST, bearer token", kind: "gate" },
    ],
  },
  {
    step: "05",
    title: "Verify & record",
    nodes: [
      { name: "Recovery check", detail: "Re-measure after 45 s + independent verifier", kind: "gate" },
      { name: "AegisReplay", detail: "SHA-256 hash-chained event log", kind: "infra" },
    ],
  },
];

const kindStyle: Record<NonNullable<Node["kind"]>, string> = {
  infra: "border-line bg-surface",
  ai: "border-series-2/30 bg-[#f5f3ff]",
  gate: "border-accent/30 bg-accent-wash",
  human: "border-amber-300 bg-warn-wash",
};

export function ArchitectureDiagram() {
  return (
    <figure className="not-prose rounded-lg border border-line bg-subtle/60 p-4 sm:p-6">
      <ol className="grid gap-3 lg:grid-cols-5" aria-label="AegisOps pipeline, five stages">
        {stages.map((s, i) => (
          <li key={s.step} className="relative flex flex-col">
            <div className="mb-2.5 flex items-baseline gap-2">
              <span className="font-mono text-[0.68rem] text-muted">{s.step}</span>
              <span className="text-sm font-semibold text-ink">{s.title}</span>
            </div>
            <ul className="flex flex-1 flex-col gap-2">
              {s.nodes.map((n) => (
                <li key={n.name} className={cx("rounded-lg border px-3 py-2.5", kindStyle[n.kind ?? "infra"])}>
                  <p className="text-[0.82rem] font-medium text-ink">{n.name}</p>
                  <p className="mt-0.5 text-[0.74rem] leading-snug text-muted">{n.detail}</p>
                </li>
              ))}
            </ul>
            {i < stages.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-auto my-1 block h-4 w-px bg-line-strong lg:absolute lg:-right-2.5 lg:top-1/2 lg:my-0 lg:h-px lg:w-2"
              />
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-series-2/40 bg-[#f5f3ff]" aria-hidden="true" />LLM-driven</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-accent/40 bg-accent-wash" aria-hidden="true" />Deterministic gate</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-amber-300 bg-warn-wash" aria-hidden="true" />Human decision</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-line bg-surface" aria-hidden="true" />Infrastructure</span>
      </figcaption>
    </figure>
  );
}
