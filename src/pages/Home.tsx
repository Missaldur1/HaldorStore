import { useEffect, useState } from "react"
import { listCategories } from "@/services/productService"
import { Link } from "react-router"
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Flame,
  Star,
  Mail,
  Phone,
  MapPin,
  Send
} from "lucide-react"
import { listFeatured } from "@/services/productService"
import type { Product } from "@/types/product"
import { useCart } from "@/store/cart"
import { toast } from "sonner"
import { usePageTitle } from "@/hooks/useDocumentTitle" 
// Imagen de portada local (colócala en public/images/hero/Hero.jpg)
const HERO_IMG = "/images/hero/Hero.jpg"

// Fallback si alguna imagen falla
const FALLBACK_IMG = "https://placehold.co/800x600/111315/ffffff?text=HaldorStore"

export default function Home() {
  usePageTitle("Inicio")
  return (
    <section className="space-y-10">
      <Hero />
      <UspStrip />
      <CategoryGrid />
      <ProductGrid />
      <PromoBanner />
      <Testimonials />
      <FAQ />
      <NewsletterSignup />
      <ContactSection />
    </section>
  )
}

/* ================= HERO ================= */

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/80 to-slate-900/80">
      {/* Imagen de fondo */}
      <img
        src={HERO_IMG}
        alt="Paisaje nórdico"
        referrerPolicy="no-referrer"
        className="absolute inset-0 size-full object-cover opacity-35"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 via-slate-900/50 to-stone-800/60" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />

      {/* Contenido */}
      <div className="relative px-6 py-16 sm:px-10 md:px-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs text-amber-200">
            <Flame className="size-3.5" /> Nueva temporada
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Forja tu estilo <span className="text-amber-400">nórdico</span>
          </h1>
          <p className="mt-3 text-stone-300/90 max-w-prose">
            Prendas y accesorios inspirados en el norte: calidad, simpleza y
            durabilidad con un toque vikingo moderno.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              Ver catálogo <ArrowRight className="size-4" />
            </Link>
            <a
              href="#destacados"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-500/70 bg-white/5 px-4 py-2 text-sm text-stone-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              Ver destacados
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= USPs ================= */

function UspStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Usp icon={<Truck className="size-5 text-amber-400" />} title="Envíos rápidos" text="A todo Chile" />
      <Usp icon={<ShieldCheck className="size-5 text-amber-400" />} title="Compras seguras" text="Pago protegido" />
      <Usp icon={<CreditCard className="size-5 text-amber-400" />} title="Múltiples medios de pago" text="Tarjetas y transferencias" />
      <Usp icon={<Flame className="size-5 text-amber-400" />} title="Ediciones limitadas" text="Drops seleccionados" />
    </div>
  )
}

function Usp({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="inline-grid size-9 place-items-center rounded-lg bg-stone-800/70 border border-stone-700/60">
          {icon}
        </span>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-stone-300/80">{text}</p>
        </div>
      </div>
    </div>
  )
}

/* ============== CATEGORÍAS RÁPIDAS ============== */

