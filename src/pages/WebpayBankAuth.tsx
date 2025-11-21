import { useNavigate, useSearchParams } from "react-router-dom"
import bancoEstadoLogo from "@/assets/Logo_BancoEstado.svg"

export default function WebPayBankAuth() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const amountStr = params.get("amount") ?? "0"
  const amount = Number(amountStr) || 0

  function approve() {
    navigate(`/webpay/voucher?tx=TXN-3DS-OK&amount=${amount}`)
  }

  function reject() {
    navigate(`/webpay/voucher?failed=true&amount=${amount}`)
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-neutral-100 p-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm space-y-4">
        {/* Logo banco */}
        <img
          src={bancoEstadoLogo}
          alt="BancoEstado"
          className="h-10 mx-auto"
        />

        <h1 className="font-semibold text-center text-gray-800">
          Autenticación 3D Secure
        </h1>

        <p className="text-sm text-neutral-600 text-center">
          ¿Apruebas esta compra de{" "}
          <b>${amount.toLocaleString("es-CL")}</b>?
        </p>

        <div className="flex gap-2">
          <button
            onClick={approve}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg h-10 font-semibold transition"
          >
            Aprobar
          </button>
          <button
            onClick={reject}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg h-10 font-semibold transition"
          >
            Rechazar
          </button>
        </div>

        <p className="text-[11px] text-center text-neutral-400 mt-1">
          MODO SIMULACIÓN – No se realiza ningún cargo real.
        </p>
      </div>
    </div>
  )
}