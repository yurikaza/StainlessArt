'use client';

import { useEffect, useRef } from 'react';

const chapters = [
  {
    year: '2008',
    heading: 'Çeliğin Gücünü Keşfettik.',
    body: 'Stainless Art, Türkiye\'nin endüstriyel kalbinde, bir garajda başladı. İlk ürünümüz yalnızca 3 mm çaplı bir tel halatıydı. Ama o halat, bir neslin emeğini taşıyordu.',
  },
  {
    year: '2014',
    heading: 'Tasarım, Güce Katıldı.',
    body: 'Endüstriyel estetiği minimalist formla birleştiren koleksiyonumuzu dünyayla paylaştık. Metal, artık yalnızca bir hammadde değil — bir ifade biçimiydi.',
  },
  {
    year: '2019',
    heading: 'Sınırları Aştık.',
    body: '23 ülkeye ihracat. 0,01 mm toleransa inecek hassasiyette üretim kapasitesi. Ve hâlâ aynı garajın ruhu.',
  },
  {
    year: '2025',
    heading: 'Metalin Geleceği Burada.',
    body: 'Sürdürülebilir çelik üretimi, dijital envanter ve size özel fiyatlandırma. Stainless Art\'ın hikâyesi bitmiyor — sizinle birlikte yazılıyor.',
  },
];

export default function AboutPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Fallback: simple IntersectionObserver opacity reveal
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).style.opacity = '1'; }),
        { threshold: 0.2 }
      );
      sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
      return () => observer.disconnect();
    }

    // GSAP ScrollTrigger — loaded dynamically to keep SSR clean
    let cleanup: (() => void) | undefined;
    import('gsap').then(({ gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        sectionRefs.current.forEach((el) => {
          if (!el) return;
          const heading = el.querySelector('.chapter-heading');
          const body = el.querySelector('.chapter-body');
          const year = el.querySelector('.chapter-year');

          gsap.fromTo(
            [year, heading, body],
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.15,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: { trigger: el, start: 'top 70%' },
            }
          );
        });

        cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
      })
    );

    return () => cleanup?.();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end px-8 pb-16 bg-[var(--navy)]">
        {/* Blueprint grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(var(--steel-silver) 1px, transparent 1px),
              linear-gradient(90deg, var(--steel-silver) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Freeform: hand-drawn SVG underline */}
        <div className="relative z-10 max-w-4xl">
          <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-4">Hakkımızda</p>
          <h1 className="display-type text-5xl md:text-7xl text-[var(--paper)] leading-none mb-6">
            Metal, Sadece<br />
            <span className="relative inline-block">
              Bir Araç Değil.
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full motion-reduce:hidden"
                height="8"
                viewBox="0 0 300 8"
                fill="none"
              >
                <path d="M2 6 C50 2, 150 7, 298 3" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round"
                  style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'drawLine 1.5s 0.5s ease forwards' }} />
              </svg>
            </span>
          </h1>
          <p className="body-intimate text-[var(--steel-silver)] text-lg max-w-xl">
            2008'den bu yana endüstriyel malzemeleri sanat formuna dönüştürüyoruz.
          </p>
        </div>
      </section>

      {/* Chapters — scrollytelling */}
      <section className="max-w-5xl mx-auto px-8 py-24 space-y-40">
        {chapters.map((chapter, i) => (
          <article
            key={chapter.year}
            ref={(el) => { sectionRefs.current[i] = el; }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start opacity-100 md:opacity-0"
            style={{ opacity: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : undefined }}
          >
            <div className={`md:col-span-3 ${i % 2 === 1 ? 'md:col-start-10 md:row-start-1' : ''}`}>
              <span className="chapter-year display-type text-[var(--accent-orange)] text-6xl opacity-40">{chapter.year}</span>
            </div>
            <div className={`md:col-span-7 ${i % 2 === 1 ? 'md:col-start-2 md:row-start-1' : 'md:col-start-4'}`}>
              {/* Collage: blueprint-style offset box */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -left-4 -top-4 w-full h-full border border-[var(--steel-silver)]/10 motion-reduce:hidden"
                />
                <h2 className="chapter-heading display-type text-3xl md:text-4xl text-[var(--paper)] mb-4 leading-tight">
                  {chapter.heading}
                </h2>
                <p className="chapter-body body-intimate text-[var(--steel-silver)] text-lg leading-relaxed">
                  {chapter.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .chapter-heading, .chapter-body, .chapter-year { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
