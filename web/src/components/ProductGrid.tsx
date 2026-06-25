import Image from 'next/image';
import type { StorefrontProduct } from '@/types/trendyol';

async function getProducts(): Promise<StorefrontProduct[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/products?size=24`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency === 'TRY' ? 'TRY' : 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function ProductGrid() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <section className="py-24 px-8 md:px-16 bg-[var(--paper)]">
        <p className="mono text-[#1a1a2e] opacity-40 text-sm">
          Ürünler yükleniyor — API bağlantısı kontrol edilsin.
        </p>
      </section>
    );
  }

  return (
    <section className="py-24 px-8 md:px-16 bg-[var(--paper)] metal-grain">
      {/* Section heading */}
      <div className="mb-16">
        <p className="mono text-[9px] tracking-[0.35em] text-[var(--accent-orange)] uppercase mb-3">
          Ürün Kataloğu
        </p>
        <h2 className="text-[var(--ink)] font-black text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.03em]">
          Endüstriyel
          <br />
          <span className="opacity-30">Koleksiyon</span>
        </h2>
      </div>

      {/* Asymmetric mosaic grid — Karyamoni V2 "mosaic balance" */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {products.map((product, index) => {
          // Alternating mosaic: wide cards every 5th item
          const isWide = index % 5 === 0;
          const colSpan = isWide ? 'col-span-12 md:col-span-8' : 'col-span-6 md:col-span-4';
          const imageHeight = isWide ? 'h-64 md:h-80' : 'h-48 md:h-56';

          return (
            <div
              key={product.barcode}
              className={`${colSpan} group relative bg-[var(--mist)] overflow-hidden`}
            >
              {/* Product image */}
              {product.images?.[0]?.url ? (
                <div className={`relative w-full ${imageHeight} overflow-hidden`}>
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div
                  className={`${imageHeight} bg-[var(--steel-silver)] flex items-center justify-center`}
                >
                  <span className="mono text-[10px] text-[var(--steel-shadow)] tracking-widest uppercase">
                    No Image
                  </span>
                </div>
              )}

              {/* Product info */}
              <div className="p-4 md:p-6">
                <p className="mono text-[9px] tracking-[0.3em] text-[var(--steel-shadow)] uppercase mb-1">
                  {product.brandName} · {product.categoryName}
                </p>
                <h3 className="text-[var(--ink)] font-bold text-sm md:text-base leading-tight mb-3 line-clamp-2">
                  {product.title}
                </h3>

                {/* Price — monumental display */}
                <div className="flex items-end gap-3">
                  <span className="text-[var(--ink)] font-black text-2xl md:text-3xl leading-none">
                    {formatPrice(product.storefrontPrice, product.currencyType)}
                  </span>
                  {product.storefrontPrice !== product.marketSalePrice && (
                    <span className="mono text-[var(--steel-shadow)] text-[10px] line-through opacity-60">
                      {formatPrice(product.marketSalePrice, product.currencyType)}
                    </span>
                  )}
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${product.quantity > 0 ? 'bg-[var(--accent-orange)]' : 'bg-[var(--steel-shadow)]'}`}
                  />
                  <span className="mono text-[9px] tracking-[0.2em] text-[var(--steel-shadow)] uppercase">
                    {product.quantity > 0 ? `${product.quantity} Stok` : 'Tükendi'}
                  </span>
                </div>

                {/* CTA */}
                <button
                  className="mt-4 w-full py-2.5 px-4 bg-[var(--ink)] text-white mono text-[10px] tracking-[0.25em] uppercase hover:bg-[var(--accent-orange)] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={product.quantity === 0}
                >
                  Teklif Al
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
