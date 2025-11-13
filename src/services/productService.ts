import { PRODUCTS } from "@/data/products"
import type { Product } from "@/types/product"

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function listAll(): Promise<Product[]> {
  // simular red/latencia (opcional)
  await delay(200)
  return PRODUCTS
}

export async function listFeatured(limit = 6): Promise<Product[]> {
  await delay(200)
  const featured = PRODUCTS.filter(p => p.featured)
  return featured.slice(0, limit)
}

export async function getBySlug(slug: string): Promise<Product | undefined> {
  await delay(150)
  return PRODUCTS.find(p => p.slug === slug)
}

export async function searchByTerm(term: string): Promise<Product[]> {
  await delay(150)
  const t = term.trim().toLowerCase()
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(t) ||
    p.tags?.some(tag => tag.toLowerCase().includes(t))
  )
}
