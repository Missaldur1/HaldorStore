import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { listAll } from "@/services/productService"
import type { Product } from "@/types/product"
import { useCart } from "@/store/cart"
import { toast } from "sonner"
import { usePageTitle } from "@/hooks/useDocumentTitle"

const FALLBACK_IMG =
  "https://placehold.co/800x600/111315/ffffff?text=HaldorStore"

// pequeño hook para debounce
function useDebounced<T>(value: T, ms = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return debounced
}

type SortKey = "relevance" | "rating" | "priceAsc" | "priceDesc" | "nameAsc"

export default function Catalog() {
  usePageTitle("Catálogo")

  // URL params
  const [params, setParams] = useSearchParams()

  // UI state
  const [all, setAll] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // filtros desde query params
  const qParam = params.get("search") ?? ""
  const catParam = params.get("category") ?? "Todas"
  const minParam = params.get("min") ?? ""
  const maxParam = params.get("max") ?? ""
  const sortParam = (params.get("sort") as SortKey) ?? "relevance"
  const pageParam = parseInt(params.get("page") ?? "1", 10)

  // estados controlados
  const [query, setQuery] = useState(qParam)
  const debouncedQuery = useDebounced(query, 350)

  const [minPrice, setMinPrice] = useState(minParam)
  const [maxPrice, setMaxPrice] = useState(maxParam)
  const [sort, setSort] = useState<SortKey>(sortParam)

  // cargar productos
  useEffect(() => {
    listAll()
      .then(setAll)
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setLoading(false))
  }, [])

  // categorías derivadas desde category.name
  const categories = useMemo(() => {
    const set = new Set<string>(["Todas"])
    all.forEach((p) => set.add(p.category.name))
    return Array.from(set)
  }, [all])

  // aplicar filtros
  const filtered = useMemo(() => {
    const t = debouncedQuery.trim().toLowerCase()

    let arr = all.filter((p) => {
      const inCat =
        catParam === "Todas" ? true : p.category.name === catParam

      const inText =
        !t ||
        p.name.toLowerCase().includes(t) ||
        p.slug.toLowerCase().includes(t) ||
        p.category.name.toLowerCase().includes(t) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(t))

      const priceOk =
        (!minParam || p.price >= Number(minParam)) &&
        (!maxParam || p.price <= Number(maxParam))

      return inCat && inText && priceOk
    })

    // ordenar
    switch (sort) {
      case "rating":
        arr = arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break

      case "priceAsc":
        arr = arr.sort((a, b) => a.price - b.price)
        break

      case "priceDesc":
        arr = arr.sort((a, b) => b.price - a.price)
        break

      case "nameAsc":
        arr = arr.sort((a, b) => a.name.localeCompare(b.name))
        break

      case "relevance":
      default:
        arr = arr
          .map((p) => {
            const scoreText = t
              ? (p.name.toLowerCase().includes(t) ? 2 : 0) +
                (p.category.name.toLowerCase().includes(t) ? 1 : 0) +
                (p.tags?.some((tag) => tag.toLowerCase().includes(t)) ? 1 : 0)
              : 0

            return { p, score: scoreText * 10 + (p.rating ?? 0) }
          })
          .sort((a, b) => b.score - a.score)
          .map(({ p }) => p)
    }

    return arr
  }, [all, debouncedQuery, catParam, minParam, maxParam, sort])

  // paginación
  const PAGE_SIZE = 9
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, pageParam), pageCount)
  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  // sincronizar URL params
  useEffect(() => {
    const next = new URLSearchParams(params)

    if (debouncedQuery) next.set("search", debouncedQuery)
    else next.delete("search")

    if (catParam && catParam !== "Todas") next.set("category", catParam)
    else next.delete("category")

    if (minPrice) next.set("min", String(Number(minPrice)))
    else next.delete("min")

    if (maxPrice) next.set("max", String(Number(maxPrice)))
    else next.delete("max")

    if (sort !== "relevance") next.set("sort", sort)
    else next.delete("sort")

    next.set("page", String(page))

    setParams(next, { replace: true })
  }, [debouncedQuery, catParam, minPrice, maxPrice, sort, page])

  // cambiar categoría
  const setCategory = (c: string) => {
    const next = new URLSearchParams(params)
    if (c === "Todas") next.delete("category")
    else next.set("category", c)
    next.set("page", "1")
    setParams(next)
    setMobileOpen(false)
  }

  // aplicar precios
  const applyPrice = () => {
    const next = new URLSearchParams(params)
    minPrice
      ? next.set("min", String(Number(minPrice)))
      : next.delete("min")
    maxPrice
      ? next.set("max", String(Number(maxPrice)))
      : next.delete("max")
    next.set("page", "1")
    setParams(next)
    setMobileOpen(false)
  }

  // limpiar filtros
  const clearAll = () => {
    setQuery("")
    setMinPrice("")
    setMaxPrice("")
    setSort("relevance")
    setParams(new URLSearchParams())
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Catálogo</h1>

        {/* barra superior */}
        <div className="flex items-center gap-2">
          <div className="relative w-64 max-w-[70vw]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              placeholder="Buscar productos…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 pl-9 pr-3 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>

          <SortSelect sort={sort} onChange={setSort} />

          <button
            className="sm:hidden inline-flex items-center gap-2 h-10 rounded-lg border border-stone-700/60 px-3 text-sm hover:bg-white/10"
            onClick={() => setMobileOpen(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
          </button>
        </div>
      </header>

      {/* layout: filtros + grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4">
        <aside className="hidden lg:block">
          <FilterPanel
            categories={categories}
            selectedCategory={catParam}
            onSelectCategory={setCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            applyPrice={applyPrice}
            clearAll={clearAll}
            resultCount={filtered.length}
          />
        </aside>

        {/* grid de productos */}
        <div className="min-w-0">
          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : filtered.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <>
              <div className="text-xs text-stone-400 mb-2">
                {filtered.length} resultado
                {filtered.length !== 1 ? "s" : ""}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {pageCount > 1 && (
                <Pagination
                  page={page}
                  pageCount={pageCount}
                  onChange={(p) => {
                    const next = new URLSearchParams(params)
                    next.set("page", String(p))
                    setParams(next)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <MobileDrawer onClose={() => setMobileOpen(false)}>
          <FilterPanel
            categories={categories}
            selectedCategory={catParam}
            onSelectCategory={setCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            applyPrice={applyPrice}
            clearAll={clearAll}
            resultCount={filtered.length}
          />
        </MobileDrawer>
      )}
    </section>
  )
}

/* ============================================================
   Componentes auxiliares
============================================================ */

function SortSelect({
  sort,
  onChange,
}: {
  sort: SortKey
  onChange: (s: SortKey) => void
}) {
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none h-10 rounded-lg border border-stone-700/60 bg-stone-900/60 pl-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-amber-400/60"
      >
        <option value="relevance">Relevancia</option>
        <option value="rating">Más populares</option>
        <option value="priceAsc">Menor precio</option>
        <option value="priceDesc">Mayor precio</option>
        <option value="nameAsc">Nombre A–Z</option>
      </select>
      <ChevronDown className="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-stone-400" />
    </div>
  )
}

function FilterPanel({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  applyPrice,
  clearAll,
  resultCount,
}: {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (c: string) => void
  minPrice: string
  maxPrice: string
  setMinPrice: (v: string) => void
  setMaxPrice: (v: string) => void
  applyPrice: () => void
  clearAll: () => void
  resultCount: number
}) {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filtros</h2>
        <button
          onClick={clearAll}
          className="text-xs text-amber-300 hover:text-amber-200"
        >
          Limpiar todo
        </button>
      </div>

      {/* categorías */}
      <div>
        <div className="text-xs text-stone-400 mb-2">Categorías</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === selectedCategory
            return (
              <button
                key={c}
                onClick={() => onSelectCategory(c)}
                className={[
                  "rounded-full px-3 py-1 text-xs border",
                  active
                    ? "border-amber-400 bg-amber-500/10 text-amber-200"
                    : "border-stone-700/60 bg-stone-900/40 hover:bg-white/10",
                ].join(" ")}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* precio */}
      <div>
        <div className="text-xs text-stone-400 mb-2">Precio (CLP)</div>
        <div className="grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value.replace(/\D/g, ""))
            }
            className="h-10 rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 text-sm outline-none"
          />
          <input
            inputMode="numeric"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value.replace(/\D/g, ""))
            }
            className="h-10 rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 text-sm outline-none"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2 h-9 w-full rounded-lg bg-amber-500 text-black text-sm font-semibold hover:brightness-95"
        >
          Aplicar
        </button>
      </div>

      <div className="text-xs text-stone-400">Resultados: {resultCount}</div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [src, setSrc] = useState(product.image)
  const addItem = useCart((s) => s.addItem)

  return (
    <article className="group rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 overflow-hidden hover:border-amber-500/40">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative">
          <img
            src={src}
            alt={product.name}
            onError={() => setSrc(FALLBACK_IMG)}
            className="aspect-[4/3] w-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link
          to={`/product/${product.slug}`}
          className="font-semibold hover:underline"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-sm text-stone-300/90">
          {product.currency === "CLP"
            ? `$${product.price.toLocaleString("es-CL")}`
            : `$${product.price.toLocaleString("en-US")}`}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-black hover:brightness-95"
            onClick={() => {
              addItem(product, 1)
              toast.success("Agregado al carrito", {
                description: product.name,
              })
            }}
          >
            Agregar al carrito
          </button>

          <Link
            to={`/product/${product.slug}`}
            className="rounded-lg border border-stone-700/60 px-3 py-2 text-sm hover:bg-white/10"
          >
            Ver
          </Link>
        </div>
      </div>
    </article>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-stone-700/50 overflow-hidden"
        >
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

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-stone-700/50 bg-stone-900/70 p-6 text-center">
      <p className="text-sm text-stone-300/90">
        No encontramos resultados con esos filtros.
      </p>
      <button
        onClick={onClear}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95"
      >
        Limpiar filtros
      </button>
    </div>
  )
}

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (p: number) => void
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-stone-700/60 px-3 py-2 text-sm disabled:opacity-50 hover:bg-white/10"
      >
        <ChevronLeft className="size-4" />
        Anterior
      </button>

      <span className="text-xs text-stone-400 px-2">
        Página {page} de {pageCount}
      </span>

      <button
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-stone-700/60 px-3 py-2 text-sm disabled:opacity-50 hover:bg-white/10"
      >
        Siguiente
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

/* Drawer móvil */
function MobileDrawer({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 w-[85%] max-w-[320px] bg-gradient-to-b from-stone-900 to-slate-900 border-r border-stone-700/60 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-800/60">
          <h3 className="text-sm font-semibold">Filtros</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-stone-700/60 hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}