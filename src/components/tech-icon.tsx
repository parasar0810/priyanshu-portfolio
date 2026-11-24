import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

const lookup = icons as unknown as Record<string, SimpleIcon | undefined>;

/** Monochrome technology logo (simple-icons, CC0). Renders nothing for unknown slugs. */
export function TechIcon({ slug, className = "h-4 w-4" }: { slug?: string; className?: string }) {
  if (!slug) return null;
  const icon = lookup[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}
