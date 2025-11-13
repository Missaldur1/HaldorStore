import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Skull, Home, ArrowLeft, Search, Compass } from "lucide-react"
import { usePageTitle } from "@/hooks/useDocumentTitle"

const FALLBACK_BG = "https://placehold.co/1600x600/111315/ffffff?text=HaldorStore"

export default function NotFound() {
  usePageTitle("Not Found")
  const [q, setQ] = useState("")
  const navigate = useNavigate()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    navigate(`/catalog?search=${encodeURIComponent(term)}`)
  }

  const chips = [
    { label: "Ropa", href: "/catalog?category=Ropa" },
    { label: "Accesorios", href: "/catalog?category=Accesorios" },
    { label: "Calzado", href: "/catalog?category=Calzado" },
    { label: "Joyería", href: "/catalog?category=Joyería" },
  ]

  return (
    <section className="relative overflow-hidden rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/80 to-slate-900/80">
      {/* Fondo decorativo opcional */}
      <img
        src="/images/hero/About.jpg"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_BG }}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-10"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />

      {/* Contenido */}
      <div className="relative px-6 py-14 sm:px-10 md:px-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="inline-grid size-14 place-items-center rounded-xl bg-stone-800/70 border border-stone-700/60">
            <Skull className="size-7 text-amber-400" />
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            404 <span className="text-amber-400">|</span> Ruta extraviada
          </h1>
          <p className="mt-2 text-stone-300/90">
            No encontramos lo que buscas. Puedes volver al inicio o explorar nuestro catálogo.
          </p>

          {/* Buscador */}
          <form onSubmit={onSubmit} className="mt-6 flex items-center gap-2">
            <label htmlFor="q" className="sr-only">Buscar en catálogo</label>
            <div className="relative flex-1">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar productos…"
                className="h-11 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 pl-9 pr-3 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400/60"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-4 rounded-lg bg-amber-500 text-black text-sm font-semibold inline-flex items-center gap-2 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              <Compass className="size-4" />
              Buscar
            </button>
          </form>

          {/* Acciones rápidas */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-600/70 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              <ArrowLeft className="size-4" />
              Volver
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              <Home className="size-4" />
              Ir al inicio
            </Link>
          </div>

          {/* Chips de categorías */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {chips.map(c => (
              <Link
                key={c.label}
                to={c.href}
                className="rounded-full border border-stone-700/60 bg-stone-900/50 px-3 py-1 text-xs hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
