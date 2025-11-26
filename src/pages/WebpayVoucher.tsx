import { Link, useSearchParams } from "react-router-dom"
import { useWebpay } from "@/store/webpay"
import { useOrders } from "@/store/orders"
import { useCart } from "@/store/cart"
import webpayLogo from "@/assets/1.WebpayPlus_FB_800px.svg"
import { useEffect } from "react"

export default function WebPayVoucher() {
  const [params] = useSearchParams()
  const wp = useWebpay()
  const addOrder = useOrders((s) => s.create)
  const clearCart = useCart((s) => s.clear)

  const tx = params.get("tx")
  const failed = params.get("failed")

  // Intentar leer monto desde URL (simulación)
  const amountFromParams = Number(params.get("amount") ?? "0")
  const effectiveAmount =
    (!Number.isNaN(amountFromParams) && amountFromParams > 0
      ? amountFromParams
      : wp.amount) || 0

  /* ============================================================
        FIX ANTI-DUPLICADOS — A PRUEBA DE TODO
  ============================================================ */
  useEffect(() => {
    // Si no hay transacción o está fallida, no crear orden
    if (!tx || failed) return

    // Evita duplicación: si esta transacción YA fue procesada → no repetir
    const lastTx = localStorage.getItem("wp_last_tx")
    if (lastTx === tx) return

    // Crear orden
    const subtotal = wp.items.reduce((a, it) => a + it.price * it.qty, 0)
    const total = effectiveAmount || subtotal
    const shipping = Math.max(0, total - subtotal)

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase()

    addOrder({
      id: orderId,
      createdAt: Date.now(),
      currency: "CLP",
      items: wp.items,
      subtotal,
      shipping,
      total,
      customer: wp.customer,
      payment: {
        transactionId: tx,
        method: "card",
        last4: "0000",
      },
      status: "paid",
    })

    // Marcar la transacción como ya procesada
    localStorage.setItem("wp_last_tx", tx)

    // Limpiar datos temporales
    clearCart()
    wp.clear()
  }, [tx, failed]) // Solo depende de tx y failed, nada más.

  /* ============================================================
        UI
  ============================================================ */
  return (
    <div className="min-h-screen bg-white flex justify-center p-6">
      <div className="w-full max-w-lg border rounded-xl shadow p-6 space-y-6 bg-white">
        
        {/* Logo WebPay */}
        <img src={webpayLogo} alt="WebPay Plus" className="h-10 mx-auto" />

        {/* Título */}
        <h1 className="text-xl font-semibold text-center text-gray-800">
          {failed ? "Pago Rechazado" : "Voucher de Pago"}
        </h1>

        {/* Detalle del voucher */}
        <div className="rounded-lg border p-4 bg-gray-50 space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Monto</span>
            <span className="font-bold text-gray-900">
              ${effectiveAmount.toLocaleString("es-CL")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Estado</span>
            <span
              className={
                failed
                  ? "text-red-600 font-bold"
                  : "text-green-600 font-bold"
              }
            >
              {failed ? "Rechazado" : "Aprobado"}
            </span>
          </div>

          {!failed && tx && (
            <div className="flex justify-between">
              <span className="font-medium">ID Transacción</span>
              <span className="text-gray-900">{tx}</span>
            </div>
          )}
        </div>

        {/* Botones */}
        <Link
          to="/"
          className="block text-center bg-[#006edc] hover:bg-[#005bb8] text-white rounded-lg py-2 font-semibold transition"
        >
          Volver al comercio
        </Link>

        <Link
          to="/orders"
          className="block text-center text-sm text-[#006edc] hover:underline"
        >
          Ver mis pedidos
        </Link>

        {/* Modo simulación */}
        <p className="text-xs text-center text-neutral-400">
          MODO SIMULACIÓN – Este pago no es real.
        </p>
      </div>
    </div>
  )
}