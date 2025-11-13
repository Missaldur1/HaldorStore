import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react"
import { getBySlug, listAll } from "@/services/productService"
import type { Product } from "@/types/product"
import { useCart } from "@/store/cart"
import { toast } from "sonner"
import { usePageTitle } from "@/hooks/useDocumentTitle"

const FALLBACK_IMG = "https://placehold.co/800x600/111315/ffffff?text=HaldorStore"

export default function ProductDetail() {
  const { slug = "" } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle(
    product?.name
    ?`${product.name}`
    : error
      ? "Producto no encontrado"
      : "Producto"
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const p = await getBySlug(slug)
        if (!mounted) return
        if (!p) {
          setError("Producto no encontrado")
          setLoading(false)
          return
        }
        setProduct(p)
        const all = await listAll()
        if (!mounted) return
        // relacionados por categoría (excluye el actual)
        const rel = all.filter(x => x.category === p.category && x.slug !== p.slug).slice(0, 6)
        setRelated(rel)
      } catch {
        if (mounted) setError("No se pudo cargar el producto")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [slug])

  if (loading) return <Skeleton />
  if (error || !product) return <NotFoundBlock />

  return (
    <section className="space-y-8">
      <Breadcrumb product={product} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Gallery image={product.image} name={product.name} id={product.id} />
        <InfoPanel product={product} />
      </div>

      <DetailsTabs product={product} />

      {related.length > 0 && (
        <RelatedGrid items={related} />
      )}
    </section>
  )
}

/* ---------------- Auxiliares ---------------- */

