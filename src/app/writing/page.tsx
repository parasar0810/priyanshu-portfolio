import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, Container, PageHeader } from "@/components/ui";
import { formatDate, posts } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Engineering notes on benchmarks, safety bugs and distributed-systems correctness.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Engineering notes"
        lede="Lessons from my projects — mostly about things that broke, or results that didn’t go the way I expected."
      />
      <Container className="py-12 sm:py-14">
        <ul className="divide-y divide-line border-y border-line">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/writing/${p.slug}`} className="group grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <p className="font-mono text-xs leading-6 text-muted">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </p>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-ink group-hover:text-accent-ink">{p.title}</h2>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{p.description}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-ink-2">
                    {p.project} · {p.readingTime} <ArrowIcon className="group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
