import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/store/cart"
import { toast } from "sonner"
import { usePageTitle } from "@/hooks/useDocumentTitle"

export default function CartPage() {
  usePageTitle("Carrito")
  const itemsObj = useCart(s => s.items)
  const setQty = useCart(s => s.setQty)
  const removeItem = useCart(s => s.removeItem)
  const clear = useCart(s => s.clear)

  const items = Object.values(itemsObj)
  const isEmpty = items.length === 0
  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Carrito</h1>
        {!isEmpty && (
          <button
            onClick={() => {
              clear()
              toast("Carrito vacío", { description: "Se eliminaron todos los productos." })
            }}
            className="text-sm rounded-lg border border-stone-700/60 px-3 py-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
          >
            Vaciar carrito
          </button>
        )}
      </header>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
          {/* Lista */}
          <ul className="space-y-3">
            {items.map(it => (
              <li key={it.id} className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-3 sm:p-4">
                <div className="flex gap-3">
                  <Link to={`/product/${it.slug}`} className="block shrink-0">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="size-20 sm:size-24 rounded-lg object-cover bg-stone-800"
                      loading="lazy"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${it.slug}`} className="font-semibold hover:underline line-clamp-1">
                      {it.name}
                    </Link>
                    <div className="text-sm text-stone-400 mt-0.5">
                      ${it.price.toLocaleString("es-CL")}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border border-stone-700/60">
                        <button
                          type="button"
                          className="h-9 w-8 hover:bg-white/10"
                          aria-label="Disminuir"
                          onClick={() => setQty(it.id, Math.max(1, it.qty - 1))}
                        >
                          <Minus className="size-4 mx-auto" />
                        </button>
                        <input
                          value={it.qty}
                          onChange={(e) => {
                            const v = parseInt(e.target.value || "1", 10)
                            setQty(it.id, Number.isNaN(v) ? 1 : Math.max(1, v))
                          }}
                          className="h-9 w-12 bg-transparent text-center outline-none"
                          inputMode="numeric"
                          aria-label="Cantidad"
                        />
                        <button
                          type="button"
                          className="h-9 w-8 hover:bg-white/10"
                          aria-label="Aumentar"
                          onClick={() => setQty(it.id, it.qty + 1)}
                        >
                          <Plus className="size-4 mx-auto" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          removeItem(it.id)
                          toast("Producto eliminado", { description: it.name })
                        }}
                        className="ml-auto inline-flex items-center gap-2 rounded-lg border border-stone-700/60 px-3 py-2 text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                      >
                        <Trash2 className="size-4" />
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Resumen */}
          <aside className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4 h-fit">
            <h2 className="text-sm font-semibold">Resumen</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Envío</span>
                <span>Se calcula al pagar</span>
              </div>
            </div>
            <div className="mt-3 border-t border-stone-700/60 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>${subtotal.toLocaleString("es-CL")}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-4 w-full h-11 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center justify-center gap-2 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              Ir a pagar
            </Link>

            <Link
              to="/catalog"
              className="mt-2 block text-center text-sm text-amber-300 hover:text-amber-200"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}

function EmptyCart() {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 text-center">
      <p className="text-sm text-stone-300/90">Tu carrito está vacío.</p>
      <Link
        to="/catalog"
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
      >
        Explorar catálogo
      </Link>
    </div>
  )
}