function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await listCategories()
        setCategories(cats)
      } catch (err) {
        console.error("Error cargando categorías:", err)
      }
    }

    fetchCategories()
  }, [])

  const targetCategories = ["Ropa", "Accesorios", "Calzado", "Joyería"]

  // Asegurar que todas las categorías tengan la propiedad href
  const displayCategories = categories.length > 0 
    ? categories
        .filter(cat => targetCategories.includes(cat.name))
        .slice(0, 4)
        .map(cat => ({
          ...cat,
          href: `/catalog?category=${cat.name}`,
          img: cat.image || "https://source.unsplash.com/800x600/?nordic,product"
        }))
    : [
        {
          name: "Ropa",
          href: "/catalog?category=Ropa",
          img: "https://source.unsplash.com/800x600/?nordic,hoodie,black"
        },
        {
          name: "Accesorios",
          href: "/catalog?category=Accesorios", 
          img: "https://source.unsplash.com/800x600/?leather,bracelet,black"
        },
        {
          name: "Calzado",
          href: "/catalog?category=Calzado",
          img: "https://source.unsplash.com/800x600/?boots,leather,brown"
        },
        {
          name: "Joyería", 
          href: "/catalog?category=Joyería",
          img: "https://source.unsplash.com/800x600/?ring,silver,minimal"
        }
      ]

  return (
    <section aria-labelledby="heading-cats">
      <h2 id="heading-cats" className="text-xl sm:text-2xl font-bold mb-4">
        Explora por categoría
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayCategories.map((c) => (
          <Link
            key={c.name}
            to={c.href}
            className="relative overflow-hidden rounded-xl border border-stone-700/50 group"
          >
            <img
              src={c.image || c.img}
              alt={c.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => { 
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG 
              }}
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] bg-stone-800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />
            <span className="absolute left-3 bottom-3 rounded-lg bg-white/10 backdrop-blur px-3 py-1 text-sm font-semibold">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ============== GRID DESTACADOS ============== */

function ProductGrid() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listFeatured(6)
      .then(setItems)
      .catch(() => setError("No se pudieron cargar los destacados"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-700/50 overflow-hidden">
            <div className="aspect-[4/3] w-full bg-stone-800/80 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-1/2 bg-stone-700/70 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-stone-700/60 rounded animate-pulse" />
              <div className="h-8 w-full bg-stone-700/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>
  }

  return (
    <section id="destacados" aria-labelledby="heading-destacados">
      <h2 id="heading-destacados" className="text-xl sm:text-2xl font-bold mb-4">
        Destacados
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [src, setSrc] = useState(product.image)
  const addItem = useCart((s) => s.addItem)

  return (
    <article className="group rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 overflow-hidden transition-colors hover:border-amber-500/40">
      <div className="relative">
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setSrc(FALLBACK_IMG)}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] bg-stone-800"
        />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="mt-1 text-sm text-stone-300/90">
          {product.currency === "CLP"
            ? `$${product.price.toLocaleString("es-CL")}`
            : `$${product.price.toLocaleString("en-US")}`}
        </p>

          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-black hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70 cursor-pointer"
            onClick={() => { addItem(product, 1)
            toast.success("Agregado al carrito", { description: product.name })
            
            }}
          >
            Agregar al carrito
          </button>
      </div>
    </article>
  )
}

/* ============== PROMO BANNER ============== */

function PromoBanner() {
  const BG = "https://source.unsplash.com/1600x400/?nordic,leather,forge"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-700/50">
      <img
        src={BG}
        alt="Promoción HaldorStore"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
        className="absolute inset-0 size-full object-cover opacity-20"
      />
      <div className="relative px-6 py-10 sm:px-10 md:px-16 bg-gradient-to-br from-stone-900/80 to-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">-15% en tu primera compra</h3>
            <p className="text-sm text-stone-300/90">Usa el código <span className="font-semibold text-amber-300">HALDOR15</span> al pagar.</p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
          >
            Comprar ahora <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />
    </div>
  )
}

/* ============== TESTIMONIOS ============== */

