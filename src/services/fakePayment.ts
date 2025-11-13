export type ChargeInput = {
  amount: number
  currency: "CLP" | "USD"
  cardNumber: string
  expMonth: string // "MM"
  expYear: string  // "YY" o "YYYY"
  cvc: string
  threeDSResult?: "approved" | "declined"
}

export type ChargeResult = {
  status: "succeeded" | "declined" | "requires_action" | "error"
  code?: string
  message?: string
  transactionId?: string
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export function luhnOk(num: string) {
  const s = (num || "").replace(/\D/g, "")
  let sum = 0, dbl = false
  for (let i = s.length - 1; i >= 0; i--) {
    let d = Number(s[i])
    if (dbl) { d *= 2; if (d > 9) d -= 9 }
    sum += d; dbl = !dbl
  }
  return s.length >= 12 && sum % 10 === 0
}

export async function simulateCharge(input: ChargeInput): Promise<ChargeResult> {
  const { cardNumber, expMonth, expYear, cvc, amount, threeDSResult } = input
  await delay(1200) // latencia de red

  const num = (cardNumber || "").replace(/\s+/g, "")
  const year = expYear.length === 2 ? "20" + expYear : expYear
  const exp = new Date(Number(year), Number(expMonth) - 1, 1)
  const now = new Date()
  exp.setMonth(exp.getMonth() + 1) // fin de mes de expiración

  if (!luhnOk(num)) {
    return { status: "error", code: "invalid_number", message: "Número de tarjeta inválido." }
  }
  if (!/^\d{3,4}$/.test(cvc)) {
    return { status: "error", code: "invalid_cvc", message: "CVC inválido." }
  }
  if (exp <= now) {
    return { status: "error", code: "expired_card", message: "Tarjeta expirada." }
  }
  if (amount <= 0) {
    return { status: "error", code: "amount_error", message: "Monto inválido." }
  }

  // Casos de prueba (tipo Stripe) para simular escenarios
  if (num === "4000000000000002") {
    return { status: "declined", code: "card_declined", message: "Tarjeta rechazada." }
  }
  if (num === "4000000000000127") {
    return { status: "declined", code: "insufficient_funds", message: "Fondos insuficientes." }
  }
  if (num === "4000000000000069") {
    return { status: "error", code: "expired_card", message: "Tarjeta expirada." }
  }
  if (num === "4000000000009995") {
    // Requiere 3DS
    if (!threeDSResult) {
      return { status: "requires_action", code: "three_d_secure", message: "Autenticación requerida." }
    }
    if (threeDSResult === "declined") {
      return { status: "declined", code: "authentication_failed", message: "Autenticación fallida." }
    }
    // approved sigue abajo como success
  }

  // Éxito genérico (incluye 4242... etc.)
  return {
    status: "succeeded",
    transactionId: "txn_" + Math.random().toString(36).slice(2).toUpperCase()
  }
}
