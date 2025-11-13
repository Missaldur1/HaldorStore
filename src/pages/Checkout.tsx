import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/store/cart"
import { useOrders } from "@/store/orders"
import { simulateCharge, luhnOk } from "@/services/fakePayment"
import { toast } from "sonner"
import { Lock, Loader2 } from "lucide-react"
import { usePageTitle } from "@/hooks/useDocumentTitle"

/* ---------- Botón tipo "radio chip" ---------- */
function RadioChip({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className={[
        "rounded-lg px-3 py-2 text-sm border transition-colors",
        checked
          ? "border-amber-400 bg-amber-500/10 text-amber-200"
          : "border-stone-700/60 bg-stone-900/40 hover:bg-white/10"
      ].join(" ")}
    >
      {label}
    </button>
  )
}

export default function Checkout() {
  usePageTitle("Checkout")
  const itemsObj = useCart(s => s.items)
  const clearCart = useCart(s => s.clear)
  const items = Object.values(itemsObj)
  const navigate = useNavigate()
  const addOrder = useOrders(s => s.create)

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)
  const [shipMethod, setShipMethod] = useState<"standard" | "express">("standard")
  const shipping = shipMethod === "standard" ? 3990 : 6990
  const total = subtotal + (items.length ? shipping : 0)

  // Datos comprador
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("")
  const [zip, setZip] = useState("")

  // Tarjeta
  const [card, setCard] = useState("4242424242424242") // éxito
  const [exp, setExp] = useState("12/29")
  const [cvc, setCvc] = useState("123")

  const disabled = useMemo(() => {
    if (items.length === 0) return true
    if (!name || !email) return true
    if (!card || !exp || !cvc) return true
    return false
  }, [items.length, name, email, card, exp, cvc])

  const [loading, setLoading] = useState(false)
  const [needs3DS, setNeeds3DS] = useState(false)

  async function handlePay(authResult?: "approved" | "declined") {
    if (disabled) return

    // parse expiry
    const [mm, yyRaw] = exp.split("/")
    const yy = (yyRaw || "").trim()

    setLoading(true)
    const res = await simulateCharge({
      amount: total,
      currency: "CLP",
      cardNumber: card,
      expMonth: (mm || "").trim(),
      expYear: yy,
      cvc: cvc.trim(),
      threeDSResult: authResult
    })
    setLoading(false)

    if (res.status === "requires_action") {
      setNeeds3DS(true) // abrir modal 3DS simulado
      return
    }
    if (res.status === "error" || res.status === "declined") {
      toast.error(res.message ?? "Pago rechazado")
      return
    }

    // éxito
    const orderId = "ORD-" + Date.now().toString(36).toUpperCase()
    addOrder({
      id: orderId,
      createdAt: Date.now(),
      currency: "CLP",
      items,
      subtotal,
      shipping: items.length ? shipping : 0,
      total,
      customer: { name, email, phone, address, city, region, zip },
      payment: {
        transactionId: res.transactionId ?? "TXN-TEST",
        method: "card",
        last4: card.replace(/\D/g, "").slice(-4),
      },
      status: "paid",
    })

    clearCart()
    toast.success("Pago aprobado", { description: `Orden ${orderId}` })
    navigate(`/order/${orderId}`)
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 text-center">
        <p className="text-sm text-stone-300/90">Tu carrito está vacío.</p>
        <Link to="/catalog" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95">Ir al catálogo</Link>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr,380px]">
      {/* formulario */}
      <div className="space-y-6">
        <Box title="Datos de envío">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Nombre" value={name} onChange={setName} required />
            <Input label="Email" type="email" value={email} onChange={setEmail} required />
            <Input label="Teléfono" value={phone} onChange={setPhone} />
            <Input label="Dirección" value={address} onChange={setAddress} className="sm:col-span-2" />
            <Input label="Ciudad" value={city} onChange={setCity} />
            <Input label="Región" value={region} onChange={setRegion} />
            <Input label="Código postal" value={zip} onChange={setZip} />
          </div>

          <div className="mt-3">
            <div className="text-xs text-stone-400 mb-1">Envío</div>
            <div className="flex flex-wrap gap-2">
              <RadioChip
                label="Estándar (CLP $3.990)"
                checked={shipMethod === "standard"}
                onChange={() => setShipMethod("standard")}
              />
              <RadioChip
                label="Express (CLP $6.990)"
                checked={shipMethod === "express"}
                onChange={() => setShipMethod("express")}
              />
            </div>
          </div>
        </Box>

        <Box title="Pago con tarjeta">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="Número de tarjeta"
              value={card}
              onChange={(v) => setCard(v.replace(/[^\d ]/g, ""))}
              placeholder="4242 4242 4242 4242"
              hint={luhnOk(card) ? "" : "Número inválido"}
            />
            <Input label="CVC" value={cvc} onChange={(v) => setCvc(v.replace(/\D/g, "").slice(0, 4))} placeholder="123" />
            <Input
              label="Expiración (MM/YY)"
              value={exp}
              onChange={(v) => setExp(v.replace(/[^\d/]/g, "").slice(0,5))}
              placeholder="12/29"
            />
          </div>

          {/* tarjetas de prueba */}
          <div className="mt-3 text-xs text-stone-400">
            <p className="mb-1">Tarjetas de prueba:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="text-stone-300">4242 4242 4242 4242</code> → éxito</li>
              <li><code className="text-stone-300">4000 0000 0000 0002</code> → rechazada</li>
              <li><code className="text-stone-300">4000 0000 0000 0127</code> → fondos insuficientes</li>
              <li><code className="text-stone-300">4000 0000 0000 9995</code> → requiere 3-D Secure</li>
            </ul>
          </div>
        </Box>
      </div>

      {/* resumen */}
      <aside className="h-fit rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4 space-y-3">
        <h2 className="text-sm font-semibold">Resumen</h2>
        <div className="space-y-1 text-sm">
          <Row k="Productos" v={`$${subtotal.toLocaleString("es-CL")}`} />
          <Row k="Envío" v={`$${(items.length ? shipping : 0).toLocaleString("es-CL")}`} />
        </div>
        <div className="border-t border-stone-700/60 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toLocaleString("es-CL")}</span>
        </div>
        <button
        type="button"
        disabled={disabled || loading}
        onClick={() => handlePay()}
        className="w-full h-11 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center justify-center gap-2
                    hover:brightness-95 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-400/70
                    cursor-pointer disabled:cursor-not-allowed"
        aria-busy={loading}
        >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        Pagar ahora
        </button>
        <Link to="/cart" className="block text-center text-sm text-amber-300 hover:text-amber-200">Volver al carrito</Link>
      </aside>

      {/* Modal 3DS simulado */}
      {needs3DS && (
        <ThreeDSModal
          onClose={() => setNeeds3DS(false)}
          onResult={(r) => handlePay(r)}
        />
      )}
    </section>
  )
}

