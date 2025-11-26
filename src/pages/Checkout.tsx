import { useMemo, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/store/cart"
import { useOrders } from "@/store/orders"
import { useWebpay } from "@/store/webpay"
import { useAuthStore } from "@/store/authStore"
import { usePageTitle } from "@/hooks/useDocumentTitle"
import { Lock } from "lucide-react"

import {
  listAddresses,
  listRegions,
  listProvinces,
  listCommunes,
} from "@/services/locationService"

import CustomSelect from "@/components/CustomSelect"


/* ============================================================
    RADIO CHIP (para método de envío)
============================================================ */
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


/* ============================================================
    CHECKOUT COMPLETO — MODO 1
============================================================ */
export default function Checkout() {
  usePageTitle("Checkout")

  const itemsObj = useCart((s) => s.items)
  const items = Object.values(itemsObj)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)
  const [shipMethod, setShipMethod] = useState<"standard" | "express">("standard")
  const shipping = shipMethod === "standard" ? 3990 : 6990
  const total = subtotal + (items.length ? shipping : 0)


  /* ============================================================
      DIRECCIONES
  ============================================================= */
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<number | "new" | null>(null)

  const [regions, setRegions] = useState<any[]>([])
  const [provinces, setProvinces] = useState<any[]>([])
  const [communes, setCommunes] = useState<any[]>([])

  const [regionId, setRegionId] = useState<number | null>(null)
  const [provinceId, setProvinceId] = useState<number | null>(null)
  const [communeId, setCommuneId] = useState<number | null>(null)
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [apartment, setApartment] = useState("")
  const [reference, setReference] = useState("")


  /* ============================================================
      USER DATA
  ============================================================= */
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (user) {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      setName(fullName)
      setEmail(user.email ?? "")
    }
  }, [user])


  /* ============================================================
      LOAD DATA
  ============================================================= */
  useEffect(() => {
    if (!user) return

    listAddresses().then((data) => {
      setAddresses(data)
      const def = data.find((a) => a.is_default)
      if (def) setSelectedAddress(def.id)
    })

    listRegions().then(setRegions)
  }, [user])

  useEffect(() => {
    if (!regionId) return
    listProvinces(regionId).then(setProvinces)
  }, [regionId])

  useEffect(() => {
    if (!provinceId) return
    listCommunes(provinceId).then(setCommunes)
  }, [provinceId])


  /* ============================================================
      VALIDACIÓN
  ============================================================= */
  const disabled = useMemo(() => {
    if (!name || !email || items.length === 0) return true

    if (selectedAddress && selectedAddress !== "new") return false

    return !street || !number || !regionId || !provinceId || !communeId
  }, [name, email, items.length, selectedAddress, street, number, regionId, provinceId, communeId])


  /* ============================================================
      PAGO
  ============================================================= */
  function handlePay() {
    let finalAddress: any = {}

    if (selectedAddress !== "new") {
      const addr = addresses.find((a) => a.id === selectedAddress)
      finalAddress = {
        address: `${addr.street} ${addr.number}`,
        city: addr.commune.name,
        region: addr.region.name,
        reference: addr.reference,
      }
    } else {
      finalAddress = {
        address: `${street} ${number} ${apartment}`,
        city: communes.find((c) => c.id === communeId)?.name || "",
        region: regions.find((r) => r.id === regionId)?.name || "",
        reference,
      }
    }

    useWebpay.getState().setData({
      amount: total,
      items,
      customer: {
        name,
        email,
        phone: "",
        ...finalAddress,
      },
    })

    navigate("/webpay/init")
  }


  /* ============================================================
      SI EL CARRITO ESTÁ VACÍO
  ============================================================= */
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-stone-700/50 bg-stone-900/70 p-6 text-center">
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


  /* ============================================================
      ESTILO COMPARTIDO PARA LOS RADIOS
  ============================================================= */
  const radioStyle =
    "flex items-center gap-3 p-3 rounded-lg bg-stone-800/60 border border-stone-700/60 hover:bg-stone-700/40 cursor-pointer transition"


  /* ============================================================
      PANTALLA PRINCIPAL
  ============================================================= */
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr,380px]">
      <div className="space-y-6">
        <Box title="Datos de envío">

          {/* Nombre + Email */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Nombre" value={name} onChange={setName} required />
            <Input label="Email" type="email" value={email} onChange={setEmail} required />
          </div>

          {/* DIRECCIÓN DE ENTREGA */}
          <h3 className="text-sm font-semibold mt-4 text-stone-300">Dirección de entrega</h3>

          <div className="mt-3 p-3 rounded-xl bg-stone-900/40 border border-stone-800 space-y-3">

            {/* DIRECCIONES GUARDADAS */}
            {addresses.length > 0 && (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label key={a.id} className={radioStyle}>
                    <input
                      type="radio"
                      checked={selectedAddress === a.id}
                      onChange={() => setSelectedAddress(a.id)}
                      className="accent-amber-500"
                    />
                    <div>
                      <p className="font-medium text-stone-200">
                        {a.street} {a.number}
                      </p>
                      <p className="text-xs text-stone-400">
                        {a.commune.name}, {a.province.name}, {a.region.name}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* RADIO NUEVA DIRECCIÓN */}
            <label className={radioStyle}>
              <input
                type="radio"
                checked={selectedAddress === "new"}
                onChange={() => setSelectedAddress("new")}
                className="accent-amber-500"
              />
              <span className="text-stone-300">Ingresar nueva dirección</span>
            </label>

          </div>

          {/* FORMULARIO NUEVA DIRECCIÓN */}
          {selectedAddress === "new" && (
            <div className="mt-4 space-y-3">
              <CustomSelect
                label="Región"
                options={regions}
                value={regionId}
                onChange={setRegionId}
              />

              {regionId && (
                <CustomSelect
                  label="Provincia"
                  options={provinces}
                  value={provinceId}
                  onChange={setProvinceId}
                />
              )}

              {provinceId && (
                <CustomSelect
                  label="Comuna"
                  options={communes}
                  value={communeId}
                  onChange={setCommuneId}
                />
              )}

              <Input label="Calle" value={street} onChange={setStreet} />
              <Input label="Número" value={number} onChange={setNumber} />
              <Input label="Depto / Casa (opcional)" value={apartment} onChange={setApartment} />
              <Input label="Referencia (opcional)" value={reference} onChange={setReference} />
            </div>
          )}


          {/* COSTO DE ENVÍO */}
          <div className="mt-5">
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


      {/* RESUMEN */}
      <aside className="h-fit rounded-2xl border border-stone-700/50 bg-stone-900/70 p-4 space-y-3">
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
          onClick={handlePay}
          className="w-full h-11 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center justify-center gap-2 hover:brightness-95 disabled:opacity-50"
        >
          <Lock className="size-4" />
          Pagar con WebPay
        </button>

        <Link to="/cart" className="block text-center text-sm text-amber-300 hover:text-amber-200">
          Volver al carrito
        </Link>
      </aside>
    </section>
  )
}


/* ============================================================
    COMPONENTES BASE
============================================================ */
function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-stone-900/70 p-4">
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