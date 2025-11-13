// src/types/product.ts
export type Product = {
  id: string
  slug: string
  name: string
  price: number
  currency: "CLP" | "USD"
  image: string
  category: string
  stock: number
  rating?: number
  featured?: boolean
  tags?: string[]

  // ---- campos opcionales para la ficha ----
  description?: string
  longDescription?: string
  material?: string
  color?: string
  origin?: string

  // opcional: si algún día quieres galería real
  images?: string[]
}
