import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture";
import { CaseStudyBody, CaseStudyHeader, SimpleTable, StatRow, Wide } from "@/components/case-study";
import {
  AccuracyIntervalChart,
  CostOfAgentsChart,
  DifficultyTable,
  ScenarioTimingChart,
} from "@/components/charts/charts";
import { ContactBand } from "@/components/contact-band";
import { Screenshot } from "@/components/figure";
import { Callout } from "@/components/ui";
import { acquisition } from "@/content/aegis-data";
import { getProject } from "@/content/projects";

const project = getProject("aegisops")!;

export const metadata: Metadata = {
  title: "AegisOps case study",
  description:
    "How AegisOps turns a Prometheus alert into an evidence-backed diagnosis, a human-approved remediation and a verified recovery — and what its benchmark did and didn’t show.",
  alternates: { canonical: "/projects/aegisops" },
  openGraph: { url: "/projects/aegisops", type: "article", images: ["/opengraph-image"] },
};

const IMG = "/images/aegisops";

const toc = [
  { id: "problem", label: "The problem" },
  { id: "architecture", label: "Architecture" },
  { id: "agents", label: "The agent pipeline" },
  { id: "novacart", label: "NovaCart & Chaos Lab" },
  { id: "approval", label: "Human approval & hooks" },
  { id: "verification", label: "Recovery verification" },
  { id: "causal", label: "AegisCausal" },
  { id: "acquisition", label: "Evidence acquisition" },
  { id: "replay", label: "AegisReplay" },
  { id: "bench", label: "AegisBench" },
  { id: "security", label: "Security decisions" },
  { id: "limits", label: "Limits & next steps" },
];

const code = (s: string) => <code>{s}</code>;

