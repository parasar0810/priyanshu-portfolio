import { Callout } from "@/components/ui";

export default function Dedupe() {
  return (
    <>
      <p>
        The premise of my UPI Offline Mesh demo: you’re in a basement with no signal and you send a friend ₹500. Your
        phone encrypts the payment and hands it to nearby phones, which pass it along until one of them walks outside,
        gets 4G and uploads it. The server decrypts, deduplicates and settles.
      </p>
      <p>
        Gossip routing guarantees one awkward property: the same packet will arrive more than once, sometimes
        simultaneously. If three bridge phones reach the server in the same millisecond and each upload is processed,
        the sender is debited ₹1,500.
      </p>

      <h2>What do you deduplicate on?</h2>
      <p>There are three candidate keys, and two of them are wrong:</p>
      <ul>
        <li>
          <strong>The packet ID</strong> sits in the readable outer envelope. An intermediate phone can rewrite it,
          so two copies of one payment could carry different IDs.
        </li>
        <li>
          <strong>The plaintext</strong> requires decryption first — an RSA operation on every duplicate before you
          know it’s a duplicate.
        </li>
        <li>
          <strong>The ciphertext.</strong> It is authenticated by AES-GCM, so any tampering fails on decryption, and
          two honest deliveries of the same payment are byte-identical.
        </li>
      </ul>

      <h2>Claim first, then work — in the same transaction</h2>
      <p>
        So the very first step on the ingest path is <code>SHA-256(ciphertext)</code>, followed by an atomic claim in
        PostgreSQL:
      </p>
      <pre>
        <code>{`INSERT INTO processed_packets (packet_hash, ...)
VALUES ($1, ...)
ON CONFLICT (packet_hash) DO NOTHING
RETURNING packet_hash;   -- a row back = first claimer; none = duplicate`}</code>
      </pre>
      <p>
        Exactly one concurrent caller gets a row back. Only the winner decrypts, verifies the sender’s signature, checks
        freshness and settles; the rest return <code>DUPLICATE_DROPPED</code>.
      </p>
      <p>
        The important detail is <em>where</em> the claim lives. My first version (Java) claimed the hash in an
        in-memory <code>ConcurrentHashMap</code> and settled afterwards. If settlement then failed, the claim stayed
        behind and every retry was dropped as a duplicate — a payment lost for good. Putting the claim in the same
        database transaction as the debit and credit fixes that: a failure rolls back both, and the next delivery
        settles normally.
      </p>

      <h2>Replays are a separate problem</h2>
      <p>
        A captured packet replayed a week later would be a fresh claim once the cache entry expires. Two fields
        inside the encrypted payload handle that: a <code>signedAt</code> timestamp the server rejects after 24
        hours, and a random nonce. Because both are covered by the GCM tag, an attacker can’t refresh them — and the
        nonce means two legitimate ₹100 payments from Alice to Bob still produce different hashes and both settle.
      </p>

      <h2>Testing the property, not the path</h2>
      <p>
        The test I care about fires 20 concurrent deliveries of the same packet at a real PostgreSQL and asserts exactly
        one <code>SETTLED</code>, 19 <code>DUPLICATE_DROPPED</code>, and that the sender’s balance changed by the amount
        exactly once. Others make settlement fail mid-transaction and check the retry succeeds, and flip one byte of
        ciphertext to check the result is <code>INVALID</code>, not a crash or a settlement.
      </p>
      <Callout title="Honest limits">
        This is mesh-routed <em>deferred</em> settlement, not real-time offline payment. The receiver can’t verify
        the sender has funds, and a sender can double-spend across two basements — whichever packet lands first
        wins. Real offline UPI solves that with a pre-funded, hardware-backed wallet. The cryptography and
        idempotency here are real; the Bluetooth mesh is simulated.
      </Callout>
    </>
  );
}
