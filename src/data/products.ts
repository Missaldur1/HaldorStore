import type { Product } from "@/types/product"
import hoodieRunico from "@/assets/products/hoodie-runico.webp"
import otra from "@/assets/products/otra.webp"
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "hoodie-runico",
    name: "Hoodie Rúnico",
    price: 29990,
    currency: "CLP",
    image: hoodieRunico,
    category: "Ropa",
    stock: 25,
    rating: 4.7,
    featured: true, //para que aparezcan en destacados
    tags: ["invierno","runas"],
    description: "Hoodie grueso con motivo rúnico bordado.",
    longDescription: "Tejido pesado, interior suave. Silueta regular unisex.",
    material: "Algodón/Poliéster",
    color: "Negro carbón",
    origin: "Importado",
    images: [hoodieRunico] // si quieres, luego puedes agregar 2–3 más
  },
  {
    id: "p2",
    slug: "polera-longship",
    name: "Polera Longship",
    price: 14990,
    currency: "CLP",
    image: otra,
    category: "Ropa",
    stock: 40,
    rating: 4.5,
    featured: true,
    tags: ["verano","barco"]
  },
  {
    id: "p3",
    slug: "gorra-valknut",
    name: "Gorra Valknut",
    price: 9990,
    currency: "CLP",
    image: "https://source.unsplash.com/800x600/?cap,black,minimal",
    category: "Accesorios",
    stock: 60,
    rating: 4.4,
    featured: true,
    tags: ["valknut"]
  },
  {
    id: "p4",
    slug: "cinturon-forjado",
    name: "Cinturón Forjado",
    price: 12990,
    currency: "CLP",
    image: "https://source.unsplash.com/800x600/?leather,belt,craft",
    category: "Accesorios",
    stock: 18,
    rating: 4.3,
    featured: true
  },
  {
    id: "p5",
    slug: "botas-del-norte",
    name: "Botas del Norte",
    price: 49990,
    currency: "CLP",
    image: "https://source.unsplash.com/800x600/?boots,leather,brown",
    category: "Calzado",
    stock: 12,
    rating: 4.6,
    featured: true
  },
  {
    id: "p6",
    slug: "anillo-odin",
    name: "Anillo de Odín",
    price: 19990,
    currency: "CLP",
    image: "https://source.unsplash.com/800x600/?ring,silver,minimal",
    category: "Joyería",
    stock: 35,
    rating: 4.8,
    featured: true
  },
  {
    id: "p7",
    slug: "mochila-escudo",
    name: "Mochila Escudo",
    price: 25990,
    currency: "CLP",
    image: "https://source.unsplash.com/800x600/?backpack,black,urban",
    category: "Accesorios",
    stock: 22,
    rating: 4.2
  },
  {
    id: "p8",
    slug: "poster-midgard",
    name: "Póster Mapa de Midgard",
    price: 8990,
    currency: "CLP",
    image: "https://source.unsplash.com/800x600/?poster,map,wall",
    category: "Decoración",
    stock: 50,
    rating: 4.1
  }
]
