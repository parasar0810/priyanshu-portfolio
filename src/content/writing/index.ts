import type { ComponentType } from "react";
import NegativeResult from "./negative-result";
import NoFault from "./no-fault";
import Dedupe from "./dedupe";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  project: string;
  Body: ComponentType;
};

export const posts: Post[] = [
  {
    slug: "multi-agent-negative-result",
    title: "My multi-agent system wasn’t more accurate. Here’s what I kept anyway.",
    description:
      "AegisBench compared nine cooperating agents against one LLM call on identical evidence. Both scored 93%. What that result does and doesn’t say, and why I published it.",
    date: "2026-11-22",
    readingTime: "6 min",
    project: "AegisOps",
    Body: NegativeResult,
  },
  {
    slug: "schema-could-not-say-no-fault",
    title: "Every layer worked. The schema was the bug.",
    description:
      "A monitoring false positive led AegisOps to recommend restarting a healthy service. Each component behaved as designed — the output schema simply had no way to say “nothing is wrong”.",
    date: "2026-11-21",
    readingTime: "4 min",
    project: "AegisOps",
    Body: NoFault,
  },
  {
    slug: "deduplicate-before-you-decrypt",
    title: "Deduplicate before you decrypt",
    description:
      "In an offline payment mesh, the same packet can reach the server through three phones at once. Hashing the ciphertext — not the packet ID or the plaintext — makes settlement exactly-once.",
    date: "2026-09-30",
    readingTime: "4 min",
    project: "UPI Offline Mesh",
    Body: Dedupe,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
