import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { simulateCharge, luhnOk } from "@/services/fakePayment"
import { Lock } from "lucide-react"
import { toast } from "sonner"
import webpayLogo from "@/assets/1.WebpayPlus_FB_800px.svg"
import { useWebpay } from "@/store/webpay"

export default function WebPayInit() {
  const navigate = useNavigate()
  const wp = useWebpay()
  const amount = wp.amount

  const [card, setCard] = useState("")
  const [exp, setExp] = useState("")
  const [cvc, setCvc] = useState("")
  const [loading, setLoading] = useState(false)

  // Formatear número de tarjeta
  function formatCard(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  // Formatear expiración MM/YY
  function formatExp(value: string) {
    let digits = value.replace(/\D/g, "")
    if (digits.length >= 3) {
      digits = digits.slice(0, 2) + "/" + digits.slice(2, 4)
    }
    return digits.slice(0, 5)
  }

  async function handlePay() {
    if (!luhnOk(card.replace(/\s/g, ""))) {
      toast.error("Número de tarjeta inválido")
      return
    }
    setLoading(true)
    const clean = card.replace(/\s/g, "")
    const [mm, yy] = exp.split("/")
    const result = await simulateCharge({
      amount,
      currency: "CLP",
      cardNumber: clean,
      expMonth: mm,
      expYear: yy,
      cvc
    })
    setLoading(false)

    if (result.status === "requires_action") {
      // 🔹 Pasamos el monto a la pantalla de banco
      navigate(`/webpay/bank-auth?amount=${amount}`)
      return
    }

    if (result.status === "declined" || result.status === "error") {
      toast.error(result.message ?? "Pago rechazado")
      return
    }

    // 🔹 Pasamos monto + tx al voucher
    navigate(`/webpay/voucher?tx=${result.transactionId}&amount=${amount}`)
  }

  const testCards = [
    { num: "4242 4242 4242 4242", label: "Éxito", exp: "12/29", cvc: "123" },
    { num: "4000 0000 0000 0002", label: "Rechazo", exp: "10/28", cvc: "321" },
    { num: "4000 0000 0000 0127", label: "Fondos", exp: "08/30", cvc: "444" },
    { num: "4000 0000 0000 9995", label: "3DS", exp: "02/31", cvc: "222" },
  ]

  return (
    <div className="min-h-screen bg-white flex justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <img src={webpayLogo} alt="WebPay Plus" className="h-10 mx-auto" />
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Pago con Tarjeta
        </h1>

        <div className="border rounded-xl p-5 shadow-sm bg-white space-y-4">
          <div className="text-sm text-neutral-600">
            Monto a pagar:{" "}
            <span className="font-bold">
              ${amount.toLocaleString("es-CL")}
            </span>
          </div>

          {/* Número de tarjeta */}
          <div>
            <label className="text-sm text-neutral-700">Número de tarjeta</label>
            <input
              value={card}
              onChange={(e) => setCard(formatCard(e.target.value))}
              placeholder="XXXX XXXX XXXX XXXX"
              className="mt-1 w-full border rounded-lg p-2 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Exp + CVC */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-neutral-700">Exp</label>
              <input
                value={exp}
                onChange={(e) => setExp(formatExp(e.target.value))}
                placeholder="MM/YY"
                className="mt-1 w-full border rounded-lg p-2 text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-700">CVC</label>
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                placeholder="123"
                className="mt-1 w-full border rounded-lg p-2 text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-[#006edc] text-white h-11 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {loading ? "Procesando..." : <Lock className="size-4" />}
            {loading ? "" : "Pagar con WebPay"}
          </button>
        </div>

        <p className="text-xs text-center text-neutral-400">
          MODO SIMULACIÓN – Este pago no es real.
        </p>

        {/* Botones rápidos para tarjetas de prueba */}
        <div className="flex flex-wrap gap-2 justify-center text-center">
          {testCards.map((t) => (
            <button
              key={t.num}
              onClick={() => {
                setCard(t.num)
                setExp(t.exp)
                setCvc(t.cvc)
              }}
              className="px-3 py-1 text-xs rounded border text-gray-600 hover:bg-gray-100 transition"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}