"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WireRope3D = dynamic(() => import("@/components/WireRope3D"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export default function HeroSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const blackBoxRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const sticky = stickyRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;
    const blackBox = blackBoxRef.current;
    if (!scroller || !sticky || !leftText || !rightText || !blackBox) return;

    // Black box starts invisible via clip-path
    gsap.set(blackBox, { clipPath: "circle(0% at 50% 50%)" });

    const ctx = gsap.context(() => {
      // Master pin + scroll progress tracker
      ScrollTrigger.create({
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        pin: sticky,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });

      // Headings diverge in sync with rope gate open: 10% → 65%
      gsap.to(leftText, {
        x: "-22vw",
        ease: "none",
        scrollTrigger: {
          trigger: scroller,
          start: "10% top",
          end: "65% top",
          scrub: 1,
        },
      });

      gsap.to(rightText, {
        x: "22vw",
        ease: "none",
        scrollTrigger: {
          trigger: scroller,
          start: "10% top",
          end: "65% top",
          scrub: 1,
        },
      });

      // Text fades out once box grows large enough to cover it
      gsap.to([leftText, rightText], {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scroller,
          start: "30% top",
          end: "45% top",
          scrub: 1,
        },
      });

      // Black box: reveals from center, fully covers viewport by 92%
      gsap.fromTo(
        blackBox,
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(150% at 50% 50%)",
          ease: "power2.in",
          scrollTrigger: {
            trigger: scroller,
            start: "20% top",
            end: "92% top",
            scrub: 1,
          },
        },
      );
    }, scroller);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={scrollerRef} className="relative h-[500vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-white select-none"
      >
        {/* Header */}
        <header className="absolute top-12 left-12 right-0 z-30 px-10 pt-8 md:px-16">
          <div className="text-[#1a1a2e] text-sm font-black tracking-[0.18em] uppercase">
            Stainless Art
          </div>
          <nav className="absolute top-8 left-[35%] flex flex-col items-start gap-0.5 text-[#1a1a2e] text-[11px] font-bold tracking-[0.25em] uppercase">
            {["Home", "About", "Gallery", "Contact"].map((item) => (
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

        {/* 3D Rope — full viewport canvas */}
        <div className="absolute inset-0 z-0">
          <WireRope3D scrollProgressRef={scrollProgressRef} />
        </div>

        {/* Left column — STAINLESS + body text */}
        <div
          ref={leftTextRef}
          className="absolute left-6 md:left-12 lg:left-20 z-10"
          style={{ top: "52%" }}
        >
          <h1
            className="text-[#1a1a2e] display-type leading-none"
            style={{ fontWeight: 350 }}
          >
            STAINLESS
          </h1>
          <div className="mt-8 max-w-xs flex-col gap-8 flex md:max-w-sm space-y-4">
            <p className="text-[#1a1a2e] body-intimate opacity-65">
              Lorem ipsum dolor sit amet consectetur. Nulla amet feugiat laoreet
              fermentum nisi ut egestas rutrum non. Arcu amet cursus augue
              dignissim euismod etiam. Tortor vestibulum blandit tellus id non
              sed tristique malesuada. Ultrices consectetur semper eget
              phasellus in sagittis eu turpis.
            </p>
            <p className="text-[#1a1a2e] body-intimate opacity-65 mt-12">
              Lorem ipsum dolor sit amet consectetur. Nulla amet feugiat laoreet
              fermentum nisi ut egestas rutrum non. Arcu amet cursus augue
              dignissim euismod etiam. Tortor vestibulum blandit tellus id non
              sed tristique malesuada. Ultrices consectetur semper eget
              phasellus in sagittis eu turpis.
            </p>
          </div>
        </div>

        {/* Right — ART */}
        <div
          ref={rightTextRef}
          className="absolute right-6 md:right-12 lg:right-20 z-10"
          style={{ top: "52%" }}
        >
          <h1
            className="text-[#1a1a2e] display-type leading-none"
            style={{ fontWeight: 350 }}
          >
            ART
          </h1>
        </div>

        {/* Black box — appears in gate gap, grows to fill full viewport */}
        <div
          ref={blackBoxRef}
          className="absolute inset-0 z-20"
          style={{ backgroundColor: "#0a0a0a" }}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 md:right-16 z-30 flex flex-col items-center gap-1">
          <span className="mono text-[#1a1a2e] text-[9px] tracking-[0.3em] uppercase opacity-40">
            Scroll
          </span>
          <div className="w-px h-8 bg-[#1a1a2e] opacity-20" />
        </div>
      </div>
    </div>
  );
}
