// src/pages/Orders.tsx
import { Link } from "react-router-dom"
import { useOrders } from "@/store/orders"
import { ArrowRight } from "lucide-react"
import { usePageTitle } from "@/hooks/useDocumentTitle"

export default function OrdersPage() {
  usePageTitle("Mis pedidos")

  const ordersObj = useOrders(s => s.orders)
  const orders = Object.values(ordersObj)
    .sort((a, b) => b.createdAt - a.createdAt) // más nuevos primero

  const isEmpty = orders.length === 0

  return (
    <section className="space-y-6">

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Mis pedidos
        </h1>
      </header>

      {isEmpty ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  )
}

/* ===================== Tarjeta de pedido ===================== */

function OrderCard({ order }: any) {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Info principal */}
        <div>
          <div className="text-sm text-stone-300/90">
            Orden <span className="font-semibold">{order.id}</span>
          </div>
          <div className="text-xs text-stone-400">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Total */}
        <div className="text-right sm:text-center">
          <div className="text-sm">Total pagado</div>
          <div className="font-semibold text-amber-300">
            ${order.total.toLocaleString("es-CL")}
          </div>
        </div>

        {/* Botón ver detalle */}
        <Link
          to={`/order/${order.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-700/60 px-3 py-2 text-sm hover:bg-white/10"
        >
          Ver detalle
          <ArrowRight className="size-4" />
        </Link>

      </div>
    </div>
  )
}

/* ===================== Estado vacío ===================== */

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 text-center">
      <p className="text-sm text-stone-300/90">
        Aún no tienes pedidos.
      </p>
      <Link
        to="/catalog"
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95"
      >
        Ir al catálogo
      </Link>
    </div>
  )
}