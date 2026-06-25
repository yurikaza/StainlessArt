import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';

export const metadata = { title: 'Blog — Stainless Art' };

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-3">Blog</p>
      <h1 className="display-type text-5xl text-[var(--paper)] mb-16">Fikir, Üretim,<br />İlham.</h1>

      {posts.length === 0 ? (
        <p className="body-intimate text-[var(--steel-silver)] text-center py-24">
          Yakında içerik yayınlanacak.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {posts.map((post, i) => {
            const isFeature = i === 0;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group block bg-[var(--navy)] border border-[var(--steel-silver)]/10 hover:border-[var(--steel-silver)]/30 transition-colors overflow-hidden ${
                  isFeature ? 'md:col-span-8' : 'md:col-span-4'
                }`}
              >
                {post.coverImage && (
                  <div className={`relative overflow-hidden ${isFeature ? 'h-72' : 'h-48'}`}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                      sizes={isFeature ? '66vw' : '33vw'}
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="mono text-[10px] uppercase tracking-widest text-[var(--accent-orange)] border border-[var(--accent-orange)]/30 px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className={`font-bold tracking-tight text-[var(--paper)] mb-2 ${isFeature ? 'text-2xl' : 'text-lg'}`}>
                    {post.title}
                  </h2>
                  <p className="body-intimate text-[var(--steel-silver)] text-sm line-clamp-2">{post.excerpt}</p>
                  <p className="mono text-[var(--steel-silver)]/50 text-xs mt-4">
                    {new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
