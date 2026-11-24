import { Callout } from "@/components/ui";

export default function NoFault() {
  return (
    <>
      <p>
        One of the AegisBench scenarios is a false positive: Prometheus fails to scrape a target, an alert fires, and
        nothing is actually wrong with the service. The correct response is to do nothing. AegisOps recommended{" "}
        <code>restart_service</code>.
      </p>

      <h2>Reading the transcript</h2>
      <p>
        The surprising part was that the agents had noticed. Both the root-cause analyst and the independent critic
        recognised the scrape failure as a monitoring artefact. Then the output schema asked them to pick a failure
        category — and there was no category for “none”. They picked <code>service_unavailable</code>, the closest
        fit.
      </p>
      <p>
        From there every layer did exactly what it was designed to do. The remediation strategist found a registered
        hook declaring that it addresses <code>service_unavailable</code>. The deterministic policy engine checked
        that the hook was registered and matched the diagnosed category, and allowed it.
      </p>
      <Callout title="The lesson">
        A typed schema is a set of things the system is able to say. If “there is no problem” isn’t one of them,
        the model will translate its correct observation into the nearest wrong answer — and every safety check
        downstream will faithfully validate the wrong answer.
      </Callout>

      <h2>The fix</h2>
      <p>
        I added an explicit <code>fault_present</code> field to the RCA report, the adjudication and the root-cause
        analysis, and made it change control flow, not just output:
      </p>
      <ol>
        <li>When the adjudicator decides there is no fault, the RCA is marked <code>insufficient_evidence</code>.</li>
        <li>The remediation strategist is skipped entirely.</li>
        <li>The policy engine adds a hard violation: no actionable fault, so no remediation is permitted.</li>
        <li>The incident asks a human to verify and close it.</li>
      </ol>
      <p>
        A regression test, <code>test_adjudicated_no_fault_blocks_all_remediation</code>, pins the behaviour. In
        the post-fix run the unsafe-recommendation rate went from 7% to 0%.
      </p>

      <h2>Being honest about the post-fix number</h2>
      <p>
        That run used the same scenarios that informed the fix, so it shows the fix works on the case it was
        designed for — not that it generalises. Accuracy in that run also dropped to 80%, partly because two
        investigations hit twenty consecutive provider errors and correctly returned no root cause rather than
        inventing one. I report both, because a safety improvement measured on its own training case is a
        regression test, not evidence.
      </p>
    </>
  );
}
