export type Product = {
  id: number | string
  slug: string
  name: string
  price: number
  currency: "CLP" | "USD"
  image: string

  category: {
    id: number
    name: string
    slug: string
  }

  stock: number
  rating?: number
  featured?: boolean
  tags?: string[]
  description?: string
  long_description?: string
  material?: string
  color?: string
  origin?: string
  images?: string[]
}