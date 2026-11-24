import type { Metadata } from "next";
import { CaseStudyBody, CaseStudyHeader, Measure, NoteGrid, SimpleTable, Wide } from "@/components/case-study";
import { ContactBand } from "@/components/contact-band";
import { MeetingThumb } from "@/components/diagrams";
import { Callout } from "@/components/ui";
import { getProject } from "@/content/projects";

const project = getProject("live-meeting-copilot")!;

export const metadata: Metadata = {
  title: "Live Meeting Copilot — real-time multi-agent backend",
  description:
    "A FastAPI WebSocket backend running four concurrent LangGraph agents over a streaming meeting transcript: regex supervisor, drop-oldest backpressure, per-client fan-out and late-joiner replay.",
  alternates: { canonical: "/projects/live-meeting-copilot" },
  openGraph: { url: "/projects/live-meeting-copilot", type: "article", images: ["/opengraph-image"] },
};

const toc = [
  { id: "problem", label: "Problem" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Design decisions" },
  { id: "agents", label: "The four agents" },
  { id: "testing", label: "Testing" },
  { id: "limits", label: "Limits" },
];

const code = (s: string) => <code>{s}</code>;

export default function LiveMeetingPage() {
  return (
    <>
      <CaseStudyHeader project={project} />
      <CaseStudyBody toc={toc}>
        <Measure>
          <h2 id="problem" className="!mt-0">Problem</h2>
          <p>{project.problem}</p>
          <p>
            The backend ingests a live transcript over WebSocket, decides which specialised agents a new chunk needs, runs them
            concurrently against the growing transcript, and broadcasts each agent’s output to every connected browser — while
            staying responsive when chunks arrive faster than the agents finish.
          </p>

          <h2 id="architecture">Architecture</h2>
        </Measure>
        <Wide>
          <figure className="overflow-hidden rounded-lg border border-line">
            <MeetingThumb />
            <figcaption className="border-t border-line bg-surface px-4 py-2.5 text-sm text-muted">
              Architecture diagram. A simulator stands in for live speech-to-text during development.
            </figcaption>
          </figure>
        </Wide>
        <SimpleTable
          caption="Request path"
          head={["Stage", "Component", "Detail"]}
          rows={[
            ["Ingest", code("/ws/{session_id}/ingest"), "Transcript chunks arrive with a chunk_id; duplicates are discarded, gaps accepted with a warning."],
            ["Route", "Supervisor", "Compiled regex patterns decide which agents a chunk triggers — no LLM call."],
            ["Execute", "Per-session asyncio worker", "Triggered agents run concurrently with asyncio.gather from a bounded work queue."],
            ["Retrieve", "ChromaDB", "The fact-check and context agents retrieve from a local knowledge base and cite sources."],
            ["Fan out", code("/ws/{session_id}/client"), "Each client has its own bounded asyncio.Queue; a session registry broadcasts to all of them."],
          ]}
        />

        <Measure>
          <h2 id="decisions">Design decisions</h2>
          <p>The repository’s design document defends each of these against the obvious alternative:</p>
        </Measure>
        <NoteGrid
          items={[
            {
              tag: "Latency & cost",
              title: "Regex supervisor instead of an LLM router",
              body: <>An LLM router would add a 300–800 ms call before any useful work, and a fifth LLM call for every chunk whether or not an agent runs. Regex is evaluated per chunk at negligible cost. The trade-off — missed passive-voice commitments or rhetorical claims — is documented and accepted: the copilot tunes for precision over recall.</>,
            },
            {
              tag: "Backpressure",
              title: "Drop the oldest work, never block ingestion",
              body: <>The per-session work queue holds 50 items; when full, the oldest trigger is evicted. Blocking the ingest socket would stall transcription upstream, and the newest chunk is the most actionable one to keep.</>,
            },
            {
              tag: "Isolation",
              title: "One queue per client",
              body: <>A single shared queue lets one slow browser stall everyone. Per-client queues (max 100) let a background tab overflow and drop silently while others stay live.</>,
            },
            {
              tag: "Fan-out",
              title: "In-process queues, not Redis pub/sub — for now",
              body: <>With one Uvicorn worker, in-process queues avoid serialisation and a network hop. The document states exactly how this breaks with multiple workers and the migration path to Redis pub/sub.</>,
            },
            {
              tag: "UX correctness",
              title: "Late joiners get full history",
              body: <>A client joining mid-meeting first receives a snapshot of the transcript and all prior agent outputs, then queued live updates in order — otherwise action items would appear without the lines that produced them.</>,
            },
            {
              tag: "Truthfulness",
              title: "UNVERIFIABLE instead of silence",
              body: <>When the knowledge base has nothing relevant, the fact-check agent returns an explicit <code>UNVERIFIABLE</code> verdict rather than an empty result that looks like agreement.</>,
            },
          ]}
        />

        <Measure>
          <h2 id="agents">The four agents</h2>
        </Measure>
        <SimpleTable
          caption="Agents and triggers"
          head={["Agent", "Triggered by", "Output"]}
          rows={[
            ["Fact-check", "Numeric claims, superlatives, compliance terms", "Verdict with a cited knowledge-base source, or UNVERIFIABLE"],
            ["Action items", "Commitment verbs, assignments, deadlines", "Assignee and deadline extracted from the commitment"],
            ["Context / RAG", "Ambiguous references, “as discussed”", "Resolves the reference from the last few chunks and retrieved documents"],
            ["Rolling summary", "Every 5 chunks or 30 seconds", "Incremental summary, not just a final one"],
          ]}
        />

        <Measure>
          <h2 id="testing">Testing</h2>
          <p>Nine integration test cases run against a live server over real WebSockets:</p>
          <ul>
            <li><strong>Concurrency</strong> — late joiner catch-up, rapid-fire chunks, and no leakage between sessions.</li>
            <li><strong>Correctness</strong> — expected agent outputs for a known transcript.</li>
            <li><strong>Failure</strong> — malformed input and LLM failure handling.</li>
            <li><strong>Load</strong> — 200 chunks flooded at once to exercise backpressure, and concurrent sessions.</li>
            <li><strong>Security</strong> — a prompt-injection chunk (“ignore all previous instructions…”) must not take over agent output.</li>
          </ul>
          <Callout title="What I can and can’t claim">
            The repository contains the test suites but no recorded run results, and running them needs an OpenAI API key. I list
            what is tested, not pass rates.
          </Callout>

          <h2 id="limits">Limits</h2>
          <ul>
            <li>Single-process by design; multiple workers need the documented Redis pub/sub change.</li>
            <li>Regex triggering misses some phrasings (questions, passive voice, implicit subjects).</li>
            <li>Out-of-order chunks are guarded, not reordered — acceptable for a reliable local feed, not for lossy production audio.</li>
            <li>No deployed demo; the repository includes a demo video in its README.</li>
          </ul>
        </Measure>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
