"use client";

import { useState } from "react";
import { liveScenarios } from "@/content/aegis-data";

const SERIES = [
  { key: "detect", label: "Detection", cls: "bg-series-2" },
  { key: "investigate", label: "Investigation", cls: "bg-series-1" },
  { key: "recover", label: "Recovery (incl. 45 s settle)", cls: "bg-series-3" },
] as const;

const MAX = 140;

/**
 * Live AWS runs: each row is a stacked fault → verified-recovery timeline.
 * Hover, focus or click a row to see what the agents concluded and what ran.
 */
export function ScenarioExplorer() {
  const [active, setActive] = useState(6); // Scenario G — the misleading alert
  const s = liveScenarios[active];
  const total = s.detect + s.investigate + s.recover;

  return (
    <figure className="not-prose rounded-lg border border-line bg-surface">
      <figcaption className="border-b border-line px-5 py-4">
        <p className="text-[0.95rem] font-semibold text-ink">Eight live fault scenarios on AWS — fault to verified recovery</p>
        <p className="mt-1 text-sm text-muted">
          One run per scenario with live Gemini calls: a demonstration, not a statistic. Human approval time is excluded. Select a scenario for details.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5" aria-label="Legend">
          {SERIES.map((x) => (
            <li key={x.key} className="flex items-center gap-2 text-xs text-ink-2">
              <span className={`h-2.5 w-2.5 rounded-sm ${x.cls}`} aria-hidden="true" />
              {x.label}
            </li>
          ))}
        </ul>
      </figcaption>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <ol className="space-y-1 p-3 sm:p-4" aria-label="Scenarios">
          {liveScenarios.map((r, i) => {
            const t = r.detect + r.investigate + r.recover;
            const on = i === active;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`grid w-full grid-cols-[1.25rem_minmax(0,1fr)_2.75rem] items-center gap-3 rounded-md px-2 py-2 text-left transition-colors sm:grid-cols-[11.5rem_minmax(0,1fr)_3rem] ${on ? "bg-subtle" : "hover:bg-subtle/60"}`}
                >
                  <span className="truncate text-sm text-ink-2">
                    <span className={`font-mono text-xs ${on ? "text-accent-ink" : "text-muted"}`}>{r.id}</span>
                    <span className="ml-2 hidden sm:inline">{r.name}</span>
                  </span>
                  <span className="flex h-4 gap-[2px]" aria-hidden="true">
                    {SERIES.map((x, k) => (
                      <span
                        key={x.key}
                        className={`h-full ${x.cls} ${k === 0 ? "rounded-l-[3px]" : ""} ${k === 2 ? "rounded-r-[3px]" : ""} ${on ? "" : "opacity-80"}`}
                        style={{ width: `${(r[x.key] / MAX) * 100}%` }}
                      />
                    ))}
                  </span>
                  <span className="text-right font-mono text-xs tabular-nums text-muted">{Math.round(t)} s</span>
                  <span className="sr-only">
                    {`Scenario ${r.id}, ${r.name}: detection ${r.detect} s, investigation ${r.investigate} s, recovery ${r.recover} s.`}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="border-t border-line p-5 lg:border-l lg:border-t-0" aria-live="polite">
          <p className="font-mono text-xs text-accent-ink">Scenario {s.id}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-ink">{s.name}</p>
          <dl className="mt-4 grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-muted">Impact</dt><dd className="text-ink">{s.impact}</dd>
            <dt className="text-muted">Alert</dt><dd className="text-ink">{s.alert}</dd>
            <dt className="text-muted">Diagnosis</dt><dd className="font-mono text-[0.82rem] text-ink">{s.diagnosis} <span className="text-muted">({s.conf.toFixed(2)})</span></dd>
            <dt className="text-muted">Approved fix</dt><dd className="font-mono text-[0.82rem] text-ink">{s.fix}</dd>
            <dt className="text-muted">After</dt><dd className="text-ink">{s.after}</dd>
            <dt className="text-muted">Attribution</dt>
            <dd className={s.attribution === "attributed" ? "text-accent-ink" : "text-warn-ink"}>{s.attribution}</dd>
          </dl>
          <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line text-center">
            {[["Detect", s.detect], ["Investigate", s.investigate], ["Recover", s.recover]].map(([l, v]) => (
              <div key={l as string} className="bg-surface px-2 py-2.5">
                <p className="font-mono text-sm font-semibold tabular-nums text-ink">{(v as number).toFixed(1)} s</p>
                <p className="text-[0.7rem] text-muted">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Total {total.toFixed(1)} s from fault injection to verified recovery, excluding approval.</p>
          {s.id === "G" && (
            <p className="mt-3 text-xs leading-relaxed text-ink-2">The alert named the API; AegisCausal traced the cause to a database lock upstream.</p>
          )}
          {s.id === "F" && (
            <p className="mt-3 text-xs leading-relaxed text-ink-2">Recovered, but the restart hook didn’t yet report a state change, so attribution stayed unknown. It reports it now.</p>
          )}
        </div>
      </div>
    </figure>
  );
}
