import { useState } from "react"
import { X, Mail, Lock, User } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")

  if (!open) return null

  return (
    // OVERLAY
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* CONTENEDOR DEL MODAL*/}
      <div
        className="
            w-full max-w-md rounded-2xl 
            border border-stone-700/70 
            bg-gradient-to-b from-[#15171c]/95 to-[#0f1115]/95
            backdrop-blur-xl 
            p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] relative"

        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          className="absolute right-3 top-3 text-stone-400 hover:text-amber-400"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>

        {/* TÍTULO */}
        <h2 className="text-xl font-bold text-center mb-2">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <p className="text-center text-stone-400 text-sm mb-5">
          {mode === "login"
            ? "Ingresa para continuar con tu experiencia en HaldorStore."
            : "Regístrate para disfrutar beneficios exclusivos y guardar tus pedidos."}
        </p>

        {/* FORMULARIO */}
        <form className="space-y-3">

          {mode === "register" && (
            <>
              {/* Nombre */}
              <div className="relative">
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white placeholder-stone-400 focus:ring-2 focus:ring-amber-400/60 outline-none"
                />
              </div>

              {/* Apellido */}
              <div className="relative">
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Apellido"
                  className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white placeholder-stone-400 focus:ring-2 focus:ring-amber-400/60 outline-none"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white placeholder-stone-400 focus:ring-2 focus:ring-amber-400/60 outline-none"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white placeholder-stone-400 focus:ring-2 focus:ring-amber-400/60 outline-none"
            />
          </div>

          {mode === "register" && (
            <div className="relative">
              <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white placeholder-stone-400 focus:ring-2 focus:ring-amber-400/60 outline-none"
              />
            </div>
          )}

          {/* Botón enviar */}
          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:brightness-95 focus:ring-2 focus:ring-amber-400/60 mt-2"
          >
            {mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>

        {/* Cambiar modo */}
        <p className="text-center text-sm text-stone-400 mt-4">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                className="text-amber-400 hover:underline"
                onClick={() => setMode("register")}
              >
                Crear cuenta
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                className="text-amber-400 hover:underline"
                onClick={() => setMode("login")}
              >
                Iniciar sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
