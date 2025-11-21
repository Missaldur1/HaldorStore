// src/pages/OrderReceipt.tsx
import { Link, useParams } from "react-router-dom"
import { useOrders } from "@/store/orders"
import { ArrowLeft } from "lucide-react"
import { usePageTitle } from "@/hooks/useDocumentTitle"

export default function OrderReceipt() {
  usePageTitle("Detalle del pedido")

  const { id } = useParams()
  const orders = useOrders((s) => s.orders)
  const order = orders[id as string]

  if (!order) {
    return (
      <section className="text-center py-10">
        <p className="text-stone-300 mb-3">Pedido no encontrado.</p>
        <Link to="/orders" className="text-amber-400 hover:text-amber-300 underline">
          Volver a mis pedidos
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {/* Botón volver */}
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-4"
        >
          <ArrowLeft className="size-4" />
          Volver a mis pedidos
        </Link>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight">Gracias por tu compra</h1>

      <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 space-y-5">
        {/* Header */}
        <div>
          <div className="text-sm text-stone-300/90">
            Orden <span className="font-semibold">{order.id}</span>
          </div>
          <div className="text-xs text-stone-400">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Lista de productos */}
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <Link
              key={item.id}
              to={`/product/${item.slug}`}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-stone-800/40 transition"
            >
              <img
                src={item.image}
                className="w-14 h-14 rounded object-cover"
                alt={item.name}
              />
              <div>
                <p className="font-medium text-stone-100">{item.name}</p>
                <p className="text-sm text-stone-400">x{item.qty}</p>
              </div>
              <div className="ml-auto font-semibold text-stone-200">
                ${(item.price * item.qty).toLocaleString("es-CL")}
              </div>
            </Link>
          ))}
        </div>

        {/* Subtotal / envío / total */}
        <div className="space-y-1 text-sm">
          <Row k="Subtotal" v={`$${order.subtotal.toLocaleString("es-CL")}`} />
          <Row k="Envío" v={`$${order.shipping.toLocaleString("es-CL")}`} />
        </div>

        <div className="border-t border-stone-700/60 pt-3 flex justify-between font-semibold">
          <span>Total pagado</span>
          <span>${order.total.toLocaleString("es-CL")}</span>
        </div>

        {/* Información de pago */}
        <div className="text-sm text-stone-400 pt-2">
          Transacción: <b>{order.payment.transactionId}</b> · Método: Tarjeta **** {order.payment.last4}
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-4">
          <Link
            to="/catalog"
            className="flex-1 h-10 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center justify-center hover:brightness-95"
          >
            Seguir comprando
          </Link>

          <Link
            to="/"
            className="flex-1 h-10 rounded-lg border border-stone-700/60 text-sm inline-flex items-center justify-center hover:bg-white/10"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}

/* Helper */
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  )
}