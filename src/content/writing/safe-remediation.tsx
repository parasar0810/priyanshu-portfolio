import { Callout } from "@/components/ui";

export default function SafeRemediation() {
  return (
    <>
      <p>
        Letting an AI system diagnose an incident is a research question. Letting it <em>change</em> a production system is a
        safety question, and I treated it as one. The rule I designed AegisOps around is short: the AI ranks and explains,
        deterministic code decides what is allowed to run, and a human approves it.
      </p>

      <h2>Layer 1: the model can’t express a dangerous action</h2>
      <p>
        AegisOps has no shell, no SSH and no generic HTTP client exposed to the agents. An application registers its remediation
        hooks in advance — <code>rollback_feature_flag</code>, <code>reset_db_pool</code>, <code>cancel_blocking_query</code> and
        so on — each with a category it addresses, a risk level and a rollback note. The remediation strategist can only rank
        those hooks. Calls go out with a per-application bearer token and redirects disabled.
      </p>

      <h2>Layer 2: a deterministic policy, not a prompt</h2>
      <p>Before any proposal reaches a human, a policy function checks it:</p>
      <ul>
        <li>the hook is registered for this application;</li>
        <li>it addresses the diagnosed failure category;</li>
        <li>a fault is actually present;</li>
        <li>diagnosis confidence is at least 0.5.</li>
      </ul>
      <p>
        The third check exists because of a real bug. AegisBench found a monitoring false positive where both the analyst and the
        critic recognised the scrape failure as an artefact — but the output schema forced a failure category, and a restart hook
        matched it. Now an explicit <code>fault_present</code> flag skips the strategist entirely and adds a hard policy
        violation.
      </p>

      <h2>Layer 3: a human, with the right information</h2>
      <p>
        The approval card shows the exact hook and target, the justification and cited evidence, blast radius, reversibility, the
        rollback plan and how recovery will be measured. High-risk actions, or cases where the analyst and the independent critic
        disagreed, require a written reason.
      </p>

      <h2>The race condition I found in my own approval flow</h2>
      <p>
        A security pass found that two simultaneous approvals could execute a hook twice. Approval now takes a per-incident lock
        and carries an <code>expected_version</code>: if the incident changed after the human looked at it, the approval is rejected
        as stale. That also covers the subtler case of approving a plan the investigation has since revised.
      </p>

      <h2>Layer 4: don’t believe the fix until you’ve measured it</h2>
      <p>
        After a hook runs, AegisOps waits a deliberate 45-second settle, re-measures the same telemetry, and asks an independent
        verifier to judge before and after. It then records attribution: <code>attributed</code>, <code>not_attributable</code>
        or <code>unknown</code>. If a fault auto-expired and the hook reports it changed nothing, the recovery is not credited to
        the action.
      </p>
      <Callout title="Trade-off">
        Every layer adds latency — the human most of all. That is the point: the system is designed for actions where being
        wrong is expensive. Across the eight live AWS scenarios, approval-to-verified recovery took about 49 seconds, almost
        all of it the intentional settle period.
      </Callout>
    </>
  );
}
