import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture";
import { CaseStudyBody, CaseStudyHeader, Measure, NoteGrid, SimpleTable, StatRow, Wide } from "@/components/case-study";
import { AccuracyIntervalChart, BeforeAfter, CostOfAgentsChart, DifficultyTable } from "@/components/charts/charts";
import { ScenarioExplorer } from "@/components/charts/scenario-explorer";
import { ContactBand } from "@/components/contact-band";
import { AegisArchitecture } from "@/components/diagrams";
import { Screenshot } from "@/components/figure";
import { Gallery, type Shot } from "@/components/gallery";
import { Callout } from "@/components/ui";
import { acquisition } from "@/content/aegis-data";
import { getProject } from "@/content/projects";

const project = getProject("aegisops")!;

export const metadata: Metadata = {
  title: "AegisOps case study — multi-agent incident investigation",
  description:
    "Architecture, nine-agent pipeline, AegisCausal, AegisReplay, AegisBench and eight live AWS fault scenarios — including an honest benchmark where multi-agent did not beat a single LLM call.",
  alternates: { canonical: "/projects/aegisops" },
  openGraph: { url: "/projects/aegisops", type: "article", images: ["/opengraph-image"] },
};

const IMG = "/images/aegisops";
const W = 1365;
const H = 768;

const shots: Shot[] = [
  { src: `${IMG}/01_dashboard.png`, width: W, height: H, title: "Dashboard", caption: "Open incidents, approvals waiting, verified resolutions with MTTR, and AI usage.", alt: "AegisOps dashboard with incident counts, MTTR, LLM usage and service health." },
  { src: `${IMG}/02_incidents.png`, width: W, height: H, title: "Incident history", caption: "Every incident with severity, state, AI root cause and confidence, calls and cost.", alt: "AegisOps incident history table listing incidents, severities, states, root causes, AI calls and estimated cost." },
  { src: `${IMG}/03_workspace_investigation.png`, width: W, height: H, title: "Investigation & agent execution", caption: "Agent-by-agent investigation timeline with the evidence each step cited.", alt: "AegisOps incident workspace showing the agent investigation timeline and cited evidence." },
  { src: `${IMG}/05_causal_graph.png`, width: W, height: H, title: "AegisCausal graph", caption: "Dependency graph, onset times and competing explanations marked consistent or contradicted.", alt: "AegisCausal dependency graph with competing causal explanations and an evidence timeline." },
  { src: `${IMG}/06_causal_explanations.png`, width: W, height: H, title: "Competing explanations", caption: "Why each candidate is consistent or contradicted, with evidence IDs.", alt: "AegisCausal competing explanations panel with consistency verdicts and evidence identifiers." },
  { src: `${IMG}/04_causal_provenance_and_acquisition.png`, width: W, height: H, title: "Evidence acquisition", caption: "A targeted evidence request, the result, and the hypothesis change it caused.", alt: "AegisOps evidence acquisition view showing a request, returned log lines and a changed hypothesis." },
  { src: `${IMG}/08_replay_evidence_request.png`, width: W, height: H, title: "Replay: evidence request", caption: "The replay at the moment the adjudicator asked for more evidence.", alt: "AegisReplay event log at an evidence request event." },
  { src: `${IMG}/09_replay_hypothesis_change.png`, width: W, height: H, title: "Replay: hypothesis change", caption: "State rebuilt from events 1–51 only; a candidate flips from contradicted to consistent.", alt: "AegisReplay forensic reconstruction at event 51 with a decision audit." },
  { src: `${IMG}/11_bench_at_a_glance.png`, width: W, height: H, title: "AegisBench", caption: "Four approaches on identical evidence with Wilson intervals, latency and cost.", alt: "AegisBench comparison table of four approaches with confidence intervals, unsafe rates, latency and cost." },
  { src: `${IMG}/12_bench_fixed_vs_interactive.png`, width: W, height: H, title: "Fixed vs interactive evidence", caption: "Paired comparison of AegisOps with and without evidence acquisition.", alt: "AegisBench fixed versus interactive evidence comparison." },
  { src: `${IMG}/13_remediation_approval.png`, width: W, height: H, title: "Remediation approval", caption: "Proposed → policy → human approval, bound to the incident version.", alt: "AegisOps remediation approval card with target, justification, blast radius, rollback and verification plan." },
  { src: `${IMG}/aws_aegisops_G_remediation_verified.jpg`, width: 608, height: 342, title: "Recovery verified (AWS)", caption: "Scenario G on AWS: cancel_blocking_query executed and recovery verified. Low-resolution capture.", alt: "Low-resolution capture of the Scenario G remediation marked executed and recovered on the AWS deployment." },
  { src: `${IMG}/nc_01_home.png`, width: W, height: H, title: "NovaCart storefront", caption: "The monitored demo store; orders are demonstration transactions.", alt: "NovaCart storefront home page with a demo-store banner.", focus: "0% 0%" },
  { src: `${IMG}/nc_02_shop.png`, width: W, height: H, title: "NovaCart catalog", caption: "Catalog, search and filters backed by FastAPI and PostgreSQL.", alt: "NovaCart product catalog page with filters.", focus: "0% 0%" },
  { src: `${IMG}/nc_05_lab_login.png`, width: W, height: H, title: "NovaCart Chaos Lab", caption: "Fault injection requires an operator session; one fault at a time.", alt: "NovaCart Chaos Lab operator sign-in page.", focus: "50% 30%" },
];

