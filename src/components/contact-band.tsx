import { site } from "@/content/site";
import { Container } from "./ui";

export function ContactBand() {
  return (
    <section aria-labelledby="contact-band" className="pt-20">
      <Container>
        <div className="rounded-3xl bg-ink px-7 py-12 text-white sm:px-12 sm:py-14">
          <div className="max-w-2xl">
            <h2 id="contact-band" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Looking for a 2027 graduate who measures their own work?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              I’m open to software engineering internships and new-grad roles in backend, infrastructure and applied AI.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-slate-100"
            >
              Email me
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-slate-400"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-slate-400"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
