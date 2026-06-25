import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  barcode: string;
  productId: number;
  title: string;
  storefrontPrice: number;
  marketSalePrice: number;
  quantity: number;
  imageUrl: string;
  categoryName: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (barcode: string) => void;
  updateQuantity: (barcode: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.barcode === item.barcode);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.barcode === item.barcode
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        });
      },

      removeItem: (barcode) => {
        set((state) => ({ items: state.items.filter((i) => i.barcode !== barcode) }));
      },

      updateQuantity: (barcode, quantity) => {
        if (quantity <= 0) {
          get().removeItem(barcode);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.barcode === barcode ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      // Display only — authoritative price re-fetched from /api/cart before checkout
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.storefrontPrice * i.quantity, 0),
    }),
    {
      name: 'stainlessart-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
