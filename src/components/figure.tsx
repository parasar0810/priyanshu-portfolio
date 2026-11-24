import Image from "next/image";
import { cx } from "./ui";

/**
 * A genuine screenshot in a quiet browser-like frame.
 * Clicking opens the full-resolution capture so details stay legible.
 */
export function Screenshot({
  src,
  alt,
  width,
  height,
  caption,
  label,
  preload,
  className,
  sizes = "(min-width: 1120px) 1056px, 100vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: React.ReactNode;
  label?: string;
  preload?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={cx("not-prose", className)}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-xl border border-line bg-surface shadow-soft transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="flex items-center gap-1.5 border-b border-line bg-subtle px-3 py-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          {label && <span className="ml-2 truncate font-mono text-[0.68rem] text-ink-2">{label}</span>}
        </div>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          preload={preload}
          className="h-auto w-full"
        />
        <span className="sr-only">Open full-size screenshot in a new tab</span>
      </a>
      {caption && <figcaption className="mt-3 text-sm leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  );
}
