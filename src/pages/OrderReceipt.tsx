import { useParams, Link } from "react-router-dom"
import { useOrders } from "@/store/orders"

export default function OrderReceipt() {
  const { id = "" } = useParams()
  const order = useOrders(s => s.get(id))

  if (!order) {
    return (
      <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 text-center">
        <p className="text-sm text-stone-300/90">No encontramos esta orden.</p>
        <Link to="/catalog" className="mt-3 inline-block rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Gracias por tu compra</h1>
      <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
        <div className="text-sm text-stone-300/90">
          <div>Orden <span className="font-semibold">{order.id}</span></div>
          <div className="text-stone-400">Fecha {new Date(order.createdAt).toLocaleString()}</div>
        </div>

        <div className="mt-4 grid gap-2">
          {order.items.map(it => (
            <div key={it.id} className="flex items-center gap-3">
              <img src={it.image} alt={it.name} className="size-12 rounded object-cover bg-stone-800" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{it.name}</div>
                <div className="text-xs text-stone-400">x{it.qty}</div>
              </div>
              <div className="text-sm">${(it.price * it.qty).toLocaleString("es-CL")}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-stone-700/60 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toLocaleString("es-CL")}</span></div>
          <div className="flex justify-between text-stone-400"><span>Envío</span><span>${order.shipping.toLocaleString("es-CL")}</span></div>
          <div className="flex justify-between font-semibold pt-2"><span>Total pagado</span><span>${order.total.toLocaleString("es-CL")}</span></div>
        </div>

        <div className="mt-3 text-xs text-stone-400">
          Transacción: {order.payment.transactionId} · Método: Tarjeta •••• {order.payment.last4}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/catalog" className="rounded-lg border border-stone-700/60 px-3 py-2 text-sm hover:bg-white/10">Seguir comprando</Link>
          <Link to="/" className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-black hover:brightness-95">Ir al inicio</Link>
        </div>
      </div>
    </section>
  )
}
