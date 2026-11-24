import { site } from "@/content/site";
import { Container, DownloadIcon } from "./ui";

export function ContactBand() {
  return (
    <section aria-labelledby="contact-band" className="border-t border-line bg-surface">
      <Container className="grid gap-6 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10">
        <div className="max-w-2xl">
          <h2 id="contact-band" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Hiring for backend, infrastructure or applied-AI engineering?
          </h2>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">
            {site.availability}. Based in {site.location}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2">
            Email me
          </a>
          <a href={site.resumePath} download className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-ink-2">
            Résumé <DownloadIcon />
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-ink-2">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
