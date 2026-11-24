import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow } from "@/components/ui";
import { site } from "@/content/site";
import { formatDate, getPost, posts } from "@/content/writing";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/writing/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [site.name],
      images: ["/opengraph-image"],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { Body } = post;
  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <header className="border-b border-line pb-12 pt-10 sm:pt-14">
        <Container>
          <div className="mx-auto max-w-[44rem]">
            <Link href="/writing" className="text-sm text-muted hover:text-ink">
              ← All writing
            </Link>
            <Eyebrow className="mb-4 mt-8">{post.project}</Eyebrow>
            <h1 className="text-3xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[2.6rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{post.description}</p>
            <p className="mt-6 font-mono text-xs text-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} read
            </p>
          </div>
        </Container>
      </header>
      <Container className="py-12 sm:py-14">
        <article className="prose-editorial mx-auto max-w-[44rem]">
          <Body />
        </article>
        <nav aria-label="More writing" className="mx-auto mt-16 max-w-[44rem] border-t border-line pt-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-muted">More writing</p>
          <ul className="space-y-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/writing/${p.slug}`} className="font-medium text-ink hover:text-accent-ink">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}
