import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <nav className="mb-8">
        <a href="/blog" className="mono text-xs text-[var(--steel-silver)] hover:text-[var(--paper)] transition-colors uppercase tracking-widest">
          ← Blog
        </a>
      </nav>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="mono text-[10px] uppercase tracking-widest text-[var(--accent-orange)] border border-[var(--accent-orange)]/30 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="display-type text-4xl md:text-5xl text-[var(--paper)] leading-tight mb-4">
        {post.title}
      </h1>
      <p className="mono text-[var(--steel-silver)] text-xs uppercase tracking-widest mb-8">
        {new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {post.coverImage && (
        <div className="relative aspect-video mb-12 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>
      )}

      {/* MDX content */}
      <div className="prose-stainless">
        <MDXRemote source={post.content} />
      </div>

      <style>{`
        .prose-stainless h2 {
          font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
          font-size: 1.5rem;
          color: var(--paper);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .prose-stainless h3 {
          font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
          color: var(--paper);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-stainless p {
          color: var(--steel-silver);
          line-height: 1.8;
          margin-bottom: 1.25rem;
          font-size: 1rem;
        }
        .prose-stainless strong { color: var(--paper); }
        .prose-stainless a { color: var(--accent-orange); text-decoration: underline; }
        .prose-stainless code {
          background: var(--navy);
          color: var(--accent-orange);
          padding: 0.1em 0.4em;
          font-size: 0.85em;
          font-family: 'Neue Haas Grotesk Display Pro', monospace;
        }
        .prose-stainless blockquote {
          border-left: 2px solid var(--accent-orange);
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--steel-silver);
        }
        .prose-stainless hr {
          border: none;
          border-top: 1px solid var(--steel-silver);
          opacity: 0.2;
          margin: 2.5rem 0;
        }
      `}</style>
    </article>
  );
}
