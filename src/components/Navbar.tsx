import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Bird, Menu, X, Search, ShoppingCart, UserRound, Angry } from "lucide-react"
import { useCartCount } from "@/store/cart"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cartCount = useCartCount()

  const linkBase =
    "px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
  const linkActive = "bg-amber-500/20 text-amber-300"

  return (
    <header className="sticky top-0 z-50 border-b border-stone-700/50 bg-gradient-to-b from-stone-900/90 to-slate-900/70 backdrop-blur text-stone-100">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="inline-grid place-items-center size-8 rounded-md bg-gradient-to-br from-stone-700 to-slate-700 border border-stone-600">
            <Bird size={20} strokeWidth={1.5} className="text-amber-400" />
          </span>
          <span className="font-extrabold tracking-tight text-lg">
            Haldor<span className="text-amber-400">Store</span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>Inicio</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>Catálogo</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>Acerca de</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar..."
              className="h-10 w-56 rounded-lg border border-stone-700/60 bg-stone-900/60 pl-9 pr-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
            <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>

          <NavLink
            to="/account"
            className="size-10 grid place-items-center rounded-lg border border-stone-700/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            aria-label="Mi cuenta"
            title="Mi cuenta"
          >
            <Angry className="size-5" />
          </NavLink>

          <NavLink
            to="/cart"
            className="relative size-10 grid place-items-center rounded-lg border border-stone-700/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            aria-label="Carrito"
            title="Carrito"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black text-[11px] font-bold grid place-items-center shadow-[0_0_8px_rgba(251,191,36,.45)]">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-700/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Abrir menú"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

        {/* Menú móvil */}
        <div id="mobile-menu" className={`${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden`}>
          <div className="overflow-hidden border-t border-stone-700/50">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
              <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? "bg-amber-500/20 text-amber-300" : "hover:bg-white/10"}`}>Inicio</NavLink>
              <NavLink to="/catalog" onClick={() => setOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? "bg-amber-500/20 text-amber-300" : "hover:bg-white/10"}`}>Catálogo</NavLink>
              <NavLink to="/about" onClick={() => setOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? "bg-amber-500/20 text-amber-300" : "hover:bg-white/10"}`}>Acerca de</NavLink>

              <div className="mt-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="search"
                    placeholder="Buscar..."
                    className="h-10 w-full rounded-lg border border-stone-700/60 bg-stone-900/60 pl-9 pr-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                  />
                  <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>

                <NavLink
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="relative size-10 grid place-items-center rounded-lg border border-stone-700/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                  aria-label="Carrito"
                  title="Carrito"
                >
                  <ShoppingCart className="size-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black text-[11px] font-bold grid place-items-center shadow-[0_0_8px_rgba(251,191,36,.45)]" aria-hidden="true">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      <div className="h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />
    </header>
  )
}
