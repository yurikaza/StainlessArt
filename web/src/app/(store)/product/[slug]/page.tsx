import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchProducts } from '@/lib/trendyol';
import { applyStorefrontPrice } from '@/lib/priceDecoupling';
import AddToCartButton from './AddToCartButton';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { content } = await fetchProducts(0, 200);
  const raw = content.find((p) => p.barcode === slug || p.stockCode === slug);
  if (!raw) notFound();

  const storefrontPrice = applyStorefrontPrice(raw.salePrice);
  const hasDiscount = raw.listPrice > raw.salePrice;

  const product = {
    id: raw.id,
    barcode: raw.barcode,
    title: raw.title,
    brandName: raw.brandName,
    categoryName: raw.categoryName,
    description: raw.description,
    quantity: raw.quantity,
    stockCode: raw.stockCode,
    storefrontPrice,
    marketSalePrice: raw.salePrice,
    marketListPrice: raw.listPrice,
    hasDiscount,
    vatRate: raw.vatRate,
    images: raw.images,
    imageUrl: raw.images[0]?.url ?? '',
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 mono text-xs text-[var(--steel-silver)] uppercase tracking-widest">
          <li><a href="/" className="hover:text-[var(--paper)] transition-colors">Ana Sayfa</a></li>
          <li aria-hidden="true">›</li>
          <li><a href={`/category/${encodeURIComponent(product.categoryName)}`} className="hover:text-[var(--paper)] transition-colors">{product.categoryName}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[var(--paper)] line-clamp-1">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            <>
              <div className="relative aspect-square bg-[var(--navy)] overflow-hidden">
                <Image
                  src={product.images[0].url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="relative aspect-square bg-[var(--navy)] overflow-hidden">
                      <Image
                        src={img.url}
                        alt={`${product.title} görsel ${i + 2}`}
                        fill
                        className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-[var(--navy)] flex items-center justify-center">
              <span className="mono text-[var(--steel-silver)] text-xs">Görsel yok</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative">
          {/* UFO — floating industrial element outside grid */}
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-8 w-24 h-24 opacity-20 pointer-events-none
              motion-reduce:hidden"
            style={{
              transform: 'perspective(400px) rotateX(20deg) rotateZ(-15deg)',
              background: 'radial-gradient(circle at 40% 40%, var(--steel-highlight), var(--steel-shadow))',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />

          <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-2">
            {product.brandName}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--paper)] mb-4 leading-snug">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-black text-[var(--paper)]">
              {product.storefrontPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </span>
            {product.hasDiscount && (
              <span className="mono text-[var(--steel-silver)] line-through text-sm">
                {product.marketListPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`w-2 h-2 rounded-full ${product.quantity > 0 ? 'bg-[var(--accent-orange)]' : 'bg-[var(--steel-silver)]'}`}
              aria-hidden="true"
            />
            <span className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)]">
              {product.quantity > 1
                ? `Stokta — ${product.quantity} adet`
                : product.quantity === 1
                ? 'Son 1 adet'
                : 'Stok yok'}
            </span>
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-[var(--steel-silver)]/20">
              <h2 className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-3">Ürün Açıklaması</h2>
              <p className="body-intimate text-[var(--steel-silver)] text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Spec table */}
          <div className="mt-8 pt-8 border-t border-[var(--steel-silver)]/20">
            <h2 className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-3">Teknik Özellikler</h2>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Barkod', product.barcode],
                  ['Stok Kodu', product.stockCode],
                  ['Kategori', product.categoryName],
                  ['Marka', product.brandName],
                  ['KDV Oranı', `%${product.vatRate}`],
                ].map(([key, val]) => (
                  <tr key={key} className="border-b border-[var(--steel-silver)]/10">
                    <td className="mono text-[var(--steel-silver)] py-2 pr-4 text-xs uppercase tracking-wide w-40">
                      {/* Bits and Bytes: pixelated icon via image-rendering */}
                      <span style={{ imageRendering: 'pixelated' }}>▸</span> {key}
                    </td>
                    <td className="body-intimate text-[var(--paper)] py-2 text-xs">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
