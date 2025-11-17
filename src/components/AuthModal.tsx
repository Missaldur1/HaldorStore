import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Zustand store
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  // Campos del formulario
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          password2: form.password2,
        });
      }

      // Si todo sale bien → cerrar modal
      onClose();
    } catch (err: any) {
      console.log(err);
      if (typeof err === "string") {
        setErrorMsg(err);
      } else if (err?.password) {
        setErrorMsg(err.password);
      } else if (err?.email) {
        setErrorMsg(err.email);
      } else if (err?.detail) {
        setErrorMsg(err.detail);
      } else {
        setErrorMsg("Algo salió mal. Intenta nuevamente.");
      }
    }

    setLoading(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className="w-full max-w-md rounded-2xl border border-stone-700/60 bg-gradient-to-b from-stone-900/95 to-slate-900/95 p-6 shadow-2xl backdrop-blur-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          className="absolute right-3 top-3 text-stone-400 hover:text-amber-400"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>

        {/* TITULO */}
        <h2 className="text-xl font-bold text-center mb-2">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <p className="text-center text-stone-400 text-sm mb-5">
          {mode === "login"
            ? "Ingresa para continuar con tu experiencia en HaldorStore."
            : "Regístrate para disfrutar beneficios exclusivos."}
        </p>

        {/* ERRORES */}
        {errorMsg && (
          <div className="text-red-400 text-sm mb-3 text-center">
            {errorMsg}
          </div>
        )}

        {/* FORMULARIO */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              {/* Nombre */}
              <div className="relative">
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  name="first_name"
                  placeholder="Nombre"
                  onChange={handleChange}
                  className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white"
                />
              </div>

              {/* Apellido */}
              <div className="relative">
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Apellido"
                  onChange={handleChange}
                  className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              onChange={handleChange}
              className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white"
            />
          </div>

          {mode === "register" && (
            <div className="relative">
              <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                name="password2"
                placeholder="Confirmar contraseña"
                onChange={handleChange}
                className="w-full h-11 bg-stone-900/60 border border-stone-700/60 rounded-lg pl-9 pr-3 text-sm text-white"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:brightness-95 disabled:opacity-40"
          >
            {loading
              ? "Procesando..."
              : mode === "login"
              ? "Entrar"
              : "Registrarme"}
          </button>
        </form>

        {/* CAMBIAR ENTRE LOGIN Y REGISTRO */}
        <p className="text-center text-sm text-stone-400 mt-4">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-amber-400 hover:underline"
              >
                Crear cuenta
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-amber-400 hover:underline"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
