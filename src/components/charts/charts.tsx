import { byDifficulty, costOfAgents, mainRun } from "@/content/aegis-data";
import { cx } from "../ui";

/* Shared chart chrome: title, note, and an always-available data table. */
function ChartFrame({
  title,
  note,
  legend,
  table,
  children,
}: {
  title: string;
  note?: React.ReactNode;
  legend?: React.ReactNode;
  table: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose rounded-lg border border-line bg-surface p-5 shadow-soft sm:p-6">
      <figcaption>
        <p className="text-[0.95rem] font-semibold text-ink">{title}</p>
        {note && <p className="mt-1 text-sm leading-relaxed text-muted">{note}</p>}
      </figcaption>
      {legend && <div className="mt-4">{legend}</div>}
      <div className="mt-5">{children}</div>
      <details className="group mt-5 border-t border-line pt-3">
        <summary className="cursor-pointer select-none font-mono text-xs text-muted hover:text-ink">
          View data table
        </summary>
        <div className="mt-3 overflow-x-auto">{table}</div>
      </details>
    </figure>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full min-w-[420px] text-left text-sm">
      <thead>
        <tr className="border-b border-line text-muted">
          {head.map((h) => (
            <th key={h} scope="col" className="py-1.5 pr-4 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="tabular-nums text-ink-2">
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-line/60 last:border-0">
            {r.map((c, j) =>
              j === 0 ? (
                <th key={j} scope="row" className="py-1.5 pr-4 font-normal text-ink">
                  {c}
                </th>
              ) : (
                <td key={j} className="py-1.5 pr-4">
                  {c}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const pct = (v: number) => `${Math.round(v * 100)}%`;

/**
 * Top-1 accuracy with 95% Wilson intervals. A dot-and-whisker form shows that
 * the intervals overlap almost entirely — which is the point.
 */
export function AccuracyIntervalChart() {
  const min = 0.6;
  const toX = (v: number) => ((v - min) / (1 - min)) * 100;
  const ticks = [0.6, 0.7, 0.8, 0.9, 1.0];
  return (
    <ChartFrame
      title="Diagnosis accuracy (top-1) with 95% confidence intervals"
      note="Main benchmark run · 15 scenarios × 2 repeats · n = 30 per approach · identical evidence for every approach. The axis starts at 60%."
      table={
        <DataTable
          head={["Approach", "Top-1", "95% Wilson CI"]}
          rows={mainRun.map((r) => [r.approach, pct(r.top1), `${pct(r.lo)}–${pct(r.hi)}`])}
        />
      }
    >
      <div className="space-y-4" role="img" aria-label="AegisOps multi-agent, single LLM call and the causal-rule ablation all scored 93% with the same interval of 79% to 98%; deterministic rules scored 87% with an interval of 70% to 95%.">
        {mainRun.map((r) => {
          const hl = "highlight" in r && r.highlight;
          return (
            <div key={r.approach} className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 sm:grid-cols-[11rem_1fr_3.5rem]">
              <span className={cx("text-sm", hl ? "font-semibold text-ink" : "text-ink-2")}>{r.approach}</span>
              <div className="relative h-6" title={`${r.approach}: ${pct(r.top1)} (CI ${pct(r.lo)}–${pct(r.hi)})`}>
                {ticks.map((t) => (
                  <span key={t} aria-hidden="true" className="absolute top-0 h-full w-px bg-line" style={{ left: `${toX(t)}%` }} />
                ))}
                <span
                  aria-hidden="true"
                  className={cx("absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full", hl ? "bg-accent/60" : "bg-line-strong")}
                  style={{ left: `${toX(r.lo)}%`, width: `${toX(r.hi) - toX(r.lo)}%` }}
                />
                {[r.lo, r.hi].map((v) => (
                  <span
                    key={v}
                    aria-hidden="true"
                    className={cx("absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full", hl ? "bg-accent/70" : "bg-line-strong")}
                    style={{ left: `calc(${toX(v)}% - 1px)` }}
                  />
                ))}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface",
                    hl ? "bg-accent" : "bg-ink-2",
                  )}
                  style={{ left: `${toX(r.top1)}%` }}
                />
              </div>
              <span className="text-right font-mono text-sm tabular-nums text-ink">{pct(r.top1)}</span>
            </div>
          );
        })}
        <div className="grid grid-cols-[8.5rem_1fr_3rem] gap-3 sm:grid-cols-[11rem_1fr_3.5rem]" aria-hidden="true">
          <span />
          <div className="relative h-4">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 font-mono text-[0.68rem] text-muted" style={{ left: `${toX(t)}%` }}>
                {pct(t)}
              </span>
            ))}
          </div>
          <span />
        </div>
      </div>
    </ChartFrame>
  );
}

/** What the extra agents cost: small multiples, one measure each (no dual axis). */
export function CostOfAgentsChart() {
  return (
    <ChartFrame
      title="What the extra agents cost"
      note="Same run, the two LLM approaches. Costs are estimated from token counts and list prices, not a provider bill."
      table={
        <DataTable
          head={["Measure", "Single LLM call", "AegisOps multi-agent", "Ratio"]}
          rows={costOfAgents.map((c) => [c.metric, c.format(c.single), c.format(c.multi), `${(c.multi / c.single).toFixed(1)}×`])}
        />
      }
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {costOfAgents.map((c) => (
          <div key={c.metric}>
            <p className="mb-3 text-sm font-medium text-ink">{c.metric}</p>
            {[
              { label: "Single LLM", v: c.single, hl: false },
              { label: "Multi-agent", v: c.multi, hl: true },
            ].map((b) => (
              <div key={b.label} className="mb-2.5">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted">{b.label}</span>
                  <span className="font-mono tabular-nums text-ink">{c.format(b.v)}</span>
                </div>
                <div className="h-2 rounded-full bg-subtle" aria-hidden="true">
                  <div
                    className={cx("h-2 rounded-full", b.hl ? "bg-accent" : "bg-ink-2/70")}
                    style={{ width: `${Math.max((b.v / c.multi) * 100, 2)}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="mt-2 font-mono text-xs text-muted">{(c.multi / c.single).toFixed(1)}× more</p>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}

/** Accuracy by difficulty as a compact heat-free table: the hard column is the only one that separates approaches. */
export function DifficultyTable() {
  return (
    <ChartFrame
      title="Accuracy by scenario difficulty"
      note="Easy and medium scenarios hit a ceiling; only the 8 hard rows separate the approaches."
      table={
        <DataTable
          head={["Approach", "Easy (n=12)", "Medium (n=10)", "Hard (n=8)"]}
          rows={byDifficulty.map((r) => [r.approach, pct(r.easy), pct(r.medium), pct(r.hard)])}
        />
      }
    >
      <div className="space-y-3">
        {byDifficulty.map((r) => (
          <div key={r.approach} className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 sm:grid-cols-[11rem_1fr_3.5rem]">
            <span className="text-sm text-ink-2">{r.approach}</span>
            <div className="h-2 rounded-full bg-subtle" aria-hidden="true">
              <div className="h-2 rounded-full bg-series-2" style={{ width: `${r.hard * 100}%` }} />
            </div>
            <span className="text-right font-mono text-sm tabular-nums text-ink">{pct(r.hard)}</span>
          </div>
        ))}
        <p className="pt-1 text-xs text-muted">Bars show hard-scenario accuracy. Every approach scored 90–100% on easy and medium.</p>
      </div>
    </ChartFrame>
  );
}

/**
 * Before/after pairs from AegisBench. Each pair states its sample and caveat,
 * because none of these differences is statistically significant.
 */
export function BeforeAfter({
  items,
}: {
  items: { metric: string; before: number; after: number; unit?: "%"; lowerIsBetter?: boolean; note: string }[];
}) {
  const fmt = (v: number, u?: string) => (u === "%" ? `${Math.round(v * 100)}%` : String(v));
  return (
    <ul className="not-prose grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
      {items.map((it) => {
        const max = Math.max(it.before, it.after) || 1;
        return (
          <li key={it.metric} className="bg-surface p-5">
            <p className="text-sm font-semibold text-ink">{it.metric}</p>
            <div className="mt-3 space-y-2" aria-hidden="true">
              {[
                { l: "Before", v: it.before, c: "bg-line-strong" },
                { l: "After", v: it.after, c: "bg-accent" },
              ].map((b) => (
                <div key={b.l} className="grid grid-cols-[3.25rem_1fr_3rem] items-center gap-2 text-xs">
                  <span className="text-muted">{b.l}</span>
                  <span className="h-2 rounded-full bg-subtle">
                    <span className={`block h-2 rounded-full ${b.c}`} style={{ width: `${Math.max((b.v / max) * 100, 2)}%` }} />
                  </span>
                  <span className="text-right font-mono tabular-nums text-ink">{fmt(b.v, it.unit)}</span>
                </div>
              ))}
            </div>
            <p className="sr-only">{`${it.metric}: before ${fmt(it.before, it.unit)}, after ${fmt(it.after, it.unit)}.`}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted">{it.note}</p>
          </li>
        );
      })}
    </ul>
  );
}
