import type { Product } from "@/types/product"

const BACKEND_HOST = "http://127.0.0.1:8000"
const API_URL = `${BACKEND_HOST}/api/catalog`

async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`)
  if (!res.ok) {
    throw new Error(`Error al consultar ${endpoint}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Normalizador productos
function normalizeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    rating: p.rating ? Number(p.rating) : 0,
    image: p.image
      ? (p.image.startsWith("http")
          ? p.image
          : `${BACKEND_HOST}${p.image}`)
      : "",
    category: p.category,
  }
}

// Normalizador categoría
function normalizeCategory(c: any) {
  return {
    ...c,
    image: c.image
      ? (c.image.startsWith("http")
          ? c.image
          : `${BACKEND_HOST}${c.image}`)
      : null,
  }
}


/* ================================================================
   LISTAR TODAS LAS CATEGORÍAS
================================================================ */
export async function listCategories() { {
  const res = await apiGet<any[]>("/categories/")
  return res.map(normalizeCategory)
} }

/* ================================================================
   LISTAR TODOS LOS PRODUCTOS
================================================================ */
export async function listAll(): Promise<Product[]> {
  const res = await apiGet<any[]>("/products/")
  return res.map(normalizeProduct)
}

/* ================================================================
   LISTAR DESTACADOS
================================================================ */
export async function listFeatured(limit = 6): Promise<Product[]> {
  const res = await apiGet<any[]>("/products/?featured=true")
  return res.map(normalizeProduct).slice(0, limit)
}

/* ================================================================
   OBTENER PRODUCTO POR SLUG
================================================================ */
export async function getBySlug(slug: string): Promise<Product | undefined> {
  try {
    const p = await apiGet<any>(`/products/${slug}/`)
    return normalizeProduct(p)
  } catch {
    return undefined
  }
}

/* ================================================================
   BUSCAR POR TEXTO
================================================================ */
export async function searchByTerm(term: string): Promise<Product[]> {
  const all = await listAll()
  const t = term.trim().toLowerCase()

  return all.filter((p) =>
    p.name.toLowerCase().includes(t) ||
    p.category.name.toLowerCase().includes(t) ||
    p.slug.toLowerCase().includes(t)
  )
}