export default function AegisOpsCaseStudy() {
  return (
    <>
      <CaseStudyHeader project={project}>
        <StatRow
          stats={[
            { value: "8 / 8", label: "Live fault scenarios passed on AWS", note: "One run each" },
            { value: "24–60 s", label: "Fault to incident (detection)", note: "Bound by alert rule windows" },
            { value: "129", label: "Automated tests", note: "117 AegisOps + 12 NovaCart" },
            { value: "p = 1.0", label: "Multi-agent vs single LLM accuracy", note: "No significant difference" },
          ]}
        />
        <div className="mt-10">
          <Screenshot
            src={`${IMG}/03_workspace_investigation.png`}
            alt="AegisOps incident workspace showing an investigation timeline with agent steps, evidence and the current diagnosis."
            width={1365}
            height={768}
            label="AegisOps · incident workspace"
            preload
            caption="The incident workspace: each agent step, the evidence it cited and the current diagnosis."
          />
        </div>
      </CaseStudyHeader>

      <CaseStudyBody toc={toc}>
        <p>
          AegisOps is my attempt to answer a narrow question: <strong>what would it take to let an AI system help
          during a production incident without trusting it blindly?</strong> The guiding rule I settled on is that
          the AI ranks and explains, deterministic code decides what is allowed to run, and a human approves it.
        </p>

        <h2 id="problem">The problem</h2>
        <p>
          An alert names a symptom, not a cause. Whoever is on call opens dashboards, greps logs across services,
          checks dependencies by hand, tries a fix — often a restart — and assumes it worked. The quality depends on
          who is paged, and the reasoning is rarely written down.
        </p>
        <p>AegisOps turns that into one recorded loop — observe, investigate, decide, act, verify — and holds itself to three measures:</p>
        <ul>
          <li>
            <strong>MTTD</strong> — fault to alert. Measured on AWS at 24–60 seconds, dominated by Prometheus rate
            windows and the rules’ {code("for:")} durations. It isn’t faked faster.
          </li>
          <li>
            <strong>MTTR</strong> — alert to <em>verified</em> recovery, reported as measured stage durations rather
            than an invented percentage improvement.
          </li>
          <li>
            <strong>RCA quality</strong> — finding the <em>initiating</em> failure, not the loudest symptom.
          </li>
        </ul>

        <h2 id="architecture">Architecture</h2>
        <p>
          AegisOps is a Python 3.11 / FastAPI backend. Applications register themselves — their services, dependency
          graph and remediation hooks — and their alerts arrive through Alertmanager. Everything else happens inside
          one pipeline.
        </p>
        <Wide>
          <ArchitectureDiagram />
        </Wide>
        <SimpleTable
          caption="AegisOps technology choices"
          head={["Layer", "Technology", "Why"]}
          rows={[
            ["API & validation", "FastAPI, Pydantic", "Async I/O for parallel agents; Pydantic validates every request and every LLM reply against a schema."],
            ["Orchestration", "Google ADK", "Composes the pipeline from sequential, parallel and loop agents, including the bounded evidence loop."],
            ["Specialist agents", "CrewAI", "Hosts the RCA analyst, critic and strategist behind a framework boundary."],
            ["Agent ↔ agent", "A2A (JSON-RPC)", "Token-protected calls from the ADK workflow to the CrewAI specialists."],
            ["Agent ↔ tools", "MCP", "Seven diagnostic tools: health checks, metrics, timelines, logs, PromQL."],
            ["Models", "Gemini via a custom model router", "Tiered routing across three credentials with failover and per-incident budgets."],
            ["Detection", "Prometheus, Alertmanager", "5 s scrapes, seven alert rules, webhook delivery with a per-application ingest key."],
            ["Runtime", "Docker Compose, AWS EC2, nginx", "Eleven containers on one instance behind an HTTPS edge; administered through AWS SSM."],
          ]}
        />

        <h2 id="agents">The agent pipeline</h2>
        <p>Nine production roles, grouped by what they do:</p>
        <ol>
          <li><strong>Incident commander</strong> classifies the incident, sets severity and plans the investigation.</li>
          <li><strong>Observability analyst</strong> and <strong>log forensics</strong> gather and interpret evidence through MCP tools.</li>
          <li><strong>Root-cause analyst</strong> and <strong>independent critic</strong> (CrewAI over A2A) work in parallel on the same evidence. The critic runs on a different model and never sees the analyst’s answer.</li>
          <li><strong>Debate adjudicator</strong> records agree / partial / disagree — it never averages — and may request more evidence, at most twice.</li>
          <li><strong>Remediation strategist</strong> ranks <em>registered</em> hooks only.</li>
          <li><strong>Recovery verifier</strong> judges before/after telemetry independently of the deterministic check.</li>
          <li><strong>Postmortem writer</strong> produces a blameless postmortem from the record.</li>
        </ol>
        <p>
          Every agent follows the same contract: cite evidence IDs only, never invent values, treat log lines as data
          rather than instructions, and reply with one schema-validated JSON object. Hard limits per incident — 20 LLM
          calls, $0.25, 300 seconds — are enforced in code.
        </p>

        <h2 id="novacart">NovaCart and the Chaos Lab</h2>
        <p>
          To test the loop end to end I needed something real to break. NovaCart is a separate e-commerce application
          — catalog, search, cart, demo checkout, orders, a recommendations service, a status page — on FastAPI and
          PostgreSQL. AegisOps monitors it over HTTP only. Its operator-authenticated Chaos Lab injects one reversible
          fault at a time, and hard container CPU and memory limits keep those faults bounded.
        </p>
        <Wide>
          <div className="grid gap-5 md:grid-cols-2">
            <Screenshot
              src={`${IMG}/nc_01_home.png`}
              alt="NovaCart storefront home page with a demo-store banner and product hero."
              width={1365}
              height={768}
              label="NovaCart · storefront"
              sizes="(min-width: 768px) 520px, 100vw"
              caption="NovaCart, the monitored demo store."
            />
            <Screenshot
              src={`${IMG}/nc_05_lab_login.png`}
              alt="NovaCart Chaos Lab operator sign-in page."
              width={1365}
              height={768}
              label="NovaCart · Chaos Lab"
              sizes="(min-width: 768px) 520px, 100vw"
              caption="The Chaos Lab requires an operator session."
            />
          </div>
        </Wide>
        <SimpleTable
          caption="NovaCart fault scenarios"
          head={["", "Scenario", "Alert that fires", "Initiating cause", "Registered fix"]}
          rows={[
            ["A", "Checkout HTTP 500", "5xx rate", "API (bad deployment)", code("rollback_feature_flag")],
            ["B", "DB pool exhaustion", "Pool exhausted", "Database", code("reset_db_pool")],
            ["C", "Slow recommendations", "p95 latency", "Recommendations", code("disable_recommendations")],
            ["D", "CPU pressure", "CPU", "API", code("stop_background_jobs")],
            ["E", "Memory pressure", "Memory", "API", code("release_memory")],
            ["F", "API downtime", "API down", "API", code("restart_service")],
            [<strong key="g">G</strong>, <strong key="g2">PostgreSQL lock</strong>, "5xx on the API", <strong key="g3">Database</strong>, code("cancel_blocking_query")],
            ["H", "CPU-starved API", "CPU", "API, not recs", code("stop_background_jobs")],
          ]}
        />

        <h2 id="approval">Human approval and registered remediation hooks</h2>
        <p>
          AegisOps can’t run commands. It can only call HTTP hooks that an application registered in advance, with a
          per-application bearer token, redirects disabled and no shell access. Before anything runs, three gates
          must pass:
        </p>
        <ol>
          <li>
            The deterministic policy engine requires the hook to be registered, to match the diagnosed category, a fault
            to actually be present, and confidence of at least 0.5.
          </li>
          <li>
            A human with the admin or SRE role approves — and must write a reason if the action is high-risk or the
            analysts disagreed.
          </li>
          <li>
            The approval carries the incident <strong>version</strong>. If the incident changed after the human looked
            at it, the approval is rejected as stale.
          </li>
        </ol>
        <Wide>
          <Screenshot
            src={`${IMG}/13_remediation_approval.png`}
            alt="AegisOps remediation tab: the disable_recommendations hook marked low risk, policy passed, awaiting human approval, with target, justification, blast radius, rollback and verification plan."
            width={1365}
            height={768}
            label="AegisOps · remediation approval"
            caption="Proposed → policy → approval. The card shows the exact hook, its blast radius, rollback plan and how recovery will be verified."
          />
        </Wide>

        <h2 id="verification">Independent recovery verification</h2>
        <p>
          A fix isn’t done when the hook returns 200. After execution AegisOps waits a deliberate 45-second settle
          period, re-measures the same telemetry deterministically, and asks an independent LLM verifier to judge the
          before/after evidence. It then records an attribution verdict — {code("attributed")},{" "}
          {code("not_attributable")} or {code("unknown")}. If a fault had already auto-expired and the hook changed
          nothing, the recovery is labelled not attributable rather than claimed.
        </p>
        <Wide>
          <ScenarioTimingChart />
        </Wide>
        <p>
          All eight scenarios passed on the public AWS deployment with live Gemini calls: correct diagnosis, correct
          initiating component, the expected fix, and a verified recovery. Scenario F recovered, but its attribution
          was recorded as {code("unknown")} because the restart hook didn’t yet report a state change — it does now.
          Two earlier failed attempts at C and G stay in the incident history; they were not deleted.
        </p>

        <h2 id="causal">AegisCausal: finding the initiating cause</h2>
        <p>
          Scenario G is the one I designed to fool a naive responder. A “schema migration” holds an{" "}
          {code("ACCESS EXCLUSIVE")} lock on NovaCart’s inventory table. API reads wait, then fail with 5xx. There is
          deliberately no database-latency alert, so the alert that fires names <strong>novacart-api</strong>.
          Restarting the API wouldn’t release the lock.
        </p>
        <p>
          AegisCausal is a deterministic consistency test over the registered dependency graph and the order in which
          signals became anomalous. On G it marked the API <em>contradicted</em> — an anomalous dependency sits
          upstream — and the database <em>consistent</em>, because it explains the API failure and its onset came
          first. It flagged the alert as misattributed. The approved {code("cancel_blocking_query")} terminated the
          blocking session and recovery was attributed in 52.2 seconds.
        </p>
        <Wide>
          <div className="grid gap-5 md:grid-cols-[1.35fr_1fr]">
            <Screenshot
              src={`${IMG}/05_causal_graph.png`}
              alt="AegisCausal view: dependency graph shopfront-web to shopfront-api to shopfront-db, competing causal explanations marked consistent and contradicted, and an evidence timeline."
              width={1365}
              height={768}
              label="AegisCausal · competing explanations"
              sizes="(min-width: 768px) 600px, 100vw"
              caption="Competing explanations with onset times. Here the database is anomalous only on a client-side latency signal, so it is not counted as the cause."
            />
            <Screenshot
              src={`${IMG}/aws_aegisops_G_causal_misleading_alert.jpg`}
              alt="Low-resolution capture of AegisCausal on the live AWS Scenario G incident, flagging that the alert names a downstream component."
              width={608}
              height={342}
              label="AWS · Scenario G"
              sizes="(min-width: 768px) 440px, 100vw"
              caption="Scenario G on AWS: “the alert names a downstream component.” (Low-resolution pane capture.)"
            />
          </div>
        </Wide>
        <Callout title="Honest framing">
          AegisCausal is a <strong>consistency test, not a proof of causation</strong>. It depends on a correct
          dependency graph; a wrong graph or an unmonitored confounder could mislead it.
        </Callout>

        <h2 id="acquisition">Active evidence acquisition</h2>
        <p>
          When two explanations tie, the system can gather one more observation instead of guessing. A deterministic
          ambiguity check detects when onset order can’t separate the candidates; a request — chosen by the
          adjudicator, or by a labelled planner filling gaps — runs as a real, budgeted MCP call; the causal check is
          re-run; and a second debate round uses the new evidence.
        </p>
        <p>
          In a CPU-starved scenario, round-one consensus blamed the database. The extra request pulled the database’s
          own logs — 2–3 ms statements, normal server-side work — and the diagnosis flipped to CPU saturation on the
          API.
        </p>
        <Wide>
          <Screenshot
            src={`${IMG}/04_causal_provenance_and_acquisition.png`}
            alt="AegisOps causal view showing an evidence request, the returned log lines and the resulting change in hypothesis."
            width={1365}
            height={768}
            label="AegisOps · evidence acquisition"
            caption="An evidence request, what came back, and the hypothesis change it caused."
          />
        </Wide>
        <SimpleTable
          caption="Fixed versus interactive evidence, AegisOps, seven hard scenarios"
          head={["AegisOps, 7 hard scenarios × 2", "Fixed evidence", "With acquisition"]}
          rows={[
            ["Top-1 diagnosis", `${Math.round(acquisition.fixed.top1 * 100)}%`, `${Math.round(acquisition.interactive.top1 * 100)}%`],
            ["Initiating component", `${Math.round(acquisition.fixed.initiating * 100)}%`, `${Math.round(acquisition.interactive.initiating * 100)}%`],
            ["Correct remediation", `${Math.round(acquisition.fixed.remediation * 100)}%`, `${Math.round(acquisition.interactive.remediation * 100)}%`],
            ["Paired test (diagnosis)", "—", `p = ${acquisition.diagnosisP.toFixed(1)} (one discordant pair)`],
          ]}
        />
        <Callout title="Honest framing" tone="warn">
          Only <strong>{acquisition.llmChosen} of {acquisition.requestsExecuted}</strong> evidence requests were chosen
          by the LLM; the rest came from the deterministic planner. This is mostly deterministic evidence planning —
          the model uses new evidence well but rarely asks for it. A later stop rule cut executed requests from{" "}
          {acquisition.requestsExecuted} to {acquisition.afterStopRule.executed} and raised the useful-request rate from
          43% to {Math.round(acquisition.afterStopRule.usefulRate * 100)}%.
        </Callout>

        <h2 id="replay">AegisReplay</h2>
        <p>
          Every incident is an append-only log of 31 event types. Each event stores{" "}
          {code("sha256(prev_hash + event)")}, and the state at any point is rebuilt <em>only</em> from events up to
          that point — so you can scrub back to the moment a hypothesis changed and see exactly what the agents knew
          then, without hindsight.
        </p>
        <Wide>
          <Screenshot
            src={`${IMG}/09_replay_hypothesis_change.png`}
            alt="AegisReplay: event log with key moments, the state known at event 51 rebuilt from earlier events, and a decision audit showing a candidate changing from contradicted to consistent."
            width={1365}
            height={768}
            label="AegisReplay · forensic reconstruction"
            caption="State at event #51, rebuilt from events 1–51 only. The hash chain is verified on load."
          />
        </Wide>
        <Callout title="Honest framing">
          A hash chain is <strong>tamper-evident, not tamper-proof</strong>. Edits are detectable, but anyone with file
          access could rewrite the whole chain. Anchoring the head hash externally is future work.
        </Callout>

        <h2 id="bench">AegisBench: the result that said no</h2>
        <p>
          The obvious question about nine cooperating agents is whether they beat one model call. AegisBench compares
          four approaches on <strong>identical evidence</strong>: deterministic rules, the rules plus AegisCausal, a
          single LLM call, and the full pipeline. Every row stores a digest of its evidence bundle; ground truth is
          stored apart and a canary string asserts it never reaches a prompt; baselines were frozen before any LLM run;
          nothing is executed.
        </p>
        <Wide>
          <AccuracyIntervalChart />
        </Wide>
        <p>
          <strong>The multi-agent pipeline was not more accurate than a single LLM call.</strong> Both scored 93%; the
          paired sign test gave p = 1.0. The pipeline cost roughly 6× the LLM calls and 8× the latency.
        </p>
        <Wide>
          <div className="grid gap-5">
            <CostOfAgentsChart />
            <DifficultyTable />
          </div>
        </Wide>
        <Callout title="The engineering lesson" tone="accent">
          Reporting this as a learning changed how I describe the project. The benchmark doesn’t support “better
          diagnosis”. What the architecture does add is <strong>governance</strong>: an independent critic whose
          disagreement is a measured uncertainty signal, cited evidence, a deterministic policy gate, human approval,
          verified recovery and a replayable record. The benchmark also exposed a real safety bug — a monitoring false
          positive that led to a recommended restart — which is now fixed with a regression test.{" "}
          <Link href="/writing/multi-agent-negative-result">I wrote more about this result</Link>.
        </Callout>
        <Wide>
          <Screenshot
            src={`${IMG}/11_bench_at_a_glance.png`}
            alt="AegisBench page in the AegisOps console comparing four approaches on hard scenarios with confidence intervals, unsafe-recommendation rates, latency and cost."
            width={1365}
            height={768}
            label="AegisOps · AegisBench"
            caption="The AegisBench page in the console, here showing the seven-hard-scenario run. I chose those scenarios, so their lower p-values against the rule baselines aren’t a general result."
          />
        </Wide>
        <p>
          Threats to validity I’d want any reader to weigh: 15 scenarios and 2 repeats give wide intervals (±15 points);
          10 of 15 scenarios are solved by everything; the synthetic scenarios were written by me; only one model family
          was tested; and costs are estimates from token counts.
        </p>

        <h2 id="security">Security decisions</h2>
        <ul>
          <li>The AI never gets shell access; it can only propose registered HTTP hooks, and every hook call needs policy and human approval.</li>
          <li>Alert ingestion requires a per-application key; agent-to-agent calls are token-protected.</li>
          <li>NovaCart’s {code("/internal/*")} routes are never exposed by the public web tier — verified on the live host.</li>
          <li>On AWS: no SSH (administration via SSM), IMDSv2 required, only ports 80 and 443 open, secrets in SSM Parameter Store, the database on a private network.</li>
          <li>The console enforces JWT auth, server-side roles and a strict Content Security Policy; only placeholder environment files are committed.</li>
        </ul>

        <h2 id="limits">Limits and what I’d do next</h2>
        <p>AegisOps is a research and portfolio project, not production software. Its known limits:</p>
        <ul>
          <li>No measured accuracy advantage for multi-agent on this benchmark.</li>
          <li>Evidence acquisition is mostly deterministic planning.</li>
          <li>The state store is a single-node JSON file store — no high availability.</li>
          <li>Live AWS results are one run per scenario: a demonstration, not a statistic.</li>
          <li>Demo roles only — no SSO, a shared demo password, no penetration test.</li>
        </ul>
        <p>
          Next I’d want an independent benchmark of 100+ incidents across several model families, an ablation that keeps
          only the agents that earn their cost (the two evidence analysts were usually wrong on their own while the final
          answer was right), LLM-planned evidence acquisition, and a PostgreSQL-backed store with multiple workers.
        </p>
        <p>
          The full source, design documents and benchmark data are on{" "}
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
