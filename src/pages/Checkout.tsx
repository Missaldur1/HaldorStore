import { useMemo, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/store/cart"
import { useOrders } from "@/store/orders"
import { toast } from "sonner"
import { Lock } from "lucide-react"
import { usePageTitle } from "@/hooks/useDocumentTitle"
import { useWebpay } from "@/store/webpay"
import { useAuthStore } from "@/store/authStore"

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
          : "border-stone-700/60 bg-stone-900/40 hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

export default function Checkout() {
  usePageTitle("Checkout")

  const itemsObj = useCart((s) => s.items)
  const items = Object.values(itemsObj)
  const clearCart = useCart((s) => s.clear)
  const navigate = useNavigate()
  const addOrder = useOrders((s) => s.create)
  const user = useAuthStore((s) => s.user)

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

  // Autocompletar si hay usuario logueado
  useEffect(() => {
    if (user) {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      setName(fullName)
      setEmail(user.email ?? "")
    }
  }, [user])

  const disabled = useMemo(() => {
    return !name || !email || items.length === 0
  }, [items.length, name, email])

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 text-center">
        <p className="text-sm text-stone-300/90">Tu carrito está vacío.</p>
        <Link
          to="/catalog"
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95"
        >
          Ir al catálogo
        </Link>
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
      </div>

      {/* resumen */}
      <aside className="h-fit rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4 space-y-3">
        <h2 className="text-sm font-semibold">Resumen</h2>
        <div className="space-y-1 text-sm">
          <Row k="Productos" v={`$${subtotal.toLocaleString("es-CL")}`} />
          <Row k="Envío" v={`$${shipping.toLocaleString("es-CL")}`} />
        </div>

        <div className="border-t border-stone-700/60 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toLocaleString("es-CL")}</span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            useWebpay.getState().setData({
              amount: total,
              items,
              customer: { name, email, phone, address, city, region, zip },
            })
            navigate("/webpay/init")
          }}
          className="w-full h-11 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center justify-center gap-2 hover:brightness-95 disabled:opacity-50"
        >
          <Lock className="size-4" />
          Pagar con WebPay
        </button>

        <Link
          to="/cart"
          className="block text-center text-sm text-amber-300 hover:text-amber-200"
        >
          Volver al carrito
        </Link>
      </aside>
    </section>
  )
}

/* ----------- Componentes pequeños ----------- */

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}

function Input(props: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}) {
  const { label, value, onChange, type = "text", placeholder, required, className } = props
  return (
    <label className={`block ${className ?? ""}`}>
      <div className="text-xs text-stone-400 mb-1">
        {label} {required && "*"}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/60"
      />
    </label>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  )
}