import { useAuthStore } from "@/store/authStore"

const BACKEND = "http://127.0.0.1:8000/api/locations"

/* ============================================================
   FIX GLOBAL PARA TOKEN — evita 401 por hidratación lenta
============================================================ */
async function getValidToken() {
  let token = useAuthStore.getState().access

  // Si no está listo, esperamos un poquito
  if (!token) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    token = useAuthStore.getState().access
  }

  return token
}

/* ============================================================
   HEADER DINÁMICO
============================================================ */
async function authHeaders() {
  const token = await getValidToken()

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  }
}

/* ============================================================
   REGIONES (no requiere token)
============================================================ */
export async function listRegions() {
  const res = await fetch(`${BACKEND}/regions/`)
  if (!res.ok) throw new Error("Error al cargar regiones")
  return res.json()
}

/* ============================================================
   PROVINCIAS (no requiere token)
============================================================ */
export async function listProvinces(regionId: number) {
  const res = await fetch(`${BACKEND}/provinces/?region=${regionId}`)
  if (!res.ok) throw new Error("Error al cargar provincias")
  return res.json()
}

/* ============================================================
   COMUNAS (no requiere token)
============================================================ */
export async function listCommunes(provinceId: number) {
  const res = await fetch(`${BACKEND}/communes/?province=${provinceId}`)
  if (!res.ok) throw new Error("Error al cargar comunas")
  return res.json()
}

/* ============================================================
   DIRECCIONES DEL USUARIO (CRUD) — requiere token
============================================================ */

// GET — listar direcciones del usuario
export async function listAddresses() {
  const headers = await authHeaders()

  const res = await fetch(`${BACKEND}/addresses/`, { headers })
  if (res.status === 401) {
    console.warn("Token no listo — se devolvió [] en lugar de error 401")
    return []
  }

  if (!res.ok) throw new Error("Error al cargar direcciones")
  return res.json()
}

// POST — crear dirección
export async function createAddress(payload: any) {
  const headers = await authHeaders()

  const res = await fetch(`${BACKEND}/addresses/`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error al crear dirección")

  return data
}

// PUT — editar dirección
export async function updateAddress(id: number, payload: any) {
  const headers = await authHeaders()

  const res = await fetch(`${BACKEND}/addresses/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error al actualizar dirección")

  return data
}

// DELETE — eliminar dirección
export async function deleteAddress(id: number) {
  const headers = await authHeaders()

  const res = await fetch(`${BACKEND}/addresses/${id}/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) throw new Error("Error al eliminar dirección")
  return true
}