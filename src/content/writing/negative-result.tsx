import Link from "next/link";
import { Callout } from "@/components/ui";

export default function NegativeResult() {
  return (
    <>
      <p>
        AegisOps investigates production incidents with a team of LLM agents: an incident commander, two evidence
        analysts, a root-cause analyst and an independent critic who argue in parallel, an adjudicator, a
        remediation strategist, a recovery verifier and a postmortem writer. It is the most complex thing I have
        built, and the obvious question about it is the uncomfortable one: <strong>is all that machinery more
        accurate than asking one model once?</strong>
      </p>
      <p>I built AegisBench to answer that, and the answer was no.</p>

      <h2>The setup</h2>
      <p>Four approaches, each given exactly the same evidence:</p>
      <ul>
        <li>
          <strong>Deterministic rules</strong> — signal thresholds mapped to a category and the first matching fix.
        </li>
        <li>
          <strong>Causal-rule ablation</strong> — the same rules plus AegisCausal, the deterministic consistency test.
        </li>
        <li>
          <strong>A single LLM call</strong> that sees the full evidence bundle and returns a root cause, a fix and
          whether to abstain.
        </li>
        <li>
          <strong>The full multi-agent pipeline.</strong>
        </li>
      </ul>
      <p>
        Fairness was the part I spent the most time on. Every approach receives evidence from the same tool calls,
        and each result row stores a digest of that bundle so I could check they were identical. Ground truth lives
        apart from telemetry, and a canary string in it is asserted never to appear in any prompt. Baselines were
        frozen before any LLM run. Nothing was executed — the benchmark scores recommendations only.
      </p>

      <h2>The result</h2>
      <p>
        On 15 scenarios × 2 repeats, the multi-agent pipeline, the single LLM call and the causal-rule ablation all
        scored <strong>93% top-1 accuracy</strong>, with the same 95% interval of 79–98%. The paired sign test
        between multi-agent and single-agent was <code>p = 1.0</code>: two scenarios only one of them got right,
        and two the other got right. Meanwhile multi-agent made about 6× the LLM calls and took about 8× as long
        (44.7 s median against 5.7 s).
      </p>
      <Callout title="What the numbers can’t show" tone="warn">
        With 30 pairs and at most 10 discordant ones, this benchmark could only ever detect a very large effect.
        Ten of the fifteen scenarios were solved by every approach, I wrote the synthetic scenarios myself, and
        only one model family was tested. “No measured difference” is the honest reading — not “multi-agent is
        useless”.
      </Callout>

      <h2>Why I published it</h2>
      <p>
        It would have been easy to lead with the hard-scenario run, where the LLM approaches beat the rule baselines
        with p-values under 0.05. But I chose those seven scenarios, three of which I wrote during the same sprint.
        That result says LLMs handle my hard cases better than my rules. It doesn’t say anything general, and
        presenting it as the headline would have been the kind of claim I’d distrust in someone else’s README.
      </p>

      <h2>What the architecture is actually for</h2>
      <p>
        The benchmark moved my thinking about where the value is. Not in diagnosis — in <strong>governance</strong>.
        The structure that didn’t buy accuracy does buy things a single call can’t give you:
      </p>
      <ul>
        <li>an independent critic whose disagreement with the analyst is a measured uncertainty signal;</li>
        <li>evidence IDs on every claim, so you can check where a conclusion came from;</li>
        <li>a deterministic policy gate and a human approval between the model and anything that changes state;</li>
        <li>a replayable, hash-chained record of what each agent knew and when.</li>
      </ul>
      <p>
        It also surfaced a real safety bug that I would not have found otherwise —{" "}
        <Link href="/writing/schema-could-not-say-no-fault">a schema that couldn’t say “no fault”</Link>.
      </p>

      <h2>What would change the conclusion</h2>
      <p>
        A held-out scenario set written by someone else, more hard multi-fault and partial-evidence cases, at least
        five repeats, and a second model family. Until then, the defensible sentence is the one now in the
        project’s README: AegisOps’s value lies in governance, provenance, replayability and safer remediation
        control — not in better diagnosis.
      </p>
    </>
  );
}