function Breadcrumb({ product }: { product: Product }) {
  return (
    <nav aria-label="breadcrumbs" className="text-xs text-stone-400">
      <Link to="/" className="hover:text-amber-300">Inicio</Link>
      <span className="mx-2">/</span>
      <Link to="/catalog" className="hover:text-amber-300">Catálogo</Link>
      <span className="mx-2">/</span>
      <Link to={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-amber-300">
        {product.category}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-stone-200">{product.name}</span>
    </nav>
  )
}

function Gallery({ image, name, id }: { image: string; name: string; id: string }) {
  // genera 3–4 imágenes: si es Unsplash, variamos ?sig=; si es local, repetimos
  const images = useMemo(() => {
    const arr = [image]
    const isRemote = /^https?:\/\//.test(image)
    const base = image + (image.includes("?") ? "&" : "?")
    for (let i = 2; i <= 4; i++) {
      arr.push(isRemote ? `${base}sig=${id}-${i}` : FALLBACK_IMG)
    }
    return Array.from(new Set(arr)) // evita duplicados
  }, [image, id])

  const [current, setCurrent] = useState(images[0])

  useEffect(() => {
    setCurrent(images[0])
  }, [images])

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-stone-700/50 bg-stone-900/60">
        <img
          src={current}
          alt={name}
          className="aspect-[4/3] w-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
        />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(src)}
            className={[
              "relative overflow-hidden rounded-lg border",
              src === current
                ? "border-amber-400"
                : "border-stone-700/60 hover:border-stone-500/80"
            ].join(" ")}
          >
            <img
              src={src}
              alt={`${name} ${i + 1}`}
              className="aspect-square w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function InfoPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const addItem = useCart((s) => s.addItem)

  const priceText =
    product.currency === "CLP"
      ? `$${product.price.toLocaleString("es-CL")}`
      : `$${product.price.toLocaleString("en-US")}`

  const stockLabel =
    product.stock > 10 ? "Disponible" :
    product.stock > 0  ? "Pocas unidades" :
                         "Agotado"

  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-5 sm:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">{product.name}</h1>

      <div className="mt-2 flex items-center gap-3">
        <Stars rating={product.rating ?? 0} />
        <span className="text-xs text-stone-400">({product.rating?.toFixed(1) ?? "—"})</span>
        <span className="ml-auto text-xs rounded-full border px-2 py-0.5
          border-stone-700/60 bg-stone-900/50">
          {stockLabel}
        </span>
      </div>

      <div className="mt-4 text-3xl font-extrabold text-amber-300">{priceText}</div>

      <p className="mt-3 text-sm text-stone-300/90">
        {product.description ?? "Diseño nórdico moderno, materiales duraderos y terminaciones de calidad."}
      </p>

      {/* cantidad + CTAs */}
      <div className="mt-5 flex items-center gap-2">
        <div className="inline-flex items-center rounded-lg border border-stone-700/60">
          <button
            type="button"
            aria-label="Disminuir"
            className="h-10 w-9 hover:bg-white/10"
            onClick={() => setQty(q => Math.max(1, q - 1))}
          >−</button>
          <input
            aria-label="Cantidad"
            value={qty}
            onChange={(e) => {
              const v = parseInt(e.target.value || "1", 10)
              setQty(Number.isNaN(v) ? 1 : Math.max(1, v))
            }}
            className="h-10 w-12 bg-transparent text-center outline-none"
            inputMode="numeric"
          />
          <button
            type="button"
            aria-label="Aumentar"
            className="h-10 w-9 hover:bg-white/10"
            onClick={() => setQty(q => q + 1)}
          >+</button>
        </div>

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

      {/* ventajas */}
      <ul className="mt-5 grid gap-2 sm:grid-cols-3 text-xs text-stone-300/90">
        <li className="flex items-center gap-2">
          <Truck className="size-4 text-amber-400" /> Envíos rápidos
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-amber-400" /> Pago protegido
        </li>
        <li className="flex items-center gap-2">
          <RefreshCcw className="size-4 text-amber-400" /> Cambios y devoluciones
        </li>
      </ul>
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < Math.round(rating) ? "text-amber-400" : "text-stone-500"}`}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  )
}

function DetailsTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<"desc" | "specs" | "envio">("desc")

  return (
    <div className="rounded-2xl border border-stone-700/50 overflow-hidden">
      {/* tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-stone-700/60 bg-gradient-to-b from-stone-900/70 to-slate-900/70 px-3 py-2">
        <TabBtn active={tab === "desc"} onClick={() => setTab("desc")}>Descripción</TabBtn>
        <TabBtn active={tab === "specs"} onClick={() => setTab("specs")}>Especificaciones</TabBtn>
        <TabBtn active={tab === "envio"} onClick={() => setTab("envio")}>Envío y cambios</TabBtn>
      </div>

      <div className="bg-gradient-to-b from-stone-900/60 to-slate-900/60 p-4">
        {tab === "desc" && (
          <p className="text-sm text-stone-300/90 max-w-prose">
            {product.longDescription ??
              "Inspirado en el norte: pieza pensada para durar, con enfoque en confort y acabados. Ideal para el día a día con un carácter minimalista y vikingo moderno."}
          </p>
        )}
        {tab === "specs" && (
          <ul className="text-sm text-stone-300/90 grid sm:grid-cols-2 gap-2">
            <li>Material: {product.material ?? "Algodón/Poliéster"}</li>
            <li>Color: {product.color ?? "Negro carbón"}</li>
            <li>Origen: {product.origin ?? "Importado"}</li>
            <li>Cuidado: Lavar en frío, secar a la sombra</li>
          </ul>
        )}
        {tab === "envio" && (
          <ul className="text-sm text-stone-300/90 list-disc pl-5 space-y-1">
            <li>Despachos entre 24 y 72 hrs hábiles a regiones principales.</li>
            <li>Cambios 30 días; devoluciones 10 días con boleta y producto en buen estado.</li>
            <li>Pago seguro con tarjetas y transferencias.</li>
          </ul>
        )}
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-lg px-3 py-1.5 text-sm border",
        active
          ? "border-amber-400 bg-amber-500/10 text-amber-200"
          : "border-stone-700/60 bg-stone-900/40 hover:bg-white/10"
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function RelatedGrid({ items }: { items: Product[] }) {
  return (
    <section aria-labelledby="heading-rel">
      <h2 id="heading-rel" className="text-xl sm:text-2xl font-bold mb-3">Relacionados</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(p => <RelatedCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}

function RelatedCard({ product }: { product: Product }) {
  const [src, setSrc] = useState(product.image)
  const priceText =
    product.currency === "CLP"
      ? `$${product.price.toLocaleString("es-CL")}`
      : `$${product.price.toLocaleString("en-US")}`

  return (
    <article className="group rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 overflow-hidden transition-colors hover:border-amber-500/40">
      <Link to={`/product/${product.slug}`} className="block">
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
          <div className="font-semibold group-hover:underline">{product.name}</div>
          <div className="mt-1 text-sm text-stone-300/90">{priceText}</div>
        </div>
      </Link>
    </article>
  )
}

function Skeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-stone-700/50 overflow-hidden">
        <div className="aspect-[4/3] w-full bg-stone-800/80 animate-pulse" />
        <div className="grid grid-cols-4 gap-2 p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-stone-800/70 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-stone-700/50 p-6 space-y-3">
        <div className="h-6 w-3/4 bg-stone-700/60 rounded animate-pulse" />
        <div className="h-6 w-1/3 bg-stone-700/60 rounded animate-pulse" />
        <div className="h-10 w-full bg-stone-700/60 rounded animate-pulse" />
        <div className="h-24 w-full bg-stone-700/50 rounded animate-pulse" />
      </div>
    </div>
  )
}

function NotFoundBlock() {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-6 text-center">
      <p className="text-sm text-stone-300/90">No encontramos este producto.</p>
      <Link
        to="/catalog"
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>
    </div>
  )
}
