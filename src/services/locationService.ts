import { useAuthStore } from "@/store/authStore"

const BACKEND = "http://127.0.0.1:8000/api/locations"

// Helper para headers autenticados

function authHeaders() {
  const token = useAuthStore.getState().access

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  }
}

/* ============================================================
   REGIONES
============================================================ */
export async function listRegions() {
  const res = await fetch(`${BACKEND}/regions/`)
  if (!res.ok) throw new Error("Error al cargar regiones")
  return res.json()
}

/* ============================================================
   PROVINCIAS (dependen de region)
============================================================ */
export async function listProvinces(regionId: number) {
  const res = await fetch(`${BACKEND}/provinces/?region=${regionId}`)
  if (!res.ok) throw new Error("Error al cargar provincias")
  return res.json()
}

/* ============================================================
   COMUNAS (dependen de provincia o región)
============================================================ */
export async function listCommunes(provinceId: number) {
  const res = await fetch(`${BACKEND}/communes/?province=${provinceId}`)
  if (!res.ok) throw new Error("Error al cargar comunas")
  return res.json()
}

/* ============================================================
   DIRECCIONES DEL USUARIO (CRUD)
============================================================ */

// GET — listar direcciones del usuario
export async function listAddresses() {
  const res = await fetch(`${BACKEND}/addresses/`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Error al cargar direcciones")
  return res.json()
}

// POST — crear dirección
export async function createAddress(payload: any) {
  const res = await fetch(`${BACKEND}/addresses/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error al crear dirección")
  return data
}

// PUT — editar dirección
export async function updateAddress(id: number, payload: any) {
  const res = await fetch(`${BACKEND}/addresses/${id}/`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error al actualizar dirección")
  return data
}

// DELETE — eliminar dirección
export async function deleteAddress(id: number) {
  const res = await fetch(`${BACKEND}/addresses/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Error al eliminar dirección")
  return true
}