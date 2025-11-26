import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CartItem } from "./cart"

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

type OrderState = {
  orders: Record<string, Order>
  create: (o: Order) => void
  get: (id: string) => Order | undefined
}

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: {},
      create: (o) => set((s) => ({ orders: { ...s.orders, [o.id]: o } })),
      get: (id) => get().orders[id],
    }),
    {
      name: "haldor-orders",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ orders: s.orders }),
    }
  )
)