'use client';

import { useCartStore } from '@/lib/cart-store';

interface Product {
  id: number;
  barcode: string;
  title: string;
  storefrontPrice: number;
  marketSalePrice: number;
  quantity: number;
  imageUrl: string;
  categoryName: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  if (product.quantity === 0) {
    return (
      <button
        disabled
        className="w-full py-4 px-8 bg-[var(--steel-silver)]/20 text-[var(--steel-silver)] text-xs font-bold tracking-widest uppercase cursor-not-allowed"
      >
        Stok Yok
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        addItem({
          barcode: product.barcode,
          productId: product.id,
          title: product.title,
          storefrontPrice: product.storefrontPrice,
          marketSalePrice: product.marketSalePrice,
          quantity: 1,
          imageUrl: product.imageUrl,
          categoryName: product.categoryName,
        })
      }
      className="w-full py-4 px-8 bg-[var(--accent-orange)] text-white text-xs font-bold tracking-widest uppercase
        hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7]
        active:scale-[0.98] transition-all duration-200
        motion-reduce:transition-none motion-reduce:hover:shadow-none"
    >
      Sepete Ekle
    </button>
  );
}
