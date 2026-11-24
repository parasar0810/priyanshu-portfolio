/**
 * Hand-built SVG architecture diagrams. They describe real components from each
 * repository; they are labelled as diagrams and never presented as screenshots.
 */

type Kind = "infra" | "ai" | "gate" | "human" | "ext";

const BOX: Record<Kind, string> = {
  infra: "fill-surface stroke-line-strong",
  ai: "fill-[#f5f3ff] stroke-[#c4b5fd]",
  gate: "fill-accent-wash stroke-[#5eead4]",
  human: "fill-warn-wash stroke-[#fcd34d]",
  ext: "fill-subtle stroke-line-strong",
};

function Box({
  x, y, w, h, title, sub, kind = "infra", dashed,
}: { x: number; y: number; w: number; h: number; title: string; sub?: string; kind?: Kind; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className={BOX[kind]} strokeWidth={1.2} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + 12} y={y + (sub ? 21 : h / 2 + 5)} className="fill-ink" fontSize={13} fontWeight={600}>
        {title}
      </text>
      {sub && (
        <text x={x + 12} y={y + 38} className="fill-muted" fontSize={11}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ d, label, lx, ly, dashed, anchor = "start" }: { d: string; label?: string; lx?: number; ly?: number; dashed?: boolean; anchor?: "start" | "middle" | "end" }) {
  return (
    <g>
      <path d={d} fill="none" className="stroke-ink-2" strokeWidth={1.2} strokeDasharray={dashed ? "5 4" : undefined} markerEnd="url(#arrow)" />
      {label && (
        <text x={lx} y={ly} className="fill-muted font-mono" fontSize={10} textAnchor={anchor}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Shared arrowhead, rendered once in the root layout so diagrams don't repeat the id. */
export function DiagramDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#334155" />
        </marker>
      </defs>
    </svg>
  );
}

/** Full AegisOps system: monitored app, detection, investigation, decision, action, verification. */
export function AegisArchitecture() {
  return (
    <figure className="not-prose">
      <div className="overflow-x-auto rounded-lg border border-line bg-surface p-3 sm:p-5" data-scroll-x tabIndex={0} aria-label="AegisOps architecture diagram (scrollable)">
        <svg viewBox="0 0 1120 560" className="min-w-[880px]" role="img" aria-labelledby="aegis-arch-title aegis-arch-desc">
          <title id="aegis-arch-title">AegisOps architecture</title>
          <desc id="aegis-arch-desc">
            NovaCart exposes metrics that Prometheus scrapes; Alertmanager sends an authenticated webhook to the AegisOps FastAPI
            service. Inside AegisOps, a Google ADK workflow calls MCP diagnostic tools against NovaCart and Prometheus, calls CrewAI
            specialists over A2A, and reaches Gemini through the ModelRouter. AegisCausal ranks explanations, the policy engine checks
            the proposal, a human approves, the registered remediation hook is called on NovaCart, and recovery verification
            re-measures before AegisReplay records the chain.
          </desc>

          {/* Monitored application */}
          <rect x={16} y={40} width={208} height={300} rx={8} className="fill-subtle stroke-line" strokeWidth={1} />
          <text x={30} y={64} className="fill-muted font-mono" fontSize={10} letterSpacing={1}>MONITORED APP</text>
          <Box x={30} y={76} w={180} h={50} title="NovaCart" sub="SPA + FastAPI API" />
          <Box x={30} y={136} w={180} h={50} title="PostgreSQL 16" sub="private network" />
          <Box x={30} y={196} w={180} h={50} title="Recommendations" sub="dependency service" />
          <Box x={30} y={268} w={180} h={50} title="Chaos Lab" sub="8 reversible faults" kind="ext" dashed />

          {/* Detection */}
          <Box x={262} y={76} w={160} h={50} title="Prometheus" sub="5 s scrape · 7 rules" />
          <Box x={262} y={196} w={160} h={50} title="Alertmanager" sub="per-app ingest key" />

          {/* AegisOps container */}
          <rect x={456} y={20} width={648} height={524} rx={10} className="fill-canvas stroke-ink-2" strokeWidth={1.2} />
          <text x={474} y={44} className="fill-ink font-mono" fontSize={11} fontWeight={600} letterSpacing={1}>AEGISOPS · FASTAPI</text>

          <Box x={474} y={60} w={176} h={50} title="Incident intake" sub="correlate duplicate alerts" />
          <Box x={690} y={60} w={176} h={50} title="Google ADK workflow" sub="sequential · parallel · loop" kind="ai" />
          <Box x={906} y={60} w={180} h={50} title="ModelRouter" sub="budgets · failover · schema" kind="gate" />

          <Box x={474} y={150} w={176} h={50} title="MCP tools" sub="health · logs · PromQL" kind="ai" />
          <Box x={690} y={150} w={176} h={50} title="CrewAI specialists" sub="RCA · critic · strategist" kind="ai" />
          <Box x={906} y={150} w={180} h={50} title="Gemini API" sub="external LLM provider" kind="ext" dashed />

          <Box x={474} y={250} w={176} h={50} title="AegisCausal" sub="deterministic consistency" kind="gate" />
          <Box x={690} y={250} w={176} h={50} title="Policy engine" sub="registered · category · ≥0.5" kind="gate" />
          <Box x={906} y={250} w={180} h={50} title="Human approval" sub="bound to incident version" kind="human" />

          <Box x={474} y={350} w={176} h={50} title="AegisReplay" sub="SHA-256 hash chain" />
          <Box x={690} y={350} w={176} h={50} title="Recovery verification" sub="re-measure + attribution" kind="gate" />
          <Box x={906} y={350} w={180} h={50} title="Remediation hook" sub="allowlisted HTTP POST" kind="gate" />

          {/* Edges */}
          <Arrow d="M210 101 H258" label="scrape" lx={234} ly={94} anchor="middle" />
          <Arrow d="M342 126 V192" />
          <Arrow d="M422 221 H440 V85 H470" label="webhook" lx={446} ly={132} />
          <Arrow d="M650 85 H686" />
          <Arrow d="M866 85 H902" />
          <Arrow d="M996 110 V146" />
          <Arrow d="M740 110 V128 H562 V146" />
          <Arrow d="M790 110 V146" label="A2A" lx={796} ly={134} />
          <Arrow d="M474 175 H232 V160 H214" label="MCP evidence (HTTP)" lx={392} ly={190} anchor="middle" dashed />
          <Arrow d="M778 200 V224 H562 V246" label="ranked hypotheses" lx={584} ly={220} />
          <Arrow d="M650 275 H686" />
          <Arrow d="M866 275 H902" />
          <Arrow d="M996 300 V346" label="approve" lx={1004} ly={327} />
          <Arrow d="M906 375 H870" />
          <Arrow d="M690 375 H654" />
          <Arrow d="M996 400 V470 H120 V322" label="approved hook · bearer token · no shell" lx={560} ly={488} anchor="middle" />

          {/* Legend */}
          <g transform="translate(474 514)">
            {[
              ["LLM-driven", BOX.ai],
              ["Deterministic gate", BOX.gate],
              ["Human decision", BOX.human],
              ["Service / infrastructure", BOX.infra],
            ].map(([l, c], i) => (
              <g key={l} transform={`translate(${i * 150} 0)`}>
                <rect width={12} height={12} rx={2} className={c} strokeWidth={1} />
                <text x={18} y={10} className="fill-muted" fontSize={11}>{l}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        Architecture diagram. Only the nginx edge is public; NovaCart’s internal endpoints are reachable from AegisOps on the private Docker network. Scroll sideways on small screens.
      </figcaption>
    </figure>
  );
}

/* ---------- Compact thumbnails (16:10) for projects without screenshots ---------- */

function ThumbFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 400 250" className="h-auto w-full" role="img" aria-label={label}>
      <rect width={400} height={250} className="fill-subtle" />
      {children}
    </svg>
  );
}

export function MeetingThumb() {
  const agents = ["Fact-check", "Action items", "Context / RAG", "Rolling summary"];
  return (
    <ThumbFrame label="Architecture diagram: transcript ingest, regex supervisor, four concurrent agents, broadcast to clients">
      <Box x={16} y={102} w={84} h={44} title="Ingest" sub="WebSocket" />
      <Box x={124} y={102} w={92} h={44} title="Supervisor" sub="regex, no LLM" kind="gate" />
      {agents.map((a, i) => (
        <g key={a}>
          <rect x={240} y={28 + i * 50} width={92} height={36} rx={5} className={BOX.ai} strokeWidth={1.2} />
          <text x={250} y={51 + i * 50} className="fill-ink" fontSize={11} fontWeight={600}>{a}</text>
          <Arrow d={`M216 124 C228 124 228 ${46 + i * 50} 238 ${46 + i * 50}`} />
          <Arrow d={`M332 ${46 + i * 50} C344 ${46 + i * 50} 344 124 352 124`} />
        </g>
      ))}
      <Arrow d="M100 124 H120" />
      <rect x={354} y={96} width={34} height={56} rx={5} className={BOX.infra} strokeWidth={1.2} />
      <text x={371} y={118} className="fill-ink" fontSize={9} textAnchor="middle" fontWeight={600}>fan</text>
      <text x={371} y={131} className="fill-ink" fontSize={9} textAnchor="middle" fontWeight={600}>out</text>
      <text x={16} y={236} className="fill-muted font-mono" fontSize={10}>asyncio.gather · per-client bounded queues</text>
    </ThumbFrame>
  );
}

export function OwnAiThumb() {
  // Stylised HNSW: three layers, sparser towards the top.
  const layers = [
    { y: 52, xs: [90, 300] },
    { y: 120, xs: [60, 150, 240, 330] },
    { y: 188, xs: [40, 85, 130, 175, 220, 265, 310, 355] },
  ];
  return (
    <ThumbFrame label="Diagram: HNSW layered proximity graph, sparser at the top layers">
      {layers.map((l, li) => (
        <g key={li}>
          <text x={12} y={l.y - 18} className="fill-muted font-mono" fontSize={10}>{`layer ${2 - li}`}</text>
          <line x1={24} x2={376} y1={l.y} y2={l.y} className="stroke-line" strokeDasharray="2 4" />
          {l.xs.slice(0, -1).map((x, i) => (
            <line key={i} x1={x} x2={l.xs[i + 1]} y1={l.y} y2={l.y} className="stroke-[#c4b5fd]" strokeWidth={1.5} />
          ))}
          {l.xs.map((x) => (
            <circle key={x} cx={x} cy={l.y} r={6} className="fill-surface stroke-series-2" strokeWidth={1.5} />
          ))}
        </g>
      ))}
      {/* descent path */}
      <path d="M300 52 L240 120 L220 188" fill="none" className="stroke-accent" strokeWidth={2.2} markerEnd="url(#arrow)" />
      <circle cx={220} cy={188} r={8} className="fill-accent" />
      <text x={232} y={226} className="fill-ink" fontSize={11} fontWeight={600}>nearest neighbour</text>
      <text x={12} y={240} className="fill-muted font-mono" fontSize={10}>greedy descent → beam search at layer 0</text>
    </ThumbFrame>
  );
}

export function UpiThumb() {
  const steps = ["hash", "claim", "decrypt", "fresh?", "settle"];
  return (
    <ThumbFrame label="Diagram: payment hops between phones to a bridge, then hash, claim, decrypt, freshness check and settle">
      {[40, 100, 160].map((x, i) => (
        <g key={x}>
          <rect x={x - 16} y={44} width={32} height={50} rx={6} className={BOX.infra} strokeWidth={1.2} />
          <circle cx={x} cy={86} r={2} className="fill-muted" />
          {i < 2 && <Arrow d={`M${x + 18} 69 H${x + 42}`} dashed />}
        </g>
      ))}
      <rect x={210} y={44} width={44} height={50} rx={6} className={BOX.gate} strokeWidth={1.2} />
      <text x={232} y={73} className="fill-ink" fontSize={10} textAnchor="middle" fontWeight={600}>bridge</text>
      <Arrow d="M178 69 H206" dashed />
      <text x={24} y={30} className="fill-muted font-mono" fontSize={10}>offline gossip · TTL 5 · ciphertext only</text>
      <Arrow d="M232 96 V130 H40 V146" label="HTTPS when online" lx={250} ly={118} />
      {steps.map((s, i) => (
        <g key={s}>
          <rect x={16 + i * 76} y={150} width={64} height={36} rx={5} className={i === 1 ? BOX.gate : BOX.infra} strokeWidth={1.2} />
          <text x={48 + i * 76} y={173} className="fill-ink" fontSize={11} textAnchor="middle" fontWeight={600}>{s}</text>
          {i < steps.length - 1 && <Arrow d={`M${80 + i * 76} 168 H${90 + i * 76}`} />}
        </g>
      ))}
      <text x={16} y={222} className="fill-muted font-mono" fontSize={10}>duplicates stop at the atomic claim, before RSA work</text>
    </ThumbFrame>
  );
}