function Testimonials() {
  const items = [
    {
      name: "María G.",
      text: "La calidad del hoodie rúnico es increíble. Llegó rápido y el fit es perfecto.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=12"
    },
    {
      name: "Daniel R.",
      text: "Me encantó el estilo. Minimalista pero con carácter. Recomendados.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=32"
    },
    {
      name: "Constanza L.",
      text: "Compré unas botas, muy cómodas y el empaque, 10/10.",
      rating: 4,
      avatar: "https://i.pravatar.cc/100?img=5"
    }
  ]

  return (
    <section aria-labelledby="heading-testimonials">
      <h2 id="heading-testimonials" className="text-xl sm:text-2xl font-bold mb-4">
        Lo que dice la tribu
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <article
            key={t.name}
            className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="size-10 rounded-full object-cover bg-stone-800"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/80x80/111315/fff?text=+' }}
              />
              <div>
                <h4 className="text-sm font-semibold">{t.name}</h4>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < t.rating ? "text-amber-400" : "text-stone-500"}`}
                      fill={i < t.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-300/90">{t.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ============== FAQ ============== */

function FAQ() {
  const faqs = [
    {
      q: "¿Cuánto demora el envío?",
      a: "Entre 24 y 72 horas hábiles a regiones principales. Zonas extremas pueden tardar un poco más."
    },
    {
      q: "¿Puedo cambiar o devolver?",
      a: "Sí, dentro de 10 días por devoluciones y 30 días por cambios, con boleta y producto en buen estado."
    },
    {
      q: "¿Qué medios de pago aceptan?",
      a: "Tarjetas de crédito/débito y transferencias. Todos los pagos son procesados de forma segura."
    },
    {
      q: "¿Cómo cuido mis prendas?",
      a: "Lavar con agua fría, secar a la sombra y evitar planchar directamente sobre estampados."
    }
  ]

  return (
    <section aria-labelledby="heading-faq">
      <h2 id="heading-faq" className="text-xl sm:text-2xl font-bold mb-4">
        Preguntas frecuentes
      </h2>

      <div className="divide-y divide-stone-800/70 rounded-xl border border-stone-700/50 overflow-hidden">
        {faqs.map((f) => (
          <details key={f.q} className="group bg-gradient-to-b from-stone-900/60 to-slate-900/60 p-4 open:bg-stone-900/70">
            <summary className="cursor-pointer list-none text-sm font-semibold flex items-center justify-between">
              {f.q}
              <span className="ml-4 text-amber-300 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-stone-300/90">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ============== NEWSLETTER ============== */

function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [ok, setOk] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Aquí iría tu POST a backend / provider
    setOk(true)
  }

  return (
    <section aria-labelledby="heading-newsletter">
      <h2 id="heading-newsletter" className="text-xl sm:text-2xl font-bold mb-4">
        Únete a la tribu
      </h2>

      <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-5 sm:p-6">
        <p className="text-sm text-stone-300/90 max-w-prose">
          Novedades nórdicas, lanzamientos y descuentos exclusivos. Sin spam.
        </p>

        <form onSubmit={onSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
          <label htmlFor="newsletter" className="sr-only">Correo</label>
          <div className="relative flex-1">
            <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="newsletter"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="h-11 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 pl-9 pr-3 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-4 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center gap-2 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
          >
            <Send className="size-4" />
            Suscribirme
          </button>
        </form>

        {ok && (
          <p className="mt-3 text-sm text-amber-300">
            ¡Listo! Te llegará un correo de confirmación.
          </p>
        )}
      </div>
    </section>
  )
}

/* ============== CONTACTO + MAPA ============== */

function ContactSection() {
  const mapSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=-70.75%2C-33.6%2C-70.5%2C-33.35&layer=mapnik&marker=-33.45%2C-70.65"

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert("Mensaje enviado (demo). Aquí conectaríamos con tu backend o servicio de correo.")
  }

  return (
    <section aria-labelledby="heading-contact">
      <h2 id="heading-contact" className="text-xl sm:text-2xl font-bold mb-4">
        Contacto
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mapa */}
        <div className="overflow-hidden rounded-xl border border-stone-700/50 bg-stone-900/60">
          <div className="aspect-[16/9]">
            <iframe
              title="Mapa HaldorStore - Santiago, Chile"
              src={mapSrc}
              className="size-full"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-3 text-xs text-stone-300/80">
            Ver en{" "}
            <a
              href="https://www.openstreetmap.org/?mlat=-33.45&mlon=-70.65#map=12/-33.45/-70.65"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-amber-300"
            >
              OpenStreetMap
            </a>
          </div>
        </div>

        {/* Datos + mini formulario */}
        <div className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-5 sm:p-6">
          <ul className="space-y-2 text-sm text-stone-300/90">
            <li className="flex items-center gap-2"><MapPin className="size-4 text-amber-400" /> Santiago, Chile</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-amber-400" /> <a href="tel:+56900000000" className="hover:text-amber-300">+56 9 0000 0000</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-amber-400" /> <a href="mailto:hola@haldor.store" className="hover:text-amber-300">hola@haldor.store</a></li>
          </ul>

          <form onSubmit={onSubmit} className="mt-4 space-y-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Tu nombre"
                required
                className="h-11 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400/60"
              />
              <input
                type="email"
                placeholder="Tu correo"
                required
                className="h-11 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400/60"
              />
            </div>
            <textarea
              placeholder="Tu mensaje"
              rows={4}
              required
              className="w-full rounded-lg border border-stone-700/60 bg-stone-900/60 p-3 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400/60"
            />
            <button
              type="submit"
              className="h-11 px-4 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center gap-2 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70 cursor-pointer"
            >
              <Send className="size-4" />
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
