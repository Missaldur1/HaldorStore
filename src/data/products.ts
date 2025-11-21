import type { Product } from "@/types/product"
import hoodieRunico from "@/assets/products/hoodie-runico.webp"
import bts_vik from "@/assets/products/bts_vik.webp"
import gorra_valknut from "@/assets/products/gorra_valknut.webp"
import anillo_odin from "@/assets/products/anillo_odin.webp"
import cinturon_vikingo from "@/assets/products/cinturon_vikingo.webp"
import polera_barco from "@/assets/products/polera_barco.jpeg"
import moch_vik from "@/assets/products/moch_vik.jpg"
import mapa_midgard from "@/assets/products/mapa_midgard.jpg"
import bolsa_vikinga from "@/assets/products/bolsa_vikinga.jpg"

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
    tags: ["invierno", "runas"],
    description: "Hoodie grueso con motivo rúnico bordado.",
    longDescription: "Tejido pesado, interior suave. Silueta regular unisex.",
    material: "Algodón/Poliéster",
    color: "Negro carbón",
    origin: "Importado",
    images: [hoodieRunico] // para agregar 2-3 más
  },
  {
    id: "p2",
    slug: "polera-longship",
    name: "Polera Longship",
    price: 14990,
    currency: "CLP",
    image: polera_barco,
    category: "Ropa",
    stock: 40,
    rating: 4.5,
    featured: true,
    tags: ["verano", "barco"],
    description: "Polera longship con acabados nordicos y estampado de alta calidad"
  },
  {
    id: "p3",
    slug: "gorra-valknut",
    name: "Gorra Valknut",
    price: 9990,
    currency: "CLP",
    image: gorra_valknut,
    category: "Accesorios",
    stock: 59,
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
    image: cinturon_vikingo,
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
    image: bts_vik,
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
    image: anillo_odin,
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
    image: moch_vik,
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
    image: mapa_midgard,
    category: "Decoración",
    stock: 50,
    rating: 4.0,
    longDescription: "Mapa inspirado en las leyendas sobre Midgard.",
    material: "Papel fotográfico",
    color: "Mapa Midgard",
    origin: "Creación propia"
  },
  {
    id: "p9",
    slug: "bolsa-vikinga",
    name: "Bolsa de Olaf",
    price: 9990,
    currency: "CLP",
    image: bolsa_vikinga,
    category: "Accesorios",
    stock: 10,
    rating: 3.2,
    description: "Bolsa resistente inspirada en el estilo de los viajeros vikingos.",
    longDescription: "Bolsa estilo rústico con detalles nórdicos, ideal para llevar objetos personales. Inspirada en Olaf, uno de los exploradores más representados en las sagas escandinavas. Material resistente, liviana y de uso diario.",
    material: "Lona reforzada y cuero sintético",
    color: "Marrón envejecido",
    origin: "Creación propia"
  }
]
