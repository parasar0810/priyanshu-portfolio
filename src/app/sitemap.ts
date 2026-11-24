import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { posts } from "@/content/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/experience", "/writing", "/about", "/resume", "/contact"];
  return [
    ...staticRoutes.map((r) => ({ url: `${site.url}${r}`, priority: r === "" ? 1 : 0.7 })),
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, priority: p.flagship ? 0.9 : 0.6 })),
    ...posts.map((p) => ({ url: `${site.url}/writing/${p.slug}`, lastModified: p.date, priority: 0.5 })),
  ];
}