/* ---------- UI helpers ---------- */
function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}
function Input(props: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean; hint?: string; className?: string
}) {
  const { label, value, onChange, type="text", placeholder, required, hint, className } = props
  return (
    <label className={`block ${className ?? ""}`}>
      <div className="text-xs text-stone-400 mb-1">{label}{required && " *"}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/60"
      />
      {hint ? <div className="mt-1 text-xs text-red-300">{hint}</div> : null}
    </label>
  )
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span>{k}</span><span>{v}</span></div>
}

/* ---------- Modal 3-D Secure simulado ---------- */
function ThreeDSModal({ onClose, onResult }: { onClose: () => void; onResult: (r: "approved" | "declined") => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-700/60 bg-gradient-to-b from-stone-900 to-slate-900 p-5">
          <h3 className="text-lg font-semibold">Autenticación 3-D Secure</h3>
          <p className="mt-1 text-sm text-stone-300/90">
            Simulación bancaria. ¿Apruebas esta compra?
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => { onClose(); onResult("approved") }}
              className="flex-1 h-10 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:brightness-95"
            >
              Aprobar
            </button>
            <button
              onClick={() => { onClose(); onResult("declined") }}
              className="flex-1 h-10 rounded-lg border border-stone-700/60 hover:bg-white/10"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
