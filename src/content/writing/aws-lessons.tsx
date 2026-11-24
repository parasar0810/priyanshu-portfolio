import { Callout } from "@/components/ui";

export default function AwsLessons() {
  return (
    <>
      <p>
        AegisOps and its demo store, NovaCart, run as eleven containers on a single EC2 instance: an nginx edge, AegisOps,
        Prometheus, Alertmanager, NovaCart’s web, API, recommendations, Chaos Lab control service, PostgreSQL and a synthetic
        traffic generator, plus certbot. Getting that onto AWS taught me more than the local Docker runs did. These are the
        lessons, with the specific bug behind each one.
      </p>

      <h2>1. Size the instance from measurements, then read the account’s rules</h2>
      <p>
        I measured the working set at roughly 1.2–1.6 GB, plus an on-instance image build, so a 2 GiB instance was too tight. The
        obvious 4 GiB choice, t4g.medium, was refused at launch: the account’s Free plan restricts instance types. The smallest
        eligible 4 GiB type was c7i-flex.large (x86), which also meant building for a different architecture than the original
        ARM deployment.
      </p>

      <h2>2. No SSH at all</h2>
      <p>
        The security group opens only ports 80 and 443. Administration goes through AWS Systems Manager Run Command from a small
        Python wrapper, secrets live in SSM Parameter Store as SecureStrings, and IMDSv2 is required. Removing SSH removed a whole
        category of key management, and every remote command is logged by AWS rather than lost in a terminal.
      </p>

      <h2>3. HTTPS without buying a domain</h2>
      <p>
        Hostnames come from sslip.io, which resolves names containing the Elastic IP back to it, so Let’s Encrypt’s HTTP-01
        challenge works with no domain purchase. nginx routes by host to AegisOps or NovaCart. A browser check on the live site
        found an HTTP→HTTPS redirect pointing at the wrong target; it was a one-line nginx fix, but only a real browser on the real
        host caught it.
      </p>

      <h2>4. Keep internal endpoints internal by construction</h2>
      <p>
        NovaCart’s <code>/health</code> and <code>/internal/*</code> routes sit outside <code>/api</code>, so the public web tier
        never proxies them — a request for <code>/internal/faults</code> on the public host just returns the storefront. AegisOps
        reaches them over the private Docker network, and PostgreSQL is on a network of its own with no exposed port.
      </p>

      <h2>5. Hard container limits are a safety feature</h2>
      <p>
        The Chaos Lab injects CPU and memory faults on purpose. The API container is capped at 1 CPU and 512 MB, so the CPU fault
        can never take the host down and the memory fault stops at 90% of the API’s limit. The limits are what make it safe to run
        destructive experiments on the same machine as the system observing them.
      </p>

      <h2>6. Live environments find bugs fixtures don’t</h2>
      <p>The first AWS run produced six bugs that never appeared locally:</p>
      <ul>
        <li>a recovery crash comparing <code>None &gt; float</code> when a bypassed dependency had no samples;</li>
        <li>a CPU-starved API making a healthy dependency look slow;</li>
        <li>a resolved breach from an earlier scenario mistaken for the current onset;</li>
        <li>a lock-fault hook that found blockers through a transient view and reported “not attributable”;</li>
        <li>a CPU fault too gentle to trigger its alert;</li>
        <li>a restart hook that didn’t report that it had changed anything.</li>
      </ul>
      <p>
        Each was fixed with a regression test, and the affected scenarios were re-run. The failed first attempts remain in the
        incident history rather than being deleted.
      </p>

      <Callout title="Cost and persistence">
        The instance draws about $2.25 a day from free-plan credits. Named Docker volumes kept incidents, the database and
        certificates intact across three redeploys, and provisioning records every resource it creates so a single teardown
        script removes exactly those — and nothing from the original deployment.
      </Callout>
    </>
  );
}
