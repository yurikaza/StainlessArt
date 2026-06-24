'use client';

import dynamic from 'next/dynamic';

const WireRope3D = dynamic(() => import('@/components/WireRope3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white select-none">
      {/* ─── HEADER ─── */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between px-10 pt-8 md:px-16">
        {/* Logo */}
        <div className="text-[#1a1a2e] text-base md:text-lg font-black tracking-[0.18em] uppercase">
          Stainless Art
        </div>

        {/* Navigation — vertical stack, top center-right */}
        <nav className="flex flex-col items-end gap-0.5 text-[#1a1a2e] text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase">
          {['Home', 'About', 'Gallery', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:opacity-50 transition-opacity duration-200 py-0.5"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* STAINLESS — left of rope */}
        <div className="absolute left-8 md:left-16 lg:left-28 top-1/2 -translate-y-1/2 z-10">
          <h1 className="text-[#1a1a2e] text-[clamp(2.5rem,7.5vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.03em]">
            Stainless
          </h1>
        </div>

        {/* ART — right of rope */}
        <div className="absolute right-8 md:right-16 lg:right-28 top-1/2 -translate-y-1/2 z-10">
          <h1 className="text-[#1a1a2e] text-[clamp(2.5rem,7.5vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.03em]">
            Art
          </h1>
        </div>

        {/* 3D Rope — center */}
        <div className="relative w-[160px] md:w-[220px] lg:w-[280px] h-[75vh] z-0">
          <WireRope3D />
        </div>
      </div>

      {/* ─── BODY TEXT — bottom left ─── */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16 lg:left-28 max-w-sm z-10">
        <p className="text-[#1a1a2e] text-[10px] md:text-xs leading-[1.7] tracking-[0.02em] opacity-65">
          Lorem ipsum dolor sit amet consectetur. Nulla amet feugiat laoreet
          fermentum nisi ut egestas rutrum non. Arcu amet cursus augue
          dignissim euismod etiam. Tortor vestibulum blandit tellus id non sed
          tristique malesuada. Ultrices consectetur semper eget phasellus in
          sagittis eu turpis.
        </p>
        <p className="text-[#1a1a2e] text-[10px] md:text-xs leading-[1.7] tracking-[0.02em] opacity-65 mt-3">
          Lorem ipsum dolor sit amet consectetur. Nulla amet feugiat laoreet
          fermentum nisi ut egestas rutrum non. Arcu amet cursus augue
          dignissim euismod etiam. Tortor vestibulum blandit tellus id non sed
          tristique malesuada. Ultrices consectetur semper eget phasellus in
          sagittis eu turpis.
        </p>
      </div>
    </div>
  );
}
