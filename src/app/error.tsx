"use client";

import Link from "next/link";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-28 text-center sm:px-8">
      <p className="font-mono text-sm text-accent-ink">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">This page failed to load</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">Try again, or head back to the home page.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2"
        >
          Try again
        </button>
        <Link href="/" className="rounded-lg border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-ink-2">
          Go home
        </Link>
      </div>
    </div>
  );
}
