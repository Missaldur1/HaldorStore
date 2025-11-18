import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { UserRound, Mail, PencilLine, Lock } from "lucide-react";

export default function Account() {
  const user = useAuthStore((s) => s.user);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-20 text-stone-300">
        <h2 className="text-2xl font-semibold">No has iniciado sesión</h2>
        <p className="mt-2">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  const avatarInitial = (user.first_name || "?").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-stone-100">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="
            size-24 rounded-full 
            bg-gradient-to-br from-stone-800 to-stone-900 
            border border-amber-500/40 
            shadow-[0_0_15px_rgba(251,191,36,0.25)]
            grid place-items-center 
            text-4xl font-bold text-amber-300
          "
        >
          {avatarInitial}
        </div>

        <h1 className="text-3xl font-bold mt-4">{fullName}</h1>
        <p className="text-stone-400 text-sm">{user.email}</p>
      </div>

      {/* TARJETAS DE OPCIONES */}
      <div className="space-y-4">
        {/* VER DATOS */}
        <div className="bg-stone-900/70 border border-stone-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Información personal</h2>

          <div className="flex items-center gap-3 mb-3">
            <UserRound className="size-5 text-amber-400" />
            <span className="text-stone-300 font-medium">
              Nombre: <span className="text-stone-400">{fullName}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <Mail className="size-5 text-amber-400" />
            <span className="text-stone-300 font-medium">
              Email: <span className="text-stone-400">{user.email}</span>
            </span>
          </div>
        </div>

        {/* BOTÓN EDITAR DATOS */}
        <button
          onClick={() => setEditOpen(true)}
          className="
            w-full h-12 rounded-xl 
            bg-stone-900/60 border border-stone-700/60 
            hover:bg-stone-800/60 transition 
            flex items-center justify-center gap-2
          "
        >
          <PencilLine className="size-5" />
          Editar información
        </button>

        {/* BOTÓN CAMBIAR CONTRASEÑA */}
        <button
          onClick={() => setPasswordOpen(true)}
          className="
            w-full h-12 rounded-xl 
            bg-stone-900/60 border border-stone-700/60 
            hover:bg-stone-800/60 transition 
            flex items-center justify-center gap-2
          "
        >
          <Lock className="size-5" />
          Cambiar contraseña
        </button>
      </div>

      {/* -------------- MODAL EDITAR DATOS -------------- */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-stone-900 p-6 rounded-xl border border-stone-700 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar información</h2>

            {/* FORMULARIO PROXIMO A ACTIVAR */}
            <p className="text-stone-400">Aquí irá el formulario para editar.</p>

            <button
              onClick={() => setEditOpen(false)}
              className="mt-6 w-full h-11 bg-stone-800 rounded-xl hover:bg-stone-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* -------------- MODAL CAMBIAR CONTRASEÑA -------------- */}
      {passwordOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-stone-900 p-6 rounded-xl border border-stone-700 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>

            {/* FORMULARIO PROXIMO A ACTIVAR */}
            <p className="text-stone-400">Aquí irá el formulario de contraseña.</p>

            <button
              onClick={() => setPasswordOpen(false)}
              className="mt-6 w-full h-11 bg-stone-800 rounded-xl hover:bg-stone-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
