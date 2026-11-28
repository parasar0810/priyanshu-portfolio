import type { Metadata } from "next";
import { CaseStudyBody, CaseStudyHeader, Measure, NoteGrid, SimpleTable } from "@/components/case-study";
import { ContactBand } from "@/components/contact-band";
import { Screenshot } from "@/components/figure";
import { Callout } from "@/components/ui";
import { getProject } from "@/content/projects";
import bench from "@/content/ownai-benchmarks.json";

const project = getProject("own-ai")!;

export const metadata: Metadata = {
  title: "OWN-AI — a vector database from first principles",
  description:
    "Brute-force, KD-tree and HNSW k-NN written from scratch in Python and NumPy, with three distance metrics, a reproducible recall/latency benchmark and a citation-checked RAG pipeline on local Ollama models.",
  alternates: { canonical: "/projects/own-ai" },
  openGraph: { url: "/projects/own-ai", type: "article", images: ["/opengraph-image"] },
};

const toc = [
  { id: "why", label: "Why build it" },
  { id: "indexes", label: "Three indexes" },
  { id: "bug", label: "The HNSW bug" },
  { id: "benchmarks", label: "Benchmarks" },
  { id: "rag", label: "RAG pipeline" },
  { id: "engineering", label: "Engineering notes" },
  { id: "limits", label: "Honest limits" },
];

const code = (s: string) => <code>{s}</code>;
const ms = (v: number) => (v < 1 ? v.toFixed(3) : v < 10 ? v.toFixed(2) : v.toFixed(1));
const secs = (v: number) => (v < 0.001 ? "< 1 ms" : v < 1 ? `${(v * 1000).toFixed(0)} ms` : `${v.toFixed(1)} s`);

type IndexResult = { build_s: number; query_ms_median: number; recall_at_k: number };