const toc = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "agents", label: "Multi-agent system" },
  { id: "features", label: "Engineering features" },
  { id: "novacart", label: "NovaCart integration" },
  { id: "remediation", label: "Remediation & recovery" },
  { id: "causal", label: "AegisCausal" },
  { id: "acquisition", label: "Evidence acquisition" },
  { id: "replay", label: "AegisReplay" },
  { id: "results", label: "Testing & results" },
  { id: "bench", label: "AegisBench" },
  { id: "gallery", label: "Screenshot gallery" },
  { id: "lessons", label: "Lessons & limits" },
];

const code = (s: string) => <code>{s}</code>;

export default function AegisOpsCaseStudy() {
  return (
    <>
      <CaseStudyHeader project={project}>
        <StatRow
          stats={[
            { value: "8 / 8", label: "live AWS fault scenarios passed end to end", note: "one run each" },
            { value: "117", label: "AegisOps automated tests", note: "+ 12 NovaCart tests" },
            { value: "24–60 s", label: "fault → incident detection on AWS", note: "bound by alert windows" },
            { value: "p = 1.0", label: "multi-agent vs single-LLM accuracy", note: "no significant difference" },
          ]}
        />
        <div className="mt-8">
          <Screenshot
            src={`${IMG}/03_workspace_investigation.png`}
            alt="AegisOps incident workspace showing the agent investigation timeline, cited evidence and current diagnosis."
            width={W}
            height={H}
            label="AegisOps · incident workspace"
            preload
            sizes="(min-width: 1200px) 1136px, 100vw"
            caption="The incident workspace: each agent step, the evidence it cited, and the diagnosis as it formed. Unedited capture."
          />
        </div>
      </CaseStudyHeader>

      <CaseStudyBody toc={toc}>
        <Measure>
          <h2 id="overview" className="!mt-0">Overview</h2>
          <p>
            When a production service breaks, monitoring fires an alert — but an alert names a <strong>symptom</strong>, not a
            cause. Someone is paged, opens dashboards, greps logs across services, tries a fix (often a restart) and assumes it
            worked. The quality depends on who is on call, and the reasoning is rarely written down. Slow or wrong diagnosis is
            where outage minutes go.
          </p>
          <p>
            AegisOps asks a narrow question: <strong>how can an AI system help during an incident without being trusted
            blindly?</strong> The answer it’s built around is one rule — <em>the AI ranks and explains, deterministic code decides
            what is allowed to run, and a human approves it</em> — and one loop: observe, investigate, decide, act, verify, record.
          </p>
          <p>It holds itself to three explicit measures:</p>
          <ul>
            <li><strong>MTTD</strong> (fault → alert): measured on AWS at 24–60 s, dominated by Prometheus rate windows and {code("for:")} durations. Not faked faster.</li>
            <li><strong>MTTR</strong> (alert → <em>verified</em> recovery): reported as measured stage durations, not an invented percentage improvement.</li>
            <li><strong>RCA quality</strong>: finding the <em>initiating</em> failure rather than the loudest symptom.</li>
          </ul>

          <h2 id="architecture">Architecture</h2>
          <p>
            AegisOps is a Python 3.11 / FastAPI service. Applications register their services, dependency graph and remediation
            hooks; their alerts arrive through Alertmanager. Everything after that happens inside one auditable pipeline.
          </p>
        </Measure>

        <Wide>
          <div className="hidden md:block"><AegisArchitecture /></div>
          <div className="md:hidden"><ArchitectureDiagram /></div>
        </Wide>

        <SimpleTable
          caption="AegisOps technology choices"
          head={["Layer", "Technology", "Why"]}
          rows={[
            ["API & validation", "FastAPI, Pydantic", "Async I/O for parallel agents; Pydantic validates every request and every LLM reply against a schema."],
            ["Orchestration", "Google ADK", "Composes sequential, parallel and loop agents — including the bounded evidence loop — with callbacks that time each step."],
            ["Specialists", "CrewAI over A2A", "RCA analyst, independent critic and strategist behind a token-protected JSON-RPC boundary."],
            ["Tools", "MCP", "Seven diagnostic tools: HTTP health, metrics, PromQL, metric timelines, log search, container and database checks."],
            ["Models", "Gemini via ModelRouter", "Reasoning and fast tiers across three credentials, failover, schema repair, and per-incident budgets."],
            ["Detection", "Prometheus, Alertmanager", "5 s scrapes, seven alert rules, webhook delivery with a per-application ingest key."],
            ["Runtime", "Docker Compose, AWS EC2, nginx", "Eleven containers on one instance behind HTTPS; administered through AWS SSM with no SSH."],
            ["Persistence", "JSON state store, PostgreSQL 16", "Atomic incident records and an append-only event log (AegisOps); NovaCart’s own database."],
          ]}
        />

        <Measure>
          <h2 id="agents">Multi-agent system</h2>
          <p>
            Nine production roles, defined in {code("app/sre/agents.py")} and routed in {code("app/llm/router.py")}. The root-cause
            analyst and the independent critic run <strong>in parallel on the same evidence</strong>; the critic uses a different
            model and never sees the analyst’s answer, so their disagreement is a genuine uncertainty signal.
          </p>
        </Measure>
        <SimpleTable
          caption="AegisOps agent roles"
          head={["#", "Role", "Stage", "Responsibility"]}
          rows={[
            ["1", <strong key="1">Incident commander</strong>, "Investigate", "Classifies the incident, sets severity, plans the investigation."],
            ["2", <strong key="2">Observability analyst</strong>, "Investigate", "Interprets metrics through MCP tools."],
            ["3", <strong key="3">Log forensics</strong>, "Investigate", "Finds error patterns through MCP tools."],
            ["4", <strong key="4">Root-cause analyst</strong>, "Diagnose", "CrewAI over A2A — ranked hypotheses with a causal chain."],
            ["5", <strong key="5">Independent critic</strong>, "Diagnose", "CrewAI over A2A — challenges the obvious explanation, blind to the analyst."],
            ["6", <strong key="6">Debate adjudicator</strong>, "Diagnose", "Agree / partial / disagree; never averages; may request more evidence (≤ 2 rounds)."],
            ["7", <strong key="7">Remediation strategist</strong>, "Respond", "CrewAI over A2A — ranks registered hooks only."],
            ["8", <strong key="8">Recovery verifier</strong>, "Respond", "Judges before/after telemetry independently of the deterministic check."],
            ["9", <strong key="9">Postmortem writer</strong>, "Respond", "Writes a blameless postmortem from the recorded chain."],
          ]}
        />
        <Callout title="Benchmark-only role">
          A tenth role, the <strong>Single-Agent Investigator</strong>, exists only as the AegisBench baseline: one LLM call on the
          same evidence and the same reasoning-tier model. It is not part of the production pipeline.
        </Callout>

        <Measure>
          <h2 id="features">Major engineering features</h2>
        </Measure>
        <NoteGrid
          items={[
            { tag: "Reasoning", title: "AegisCausal", body: <>A deterministic consistency test over the registered dependency graph and signal onset order. Marks candidates consistent or contradicted and flags alerts that name a downstream component.</> },
            { tag: "Audit", title: "AegisReplay", body: <>Append-only log of 31 event types; each stores <code>sha256(prev_hash + event)</code>. State at any event is rebuilt only from earlier events — no hindsight.</> },
            { tag: "Evaluation", title: "AegisBench", body: <>Four approaches on identical evidence, with bundle digests, separated ground truth, a canary string, frozen baselines and paired sign tests.</> },
            { tag: "Investigation", title: "Active evidence acquisition", body: <>When explanations tie, an ambiguity check plans a targeted, budgeted MCP request, re-runs the causal check and starts a second debate round.</> },
            { tag: "Reasoning", title: "Independent critic", body: <>Runs in parallel on a different model without seeing the analyst. The adjudicator records agreement instead of averaging.</> },
            { tag: "Reliability", title: "Structured agent outputs", body: <>Every agent replies with one JSON object validated against a Pydantic schema (<code>RCAReport</code>, <code>Adjudication</code>, <code>RemediationStrategy</code>…). One repair attempt, then failover.</> },
            { tag: "Safety", title: "Callbacks & guardrails", body: <>ADK before/after-agent callbacks time every step and export per-agent duration metrics to Prometheus. Untrusted text is secret-redacted, screened for prompt-injection phrases and wrapped in data delimiters before any model sees it.</> },
            { tag: "Cost control", title: "Model routing & budgets", body: <>ModelRouter enforces per-incident caps — 20 LLM calls, 120k tokens, $0.25, 300 s — retries or fails over on 429/5xx, and logs every call without storing prompts or keys.</> },
            { tag: "Safety", title: "Controlled remediation", body: <>No shell. Only hooks the application registered can run, after a deterministic policy check and a version-bound human approval.</> },
            { tag: "Verification", title: "Recovery attribution", body: <>After a 45 s settle, telemetry is re-measured and an independent verifier judges it. Verdict: <code>attributed</code>, <code>not_attributable</code> or <code>unknown</code>.</> },
          ]}
        />

        <Measure>
          <h2 id="novacart">NovaCart integration</h2>
          <p>
            To exercise the loop end to end I built <strong>NovaCart</strong>, a separate working e-commerce app — catalog, search,
            cart, demo checkout, orders, a recommendations service and a status page — on FastAPI and PostgreSQL.
          </p>
          <ul>
            <li><strong>How it’s monitored:</strong> Prometheus scrapes {code("novacart_*")} metrics from {code("/internal/metrics")} every 5 s; seven rules cover 5xx rate, p95 latency, API down, DB unavailable, pool exhausted, CPU and memory. Alertmanager routes {code('application="novacart"')} to AegisOps with NovaCart’s own ingest key.</li>
            <li><strong>How faults are introduced:</strong> the operator-authenticated Chaos Lab injects one reversible fault at a time. Container limits (1 CPU, 512 MB for the API) bound the CPU and memory faults, and each fault records how it ended — {code("remediation:<hook>:<incident>")}, {code("auto-expired")} or {code("operator-reset")}.</li>
            <li><strong>How AegisOps investigates and acts:</strong> MCP tools read NovaCart’s health, logs and PromQL over the private network; the strategist can only choose among the hooks NovaCart registered; the hook reports whether it actually changed state.</li>
          </ul>
        </Measure>
        <SimpleTable
          caption="NovaCart fault scenarios"
          head={["ID", "Scenario", "Alert that fires", "Initiating cause", "Registered fix"]}
          rows={[
            ["A", "Checkout HTTP 500", "5xx rate", "API (bad deployment)", code("rollback_feature_flag")],
            ["B", "DB pool exhaustion", "Pool exhausted", "Database", code("reset_db_pool")],
            ["C", "Slow recommendations", "p95 latency", "Recommendations", code("disable_recommendations")],
            ["D", "CPU pressure", "CPU", "API", code("stop_background_jobs")],
            ["E", "Memory pressure", "Memory", "API", code("release_memory")],
            ["F", "API downtime", "API down", "API", code("restart_service")],
            [<strong key="g">G</strong>, <strong key="g2">PostgreSQL blocking lock</strong>, "5xx on the API (misleading)", <strong key="g3">Database</strong>, code("cancel_blocking_query")],
            ["H", "CPU-starved API", "CPU (misleading dependency symptom)", "API, not recs", code("stop_background_jobs")],
          ]}
        />

        <Measure>
          <h2 id="remediation">Remediation, approval and recovery</h2>
          <p>
            AegisOps talks to a monitored app only through HTTP hooks registered in advance, with a per-app bearer token, redirects
            disabled and no shell. Before anything runs: the policy engine requires the hook to be registered, to match the
            diagnosed category, a fault to be present and confidence ≥ 0.5; then a human with the admin or SRE role approves —
            writing a reason if the action is high-risk or the analysts disagreed. The approval carries the incident version, and a
            per-incident lock prevents double execution.
          </p>
        </Measure>
        <Wide>
          <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
            <Screenshot src={`${IMG}/13_remediation_approval.png`} alt="Remediation approval card showing the hook, policy result, blast radius, rollback and verification plan." width={W} height={H} label="Remediation approval" sizes="(min-width: 768px) 640px, 100vw" caption="The approval card: exact hook and target, justification, blast radius, rollback and how recovery will be checked." />
            <Screenshot src={`${IMG}/aws_aegisops_G_remediation_verified.jpg`} alt="Low-resolution capture of Scenario G remediation executed and recovery verified on AWS." width={608} height={342} label="AWS · recovery verified" sizes="(min-width: 768px) 420px, 100vw" caption="Scenario G on AWS: executed, then verified. Low-resolution pane capture." />
          </div>
        </Wide>

        <Measure>
          <h2 id="causal">AegisCausal: initiating cause, not loudest symptom</h2>
          <p>
            In Scenario G a simulated migration holds an {code("ACCESS EXCLUSIVE")} lock on NovaCart’s inventory table. API reads
            wait, then fail with 5xx. There is deliberately no database-latency alert, so the alert names <strong>novacart-api</strong>
            — and restarting it would not release the lock. AegisCausal marked the API <em>contradicted</em> (an anomalous dependency
            sits upstream) and the database <em>consistent</em> (it explains the failure and its onset came first), and flagged the
            alert as misattributed. The approved {code("cancel_blocking_query")} ended the blocking session; recovery was attributed
            in 52.2 s.
          </p>
        </Measure>
        <Wide>
          <div className="grid gap-5 md:grid-cols-2">
            <Screenshot src={`${IMG}/05_causal_graph.png`} alt="AegisCausal dependency graph and competing explanations." width={W} height={H} label="AegisCausal" sizes="(min-width: 768px) 540px, 100vw" caption="A database anomalous only by a client-side timer is not counted as the cause." />
            <Screenshot src={`${IMG}/aws_aegisops_G_causal_misleading_alert.jpg`} alt="Low-resolution capture of AegisCausal on AWS Scenario G flagging the alert as naming a downstream component." width={608} height={342} label="AWS · Scenario G" sizes="(min-width: 768px) 540px, 100vw" caption="“The alert names a downstream component.” Low-resolution pane capture." />
          </div>
        </Wide>
        <Callout title="Honest framing">
          AegisCausal is a consistency test, not a proof of causation. It depends on a correct dependency graph; a wrong graph or an
          unmonitored confounder could mislead it. <Link href="/writing/root-cause-not-symptoms">More on how it works, and two bugs it exposed.</Link>
        </Callout>

        <Measure>
          <h2 id="acquisition">Active evidence acquisition</h2>
          <p>
            In an early interactive run the agents made <strong>zero</strong> extra tool calls despite having the capability — the
            evidence analysts stopped at step one and recommended checks were never executed. The fix was structural: a
            deterministic ambiguity check, hypothesis-linked requests chosen by the adjudicator (with a labelled planner filling
            gaps), real budgeted MCP calls, impact measured by re-running the causal check, and a second debate round. In a
            CPU-starved scenario, round-one consensus blamed the database; the database’s own logs showed 2–3 ms statements, and
            the diagnosis flipped to CPU saturation on the API.
          </p>
        </Measure>
        <Wide>
          <Screenshot src={`${IMG}/04_causal_provenance_and_acquisition.png`} alt="Evidence acquisition view: a request, the returned logs, and the hypothesis change." width={W} height={H} label="Evidence acquisition" caption="An evidence request, what came back, and the hypothesis change it caused." />
        </Wide>
        <Callout title="Honest framing" tone="warn">
          Only <strong>{acquisition.llmChosen} of {acquisition.requestsExecuted}</strong> evidence requests were chosen by the LLM;
          the rest came from the deterministic planner. This is mostly deterministic evidence planning — the model uses new evidence
          well but rarely asks for it.
        </Callout>

        <Measure>
          <h2 id="replay">AegisReplay</h2>
          <p>
            Every incident is an append-only log of 31 event types, each hashed with the previous event’s hash. Scrub to any event and
            the console rebuilds exactly what the agents knew then — useful for reviewing a decision without hindsight bias. A hash
            chain is <strong>tamper-evident, not tamper-proof</strong>: edits are detectable, but anyone with file access could
            rewrite the whole chain. External anchoring is future work.
          </p>
        </Measure>
        <Wide>
          <Screenshot src={`${IMG}/09_replay_hypothesis_change.png`} alt="AegisReplay reconstruction at event 51 with key moments and decision audit." width={W} height={H} label="AegisReplay" caption="State at event #51, rebuilt from events 1–51 only. The hash chain is verified on load." />
        </Wide>

        <Measure>
          <h2 id="results">Testing and experimental results</h2>
          <p>
            <strong>129 automated tests</strong> at the last run: 117 for AegisOps (pipeline, policy, approval races, A2A
            authentication, causal ranking, replay integrity, NovaCart integration) and 12 for NovaCart (catalog, checkout, token-gated
            internal routes, one-fault-at-a-time, fault reversibility and auto-expiry, Chaos Lab session security). Passing tests are
            a regression net for orchestration and safety logic — not proof of production readiness.
          </p>
          <p>Then every scenario ran live on the public AWS deployment, with real Gemini calls and no mocked model output:</p>
        </Measure>
        <Wide>
          <ScenarioExplorer />
        </Wide>
        <Measure>
          <p>
            Per investigation: 10–14 LLM calls at roughly $0.005–0.009 (estimated from tokens). Recovery takes about 49 s, almost all
            of it the intentional settle. The first AWS run’s failed attempts at C and G remain in the incident history; they were
            fixed (an episode-aware onset bug and a lock-holder lookup bug) and re-run.
          </p>
        </Measure>

        <Measure>
          <h2 id="bench">AegisBench: single agent vs multi-agent</h2>
          <p>
            The obvious question about nine cooperating agents is whether they beat one model call. AegisBench compared four
            approaches on <strong>identical evidence</strong> — deterministic rules, rules plus AegisCausal, a single LLM call, and
            the full pipeline — 15 scenarios × 2 repeats. Nothing is executed; recommendations are scored.
          </p>
        </Measure>
        <Wide>
          <AccuracyIntervalChart />
        </Wide>
        <Measure>
          <p>
            <strong>The multi-agent pipeline was not more accurate than a single LLM call</strong> — 93% each, paired sign test
            p = 1.0 — at about 6× the LLM calls and 8× the latency. With 30 pairs and a 93% ceiling, the benchmark could only have
            detected a very large effect.
          </p>
        </Measure>
        <Wide>
          <div className="grid gap-5">
            <CostOfAgentsChart />
            <DifficultyTable />
          </div>
        </Wide>
        <Measure>
          <h3>Before and after: what changed when I fixed things</h3>
        </Measure>
        <Wide>
          <BeforeAfter
            items={[
              { metric: "AegisOps top-1 on 7 hard scenarios", before: 0.93, after: 1.0, unit: "%", note: "Fixed evidence → with acquisition, paired (n = 14). One discordant pair, p = 1.0 — not significant." },
              { metric: "Useful evidence requests", before: 0.43, after: 0.86, unit: "%", note: "Before vs after adding a stop rule (3 ambiguous scenarios × 2). Executed requests fell from 14 to 7." },
              { metric: "Unsafe remediation recommendations", before: 0.07, after: 0, unit: "%", note: "After adding fault_present. Measured on the scenarios that informed the fix — a regression check, not generalisation." },
              { metric: "AegisOps initiating-component accuracy (hard)", before: 0.8, after: 1.0, unit: "%", note: "Fixed vs interactive evidence on the same 7 hard scenarios × 2. Exploratory." },
            ]}
          />
        </Wide>
        <Callout title="The engineering lesson" tone="accent">
          The benchmark doesn’t support “better diagnosis”, so I don’t claim it. What the architecture adds is <strong>governance</strong>:
          an independent critic whose disagreement is measured, cited evidence, a deterministic policy gate, human approval, verified
          recovery and a replayable record. It also surfaced a real safety bug — a monitoring false positive that led to a recommended
          restart — now fixed with a regression test. <Link href="/writing/multi-agent-negative-result">Read the full write-up.</Link>
        </Callout>

        <Measure>
          <h2 id="gallery">Screenshot gallery</h2>
          <p>Fifteen unedited captures from the repository. Select any image to enlarge it; use the arrow keys to move between them.</p>
        </Measure>
        <Wide>
          <Gallery shots={shots} />
        </Wide>

        <Measure>
          <h2 id="lessons">Lessons, trade-offs and limits</h2>
          <ul>
            <li><strong>Measure before you claim.</strong> The benchmark disproved the obvious selling point, and changed how I describe the project.</li>
            <li><strong>Schemas shape behaviour.</strong> A forced failure-category enum produced a confident restart on a healthy service.</li>
            <li><strong>Tool access is not tool use.</strong> It took deterministic planning to make the agents gather evidence.</li>
            <li><strong>Live environments find bugs fixtures don’t.</strong> Six bugs appeared only with real timing and leftover state on AWS.</li>
            <li><strong>Attribution needs ground truth from the system.</strong> The hook’s {code("changed")} flag and the fault’s ended-by record provide it.</li>
          </ul>
          <p>
            Known limits: no measured accuracy advantage for multi-agent on this benchmark (small n, author-written scenarios, one
            model family); evidence acquisition is mostly planner-driven; the state store is a single-node JSON store; live results
            are one run per scenario; demo roles only, a shared demo password and no penetration test. Next: an independent
            100+ incident benchmark across model families, an ablation keeping only agents that earn their cost, LLM-planned
            acquisition, and a PostgreSQL-backed store with multiple workers.
          </p>
        </Measure>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
