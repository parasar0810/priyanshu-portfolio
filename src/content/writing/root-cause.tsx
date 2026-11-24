import Link from "next/link";
import { Callout } from "@/components/ui";

export default function RootCause() {
  return (
    <>
      <p>
        The alert that fires during an incident tells you where the pain is felt, not where it started. In a service graph,
        failures travel downstream: a locked database table becomes slow API reads, which become HTTP 5xx errors, which become
        the only alert anyone sees. If your investigation starts and ends with that alert, you fix the wrong thing.
      </p>
      <p>
        I built a scenario into AegisOps specifically to make that mistake easy. This is how the system avoids it, and the two
        times my own reasoning got it wrong first.
      </p>

      <h2>Scenario G: an alert that blames the wrong service</h2>
      <p>
        A simulated schema migration takes an <code>ACCESS EXCLUSIVE</code> lock on NovaCart’s inventory table. API reads queue
        behind the lock and then fail. I deliberately configured no database-latency alert, so the only alert is a 5xx rate on{" "}
        <code>novacart-api</code>. Restarting the API — the obvious response — would not release the lock.
      </p>
      <p>
        AegisCausal is a deterministic step that runs between the evidence agents and the root-cause debate. It reasons over two
        things the application registered or the telemetry recorded:
      </p>
      <ul>
        <li><strong>The dependency graph</strong> — which component calls which.</li>
        <li><strong>Onset order</strong> — when each component’s signals first became anomalous in the current episode.</li>
      </ul>
      <p>
        A candidate is <em>contradicted</em> if an anomalous dependency sits upstream of it that could explain its symptoms, and{" "}
        <em>consistent</em> if it explains the downstream failures and its onset came first. On the live AWS run, the API was
        contradicted, the database was consistent, and the incident was flagged as an alert misattribution. The approved fix,{" "}
        <code>cancel_blocking_query</code>, ended the blocking session; recovery was attributed in 52.2 seconds.
      </p>

      <h2>Mistake one: trusting the caller’s stopwatch</h2>
      <p>
        In scenario D, a CPU-saturated API was diagnosed as <em>slow recommendations</em>. The recommendations service was fine.
        The API, starved of CPU, was measuring its own calls to it — and a starved caller inflates every client-side timer it
        owns. The dependency looked slow because the thing holding the stopwatch was slow.
      </p>
      <p>
        The fix was to make the dependency report its own server-side duration, and to generalise the causal rule: if a
        dependency is anomalous only by a client-side signal while its own server-side timing is normal, it doesn’t count as an
        explanation. That rule now applies to any dependency, not just databases, and a test pins it: a CPU-starved caller
        cannot frame a healthy HTTP dependency, while a genuinely slow one is still confirmed.
      </p>

      <h2>Mistake two: yesterday’s incident as today’s onset</h2>
      <p>
        In scenarios E and F on AWS, the causal top candidate was the database — wrong both times. The timeline function used the{" "}
        <em>first</em> breach in a 15-minute window, so a previous scenario’s already-resolved database breach posed as the
        current onset. Onsets are now episode-aware: only an ongoing episode counts, and earlier ones are reported separately as{" "}
        <code>earlier_episodes</code>.
      </p>
      <Callout title="What I took from it">
        Both bugs were invisible in fixtures and obvious in a live environment with real timing and leftover state. Causal
        reasoning is only as good as the measurements under it — <strong>who measured a signal, and in which episode</strong>,
        matters as much as its value.
      </Callout>

      <h2>What AegisCausal is not</h2>
      <p>
        It is a consistency test over an assumed graph, not a proof of causation. A wrong dependency graph or an unmonitored
        confounder would mislead it. When two explanations stay tied it doesn’t guess — it triggers{" "}
        <Link href="/projects/aegisops#acquisition">active evidence acquisition</Link> to gather the one observation that
        separates them.
      </p>
    </>
  );
}
