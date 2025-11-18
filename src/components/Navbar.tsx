import { useState, useRef, useEffect } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Bird,
  Menu,
  X,
  Search,
  ShoppingCart,
  UserRound,
  LogOut,
} from "lucide-react";
import { useCartCount } from "@/store/cart";
import { useAuthStore } from "@/store/authStore";

interface NavbarProps {
  onOpenAuth: () => void;
}

// ----------------- AVATAR DEL USUARIO -----------------
function UserAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className="
        size-9 
        rounded-full 
        bg-gradient-to-br from-stone-800 to-stone-900 
        text-amber-300 
        font-bold 
        grid place-items-center 
        shadow-[0_0_12px_rgba(251,191,36,0.25)]
        border border-amber-500/40
      "
    >
      {initial}
    </div>
  );
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = useCartCount();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // -------- CERRAR MENU AL CLIC FUERA --------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkBase =
    "px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60";
  const linkActive = "bg-amber-500/20 text-amber-300";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-700/50 bg-gradient-to-b from-stone-900/90 to-slate-900/70 backdrop-blur text-stone-100 overflow-visible">

      {/* ---------------------- NAV DESKTOP ---------------------- */}
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          <span className="inline-grid place-items-center size-8 rounded-md bg-gradient-to-br from-stone-700 to-slate-700 border border-stone-600">
            <Bird size={20} strokeWidth={1.5} className="text-amber-400" />
          </span>
          <span className="font-extrabold tracking-tight text-lg">
            Haldor<span className="text-amber-400">Store</span>
          </span>
        </NavLink>

        {/* LINKS DESKTOP */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
            Inicio
          </NavLink>
          <NavLink to="/catalog" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
            Catálogo
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
            Acerca de
          </NavLink>
        </nav>

        {/* BOTONES DERECHA DESKTOP */}
        <div className="hidden md:flex items-center gap-2">

          {/* BUSCADOR */}
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar..."
              className="h-10 w-56 rounded-lg border border-stone-700/60 bg-stone-900/60 pl-9 pr-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
            <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>

          {/* ----------------- LOGIN / USER (DESKTOP) ----------------- */}
          {!isAuthenticated ? (
            <button
              onClick={onOpenAuth}
              className="size-10 grid place-items-center rounded-lg border border-stone-700/60 hover:bg-white/10"
            >
              <UserRound className="size-5" />
            </button>
          ) : (
            <div ref={userMenuRef} className="relative flex items-center gap-3">

              {/* TRIGGER */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <UserAvatar name={user?.first_name || ""} />

                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-stone-400">Hola</span>
                  <span className="text-amber-300 font-semibold text-sm tracking-wide">
                    {user?.first_name}
                  </span>
                </div>
              </div>

              {/* MENU DROPDOWN DESKTOP */}
              {userMenuOpen && (
                <div
                  className="
                    absolute top-full right-0 mt-2
                    w-44
                    bg-gradient-to-b from-stone-900 to-stone-800
                    border border-stone-700/70
                    rounded-xl shadow-xl py-2 z-[999]
                  "
                >
                  <button
                    onClick={() => {
                      navigate("/account");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-stone-300 hover:bg-stone-700/40 transition"
                  >
                    Mi Perfil
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm text-stone-300 hover:bg-stone-700/40">
                    Mis pedidos
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CARRITO */}
          <NavLink
            to="/cart"
            className="relative size-10 grid place-items-center rounded-lg border border-stone-700/60 hover:bg-white/10"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black text-[11px] font-bold grid place-items-center">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>

        {/* BOTÓN MENU MÓVIL */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-700/60 hover:bg-white/10"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* ---------------------- MENU MOBILE ---------------------- */}
      <div
        className={`${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden`}
      >
        <div className="overflow-hidden border-t border-stone-700/50">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            <NavLink to="/" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/10">
              Inicio
            </NavLink>
            <NavLink to="/catalog" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/10">
              Catálogo
            </NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/10">
              Acerca de
            </NavLink>

            {/* LOGIN / USER MOBILE */}
            <div className="mt-4 flex flex-col gap-2">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full h-11 rounded-lg border border-stone-700/60 bg-stone-900/60 flex items-center justify-center gap-2 text-stone-200 hover:bg-white/10"
                >
                  <UserRound className="size-5" />
                  Iniciar sesión
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/account");
                    }}
                    className="w-full h-11 rounded-lg border border-stone-700/60 bg-stone-900/60 flex 
                      items-center justify-start gap-3 px-4 text-stone-300 hover:bg-white/10"
                  >
                    <UserRound className="size-5" />
                    Mi Perfil
                  </button>

                  <button className="w-full h-11 rounded-lg border border-stone-700/60 bg-stone-900/60 flex items-center justify-start gap-3 px-4 text-stone-300 hover:bg-white/10">
                    <ShoppingCart className="size-5" />
                    Mis pedidos
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full h-11 rounded-lg border border-stone-700/60 bg-stone-900/60 flex items-center justify-start gap-3 px-4 text-red-400 hover:bg-red-900/30"
                  >
                    <LogOut className="size-5" />
                    Cerrar sesión
                  </button>
                </>
              )}

              <NavLink
                to="/cart"
                onClick={() => setOpen(false)}
                className="relative h-11 rounded-lg border border-stone-700/60 bg-stone-900/60 flex items-center justify-start gap-3 px-4"
              >
                <ShoppingCart className="size-5" />
                <span>Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black text-[11px] font-bold">
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
  );
}
