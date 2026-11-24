import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="font-mono text-sm text-accent-ink">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">This page doesn’t exist</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The link may be out of date. Everything on the site is reachable from the home page.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          See projects
        </ButtonLink>
      </div>
    </Container>
  );
}
