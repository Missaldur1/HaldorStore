import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CartItem } from "./cart"

/* ============================
   TIPO DE UNA ORDEN
============================ */
export type Order = {
  id: string
  createdAt: number
  currency: "CLP" | "USD"
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  customer: {
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    region?: string
    zip?: string
    reference?: string
  }
  payment: {
    transactionId: string
    method: "card"
    last4?: string
  }
  status: "paid"
}

/* ============================
   TIPO DEL STORE
============================ */
type OrderState = {
  orders: Record<string, Order>
  create: (o: Order) => void
  get: (id: string) => Order | undefined
  clear: () => void      // 👈 AGREGADO AQUÍ
}

/* ============================
   STORE COMPLETO
============================ */
export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: {},

      // Crear orden
      create: (o) =>
        set((s) => ({
          orders: { ...s.orders, [o.id]: o },
        })),

      // Obtener una orden
      get: (id) => get().orders[id],

      // 🔥 Limpiar todas las órdenes
      clear: () => set({ orders: {} }),
    }),
    {
      name: "haldor-orders",
      storage: createJSONStorage(() => localStorage),

      // Solo persistir orders
      partialize: (s) => ({ orders: s.orders }),
    }
  )
)