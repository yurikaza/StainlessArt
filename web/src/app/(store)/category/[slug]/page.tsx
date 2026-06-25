import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/lib/trendyol';
import { applyStorefrontPrice } from '@/lib/priceDecoupling';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; minPrice?: string; maxPrice?: string; inStock?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;
  const categoryName = decodeURIComponent(slug);

  const { content } = await fetchProducts(0, 200);

  let products = content.filter((p) =>
    p.categoryName.toLowerCase() === categoryName.toLowerCase()
  );

  if (filters.brand) {
    products = products.filter((p) => p.brandName.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters.minPrice) {
    const min = parseFloat(filters.minPrice);
    products = products.filter((p) => applyStorefrontPrice(p.salePrice) >= min);
  }
  if (filters.maxPrice) {
    const max = parseFloat(filters.maxPrice);
    products = products.filter((p) => applyStorefrontPrice(p.salePrice) <= max);
  }
  if (filters.inStock === '1') {
    products = products.filter((p) => p.quantity > 0);
  }

  const brands = [...new Set(content.filter((p) => p.categoryName.toLowerCase() === categoryName.toLowerCase()).map((p) => p.brandName))];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 mono text-xs text-[var(--steel-silver)] uppercase tracking-widest">
          <li><a href="/" className="hover:text-[var(--paper)] transition-colors">Ana Sayfa</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[var(--paper)]">{categoryName}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-[var(--paper)] mb-12">{categoryName}</h1>

      <div className="flex gap-12">
        {/* Filter sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <form method="GET" className="space-y-6">
            <div>
              <p className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-3">Marka</p>
              <select
                name="brand"
                defaultValue={filters.brand ?? ''}
                className="w-full bg-[var(--navy)] border border-[var(--steel-silver)]/20 text-[var(--paper)] text-sm py-2 px-3 mono"
              >
                <option value="">Tümü</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <p className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-3">Fiyat Aralığı</p>
              <div className="flex gap-2">
                <input
                  name="minPrice"
                  type="number"
                  placeholder="Min"
                  defaultValue={filters.minPrice ?? ''}
                  className="w-full bg-[var(--navy)] border border-[var(--steel-silver)]/20 text-[var(--paper)] text-sm py-2 px-2 mono"
                  autoCorrect="off"
                />
                <input
                  name="maxPrice"
                  type="number"
                  placeholder="Max"
                  defaultValue={filters.maxPrice ?? ''}
                  className="w-full bg-[var(--navy)] border border-[var(--steel-silver)]/20 text-[var(--paper)] text-sm py-2 px-2 mono"
                  autoCorrect="off"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                value="1"
                id="inStock"
                defaultChecked={filters.inStock === '1'}
                className="accent-[var(--accent-orange)]"
              />
              <label htmlFor="inStock" className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)]">
                Sadece stokta
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[var(--accent-orange)] text-white mono text-xs uppercase tracking-widest
                hover:shadow-[0_0_16px_var(--accent-orange)] transition-shadow motion-reduce:transition-none"
            >
              Filtrele
            </button>
            {Object.keys(filters).length > 0 && (
              <a href={`/category/${slug}`} className="block text-center mono text-xs text-[var(--steel-silver)] hover:text-[var(--paper)] transition-colors">
                Filtreleri Temizle
              </a>
            )}
          </form>
        </aside>

        {/* Product grid — asymmetric mosaic */}
        <div className="flex-1">
          {products.length === 0 ? (
            <p className="body-intimate text-[var(--steel-silver)] text-center py-24">
              Bu kategoride ürün bulunamadı.
            </p>
          ) : (
            <>
              <p className="mono text-xs text-[var(--steel-silver)] uppercase tracking-widest mb-6">
                {products.length} ürün
              </p>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
                {products.map((p, i) => {
                  const isWide = i % 5 === 0;
                  const storefrontPrice = applyStorefrontPrice(p.salePrice);
                  const hasDiscount = p.listPrice > p.salePrice;

                  return (
                    <Link
                      key={p.barcode}
                      href={`/product/${p.barcode}`}
                      className={`group block bg-[var(--navy)] border border-[var(--steel-silver)]/10 hover:border-[var(--steel-silver)]/30 transition-colors ${
                        isWide ? 'col-span-6 md:col-span-8' : 'col-span-6'
                      }`}
                    >
                      <div className={`relative overflow-hidden ${isWide ? 'h-64 md:h-80' : 'h-48 md:h-56'}`}>
                        {p.images[0] ? (
                          <Image
                            src={p.images[0].url}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                            sizes={isWide ? '66vw' : '50vw'}
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--ink)]" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="mono text-[var(--steel-silver)] text-xs uppercase tracking-wide mb-1">
                          {p.brandName} · {p.categoryName}
                        </p>
                        <p className="body-intimate text-[var(--paper)] text-sm line-clamp-2 mb-2">{p.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="mono text-[var(--paper)] text-sm font-semibold">
                            {storefrontPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                          </span>
                          {hasDiscount && (
                            <span className="mono text-[var(--steel-silver)] text-xs line-through">
                              {p.listPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </span>
                          )}
                          <span
                            className={`ml-auto w-2 h-2 rounded-full ${p.quantity > 0 ? 'bg-[var(--accent-orange)]' : 'bg-[var(--steel-silver)]/40'}`}
                            aria-label={p.quantity > 0 ? 'Stokta' : 'Tükendi'}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