export default function OwnAiPage() {
  const rows = bench.runs.flatMap((run) =>
    (["bruteforce", "kdtree", "hnsw"] as const).map((name) => {
      const r = (run.indexes as Record<string, IndexResult>)[name];
      return [
        `${run.n.toLocaleString("en-IN")} × ${run.dims}`,
        { bruteforce: "Brute force", kdtree: "KD-tree", hnsw: "HNSW" }[name],
        secs(r.build_s),
        `${ms(r.query_ms_median)} ms`,
        r.recall_at_k.toFixed(3),
      ];
    }),
  );

  return (
    <>
      <CaseStudyHeader project={project}>
        <div className="mt-8">
          <Screenshot
            src="/images/ownai/explorer.png"
            alt="OWN-AI index explorer: the HNSW graph's real layer-0 links drawn over a PCA projection, and the KD-tree's real split values."
            width={1440}
            height={1169}
            label="OWN-AI · index explorer"
            sizes="(min-width: 1200px) 1136px, 100vw"
            caption="The index explorer draws the server’s live data structures: actual HNSW neighbour links per layer and actual KD-tree splits."
          />
        </div>
      </CaseStudyHeader>
      <CaseStudyBody toc={toc}>
        <Measure>
          <h2 id="why" className="!mt-0">Why build it</h2>
          <p>
            Vector databases are usually used as black boxes. OWN-AI implements the retrieval layer directly — no FAISS, no
            hnswlib — so the trade-offs between index structures can be seen and measured instead of taken on trust.
          </p>
        </Measure>

        <Measure><h2 id="indexes">Three indexes behind one interface</h2></Measure>
        <NoteGrid
          cols={3}
          items={[
            { tag: "Exact", title: "Brute force", body: <>One vectorised NumPy distance call over every vector, then {code("argpartition")} for the top k. O(N·d), but very fast at small N.</> },
            { tag: "Exact", title: "KD-tree", body: <>Median split on the widest dimension, leaves of 16, branch-and-bound pruning. Cosine runs on L2-normalised vectors, because the plane bound doesn’t hold for cosine directly.</> },
            { tag: "Approximate", title: "HNSW", body: <>Layered proximity graph: M = 16 (32 on layer 0), ef_construction = 200, ef = 50, one graph per distance metric, built with the paper’s neighbour-selection heuristic.</> },
          ]}
        />

        <Measure>
          <h2 id="bug">The HNSW bug a reachability test uncovered</h2>
          <p>
            The first HNSW version connected each new node to its M closest candidates. Writing a test that measured
            layer-0 reachability on clustered data showed why recall was stuck: only <strong>73 of 600</strong> nodes could be
            reached from the entry point, and recall@10 stayed at <strong>0.93</strong> whatever {code("ef")} was set to. Every
            link pointed inside its own cluster, so the graph split into islands.
          </p>
          <p>
            Implementing the neighbour-selection heuristic from Malkov &amp; Yashunin (keep a candidate only if it is closer to
            the new node than to any neighbour already kept) preserves the long links between clusters. On the same data:{" "}
            <strong>600/600</strong> reachable, recall@10 <strong>1.00</strong>. The simple rule is still available as{" "}
            {code("heuristic=False")} and a regression test checks both.
          </p>
        </Measure>

        <Measure>
          <h2 id="benchmarks">Benchmarks</h2>
          <p>{bench.method}</p>
        </Measure>
        <SimpleTable
          caption={`Seed ${bench.config.seed}, ${bench.config.metric} distance, k = ${bench.config.k}, ef = ${bench.config.ef_search}`}
          head={["N × dims", "Index", "Build", "Median query", "Recall@10"]}
          rows={rows}
        />
        <Measure>
          <p className="text-sm text-muted">
            Python {bench.hardware.python}, NumPy {bench.hardware.numpy}, a single laptop CPU core. Reproduce with{" "}
            {code("python -m ownai.benchmark")}; raw output is in {code("benchmarks/results.json")}.
          </p>
          <p>
            <strong>What the numbers say.</strong> At 1,000 vectors, vectorised brute force wins: one NumPy call beats any
            Python-level graph walk. As N and dimensionality grow, brute force grows with N·d while HNSW stays around a
            millisecond — 14× faster at 2,000 × 768. HNSW pays for that at build time, 25–45 ms per insert in pure Python.
            Recall is 1.000 everywhere because well-separated synthetic clusters are an easy case, not a claim about real
            embeddings. A production system would use FAISS, hnswlib or pgvector; the point here is understanding why.
          </p>

          <h2 id="rag">RAG pipeline</h2>
          <ul>
            <li>250-word chunks with 30-word overlap, embedded locally with Ollama ({code("nomic-embed-text")}).</li>
            <li>Retrieval keeps only passages within a cosine distance of 0.7.</li>
            <li>The prompt requires {code("[n]")} citations; with nothing relevant the system refuses instead of guessing, and uncited answers are flagged.</li>
          </ul>
          <Callout title="Verified with real local models">
            With Ollama on a CPU-only laptop, {code("nomic-embed-text")} produced 768-dimensional embeddings and{" "}
            {code("llama3.2")} (3B) answered with a correct citation in 2–3 s once loaded; an off-topic question was refused.
            Testing with the smaller {code("llama3.2:1b")} exposed a bug — a reply of only citations counted as grounded — now
            fixed. Citation checks confirm which passage is referenced, not that the sentence follows from it.
          </Callout>

          <h2 id="engineering">Engineering notes</h2>
          <p>
            Besides the HNSW fix, testing found and fixed an invalid KD-tree pruning bound for cosine, a single cosine HNSW graph
            reused for every metric, a RAG prompt that allowed “general knowledge” answers, and citation-only replies counted as
            grounded. Inputs are validated with Pydantic and model calls are rate-limited. Each fix is listed with its test in{" "}
            {code("docs/ENGINEERING_NOTES.md")}; the project was built with AI pair-programming assistance.
          </p>
          <p>68 pytest cases pass with a local Ollama (66, with 2 skipped, in CI, which has no model), plus ruff and a benchmark smoke run.</p>

          <h2 id="limits">Honest limits</h2>
          <ul>
            <li>In-memory only: no persistence, no concurrency control beyond a single process.</li>
            <li>HNSW deletes unlink nodes without repairing the graph; many deletes call for a rebuild.</li>
            <li>The 16-dimensional demo collection uses a hand-built keyword encoder for visualisation — it is not semantic.</li>
            <li>Not deployed publicly yet; runs locally or with Docker.</li>
          </ul>
        </Measure>
      </CaseStudyBody>
      <ContactBand />
    </>
  );
}
