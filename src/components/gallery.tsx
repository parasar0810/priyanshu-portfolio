"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Shot = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  /** CSS object-position used for the thumbnail crop, e.g. "top left". */
  focus?: string;
};

/**
 * Screenshot gallery with an accessible lightbox:
 * native <dialog> (focus trap + Esc), arrow-key navigation, focus returns to the opener.
 */
export function Gallery({ shots, columns = 3 }: { shots: Shot[]; columns?: 2 | 3 }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    openerRef.current = el;
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setIndex(null);
      openerRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dlg.addEventListener("close", onClose);
    dlg.addEventListener("keydown", onKey);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const cur = index === null ? null : shots[index];

  return (
    <>
      <ul className={`grid gap-x-5 gap-y-7 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
        {shots.map((s, i) => (
          <li key={s.src}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group block w-full text-left"
            >
              <span className="block overflow-hidden rounded-md border border-line bg-subtle shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ objectPosition: s.focus ?? "72% 0%" }}
                />
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ink group-hover:text-accent-ink"><span className="sr-only">Enlarge screenshot: </span>{s.title}</span>
                <span className="font-mono text-[0.68rem] text-muted">
                  {String(i + 1).padStart(2, "0")}/{String(shots.length).padStart(2, "0")}
                </span>
              </span>
              <span className="mt-1 block text-[0.84rem] leading-snug text-muted">{s.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={cur ? `Screenshot: ${cur.title}` : "Screenshot viewer"}
        className="m-auto max-h-[94vh] w-[min(1400px,96vw)] max-w-none rounded-lg border border-line bg-surface p-0 shadow-lift backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {cur && (
          <div className="flex max-h-[94vh] flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{cur.title}</p>
                <p className="truncate text-xs text-muted">{cur.caption}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => step(-1)} className="rounded-md px-2.5 py-1.5 text-sm text-ink-2 hover:bg-subtle" aria-label="Previous screenshot">
                  ←
                </button>
                <span className="font-mono text-xs text-muted" aria-live="polite">
                  {(index ?? 0) + 1} / {shots.length}
                </span>
                <button type="button" onClick={() => step(1)} className="rounded-md px-2.5 py-1.5 text-sm text-ink-2 hover:bg-subtle" aria-label="Next screenshot">
                  →
                </button>
                <button type="button" onClick={close} className="ml-2 rounded-md border border-line px-2.5 py-1.5 text-sm text-ink hover:bg-subtle" autoFocus>
                  Close
                </button>
              </div>
            </div>
            <div className="overflow-auto bg-subtle p-2 sm:p-4">
              <Image
                key={cur.src}
                src={cur.src}
                alt={cur.alt}
                width={cur.width}
                height={cur.height}
                sizes="96vw"
                quality={90}
                className="mx-auto h-auto w-full max-w-[1365px] rounded border border-line"
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
