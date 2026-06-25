'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sepet"
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md flex flex-col
          bg-[var(--navy)] border-l border-[var(--steel-silver)]/20
          transition-transform duration-300 motion-reduce:transition-none
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--steel-silver)]/20">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--paper)]">
            Sepet <span className="text-[var(--steel-silver)] font-normal">({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </h2>
          <button
            onClick={closeCart}
            aria-label="Sepeti kapat"
            className="text-[var(--steel-silver)] hover:text-[var(--paper)] transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="body-intimate text-[var(--steel-silver)] text-center mt-16">
              Sepetiniz boş.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.barcode} className="flex gap-4 py-4 border-b border-[var(--steel-silver)]/10">
                {item.imageUrl && (
                  <div className="relative w-20 h-20 shrink-0 bg-[var(--ink)] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="body-intimate text-[var(--paper)] line-clamp-2 text-sm">{item.title}</p>
                  <p className="mono text-[var(--accent-orange)] text-sm mt-1">
                    {item.storefrontPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.barcode, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border border-[var(--steel-silver)]/30 text-[var(--paper)] hover:border-[var(--accent-orange)] transition-colors text-xs"
                      aria-label="Azalt"
                    >−</button>
                    <span className="mono text-[var(--paper)] text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.barcode, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-[var(--steel-silver)]/30 text-[var(--paper)] hover:border-[var(--accent-orange)] transition-colors text-xs"
                      aria-label="Artır"
                    >+</button>
                    <button
                      onClick={() => removeItem(item.barcode)}
                      className="ml-auto text-xs text-[var(--steel-silver)] hover:text-red-400 transition-colors"
                      aria-label="Kaldır"
                    >Kaldır</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--steel-silver)]/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="body-intimate text-[var(--steel-silver)] text-sm">Ara toplam</span>
              <span className="mono text-[var(--paper)] font-semibold">
                {subtotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </div>
            <p className="text-[var(--steel-silver)] text-xs">Kargo ve vergi ödeme adımında hesaplanır.</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3 px-6 bg-[var(--accent-orange)] text-white
                text-xs font-bold tracking-widest uppercase
                hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7]
                transition-shadow duration-300 motion-reduce:transition-none"
            >
              Ödemeye Geç
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
