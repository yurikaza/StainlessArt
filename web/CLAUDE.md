# Project: StainlessArt

Headless e-commerce storefront for an industrial brand. Built with Next.js 15 (App Router), React Three Fiber (R3F), GSAP ScrollTrigger, Tailwind CSS v4, and integrated with the Trendyol API V2/V3.

## ⚠️ IMMUTABLE SECTIONS (DO NOT TOUCH)

The following elements have been completely built, polished, and validated. **DO NOT modify, refactor, rewrite, or delete any code within these files or boundaries:**

- **The 3D Hero Section:** (Including the 3D canvas, lighting, and the spinning/divergent splitting "Stainless Steel Rope" R3F components).
- **The Immediate Section Below the Hero:** (The section introducing the catalog/collections directly following the Hero transition).
- _Note: Treat these components as read-only, immutable constants. Build all subsequent pages, routes, and features to integrate seamlessly around them._

## 🧠 MCP & Context Retrieval (CRITICAL)

Before scaffolding complex logic, you MUST use the NotebookLM MCP server to retrieve exact architectural specs, Trendyol API schemas, and 3D implementations.

- Use `list_notebooks` to find the 'StainlessArt' notebook.
- Use `select_notebook` to make it your active context.
- Call `ask_question` to retrieve exact requirements (e.g., "What is the schema for Trendyol stock updates?" or "What are the 9 essential pages?").

## 💻 Code Style & Architecture

- **Framework:** Next.js 15 App Router ONLY. Use React Server Components (RSC) by default for data fetching to minimize JS bundle size; use Server Actions for mutations.
- **Styling:** Tailwind CSS v4.
- **Typography:** Use `neue-haas-grotesk-display-pro-cdnfonts` for all headings and copy.
- **Media:** Use `next/image` for all standard media to maintain sub-1.5s LCP.
- **Accessibility:** Ensure WCAG compliance and ALWAYS implement `prefers-reduced-motion` media queries. Fall back to CSS opacity fades instead of heavy 3D motion if the user prefers reduced motion.

## 🎨 Design System: Karyamoni V2 & 2025 Trends

- **Industrial Minimalism:** High-contrast dark UI (Deep Blue, Slate, Brushed Silver) with Safety Orange for primary CTAs. Use brushed-metal CSS textures and ample whitespace.
- **2025 Web Design Trends to Integrate:**
  - _UFOs (Unexpected Floating Objects):_ 3D industrial parts floating outside grid bounds.
  - _Freeform Finishes & Collage Uploaded:_ Mix hand-drawn doodles, charcoal underlines, and blueprint drafts with polished renders.
  - _Bits and Bytes:_ Subtle retro-digital aesthetics (pixelated icons).
  - _Candy Color Pop:_ Highly saturated hues (purples/pinks) for interactive badges/glows.
  - _Scrollytelling:_ Use vertical scrolling to progressively disclose narrative content.
- **Visual Blueprints:** Reference `stainless_art_hero_ui.jpg` for the Hero layout and `stainless_art_collage_ui.jpg` for product details and about pages.

## ⚠️ Gotchas & Integrations

- **Trendyol API V2:** Always use HTTP Basic Auth encoded as `base64(API_KEY:API_SECRET)` and the mandatory `User-Agent: {supplierId} - SelfIntegration` header.
- **Price Decoupling:** Fetch marketplace prices from Trendyol, but calculate and render modified storefront prices in the UI via Next.js middleware. Do NOT overwrite original marketplace prices in the master database to prevent sync failures.
- **Form Inputs:** Disable autocorrect on all checkout and search inputs.

## 🏃‍♂️ Commands

- `npm run dev`: Start development server
- `npm run build`: Create optimized production build
- `npm run lint`: Run ESLint checks
