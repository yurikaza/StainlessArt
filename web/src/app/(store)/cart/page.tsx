'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const [stockWarnings, setStockWarnings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (items.length === 0) return;
    const barcodes = items.map((i) => i.barcode).join(',');
    fetch(`/api/cart?barcodes=${barcodes}`)
      .then((r) => r.json())
      .then((data) => {
        const warnings: Record<string, boolean> = {};
        for (const [barcode, inStock] of Object.entries(data.availability ?? {})) {
          if (!inStock) warnings[barcode] = true;
        }
        setStockWarnings(warnings);
      })
      .catch(() => {});
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-[var(--paper)] mb-4">Sepetiniz Boş</h1>
        <p className="body-intimate text-[var(--steel-silver)] mb-8">Ürünlere göz atmaya devam edin.</p>
        <Link
          href="/"
          className="inline-block py-3 px-8 bg-[var(--accent-orange)] text-white mono text-xs uppercase tracking-widest
            hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7] transition-shadow motion-reduce:transition-none"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--paper)] mb-12">Sepet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.barcode}
              className={`flex gap-6 p-4 border ${
                stockWarnings[item.barcode]
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-[var(--steel-silver)]/10 bg-[var(--navy)]'
              }`}
            >
              {item.imageUrl && (
                <div className="relative w-24 h-24 shrink-0 bg-[var(--ink)] overflow-hidden">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="96px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="body-intimate text-[var(--paper)] text-sm mb-1">{item.title}</p>
                {stockWarnings[item.barcode] && (
                  <p className="mono text-red-400 text-xs uppercase tracking-wide mb-2">Stok Yok — Lütfen Kaldırın</p>
                )}
                <p className="mono text-[var(--accent-orange)] text-sm">
                  {item.storefrontPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 border border-[var(--steel-silver)]/20">
                    <button
                      onClick={() => updateQuantity(item.barcode, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--paper)] hover:text-[var(--accent-orange)] transition-colors"
                      aria-label="Azalt"
                    >−</button>
                    <span className="mono text-[var(--paper)] text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.barcode, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--paper)] hover:text-[var(--accent-orange)] transition-colors"
                      aria-label="Artır"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.barcode)}
                    className="mono text-xs text-[var(--steel-silver)] hover:text-red-400 transition-colors uppercase tracking-wide"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="mono text-[var(--paper)] font-semibold">
                  {(item.storefrontPrice * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="mono text-xs text-[var(--steel-silver)] hover:text-red-400 transition-colors uppercase tracking-widest mt-4"
          >
            Sepeti Temizle
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[var(--navy)] border border-[var(--steel-silver)]/10 p-6 h-fit">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--paper)] mb-6">Sipariş Özeti</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="body-intimate text-[var(--steel-silver)] text-sm">Ara Toplam</span>
              <span className="mono text-[var(--paper)] text-sm">
                {subtotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="body-intimate text-[var(--steel-silver)] text-sm">Kargo</span>
              <span className="mono text-[var(--steel-silver)] text-sm">Kargoda hesaplanır</span>
            </div>
          </div>
          <div className="border-t border-[var(--steel-silver)]/20 pt-4 flex justify-between mb-6">
            <span className="text-sm font-bold text-[var(--paper)]">Toplam</span>
            <span className="mono text-[var(--paper)] font-bold">
              {subtotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center py-4 bg-[var(--accent-orange)] text-white text-xs font-bold tracking-widest uppercase
              hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7]
              transition-shadow motion-reduce:transition-none"
          >
            Ödemeye Geç
          </Link>
        </div>
      </div>
    </div>
  );
}
