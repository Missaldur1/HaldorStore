import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Product } from "@/types/product"

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  qty: number
}

type CartState = {
  items: Record<string, CartItem> // indexado por id de producto
  addItem: (p: Product, qty?: number) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (p, qty = 1) =>
        set((state) => {
          const cur = state.items[p.id]
          const nextQty = (cur?.qty ?? 0) + qty
          return {
            items: {
              ...state.items,
              [p.id]: {
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                image: p.image,
                qty: nextQty,
              },
            },
          }
        }),
      removeItem: (id) =>
        set((state) => {
          const copy = { ...state.items }
          delete copy[id]
          return { items: copy }
        }),
      setQty: (id, qty) =>
        set((state) => {
          const it = state.items[id]
          if (!it) return state
          return { items: { ...state.items, [id]: { ...it, qty: Math.max(1, qty) } } }
        }),
      clear: () => set({ items: {} }),
    }),
    {
      name: "haldor-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
)

// Selector práctico para contar unidades
export const useCartCount = () =>
  useCart((s) => Object.values(s.items).reduce((acc, it) => acc + it.qty, 0))
