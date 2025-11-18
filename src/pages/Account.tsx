import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { UserRound, Mail, PencilLine, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { updateUserProfile, changePassword } from "@/services/userService";

export default function Account() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");

  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  if (!user) {
    return (
      <div className="text-center py-20 text-stone-300">
        <h2 className="text-2xl font-semibold">No has iniciado sesión</h2>
        <p className="mt-2">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const avatarInitial = user.first_name.charAt(0).toUpperCase();

  function resetPasswordFields() {
    setOldPass("");
    setNewPass("");
    setNewPass2("");
  }

  // ---------- EDITAR PERFIL ----------
  async function handleEditSubmit() {
    setError("");
    setOkMsg("");

    const formattedFirst =
      firstName.trim().charAt(0).toUpperCase() +
      firstName.trim().slice(1).toLowerCase();

    const formattedLast =
      lastName.trim().charAt(0).toUpperCase() +
      lastName.trim().slice(1).toLowerCase();

    try {
      const res = await updateUserProfile({
        first_name: formattedFirst,
        last_name: formattedLast,
      });

      updateUser(res.user);
      setFirstName(formattedFirst);
      setLastName(formattedLast);

      setOkMsg("Datos actualizados correctamente");
    } catch (err: any) {
      setError(err?.detail || "Error al actualizar los datos");
    }
  }

  // ---------- CAMBIAR CONTRASEÑA ----------
  async function handlePasswordSubmit() {
    setError("");
    setOkMsg("");

    if (newPass !== newPass2) {
      setError("Las contraseñas no coinciden");
      resetPasswordFields();
      return;
    }

    try {
      await changePassword({
        current_password: oldPass,
        new_password: newPass,
        new_password2: newPass2,
      });

      setOkMsg("Contraseña actualizada correctamente");
      resetPasswordFields();
    } catch (err: any) {
      setError(err?.error || err?.detail || "Error al cambiar contraseña");
      resetPasswordFields();
    }
  }

  // -------------------------------
  // COMPONENTE ALERTA BONITO
  // -------------------------------
  function AlertBox() {
    if (!error && !okMsg) return null;

    return (
      <div
        className={`
          flex items-center gap-3 p-3 rounded-lg mb-4
          ${error ? "bg-red-900/40 border border-red-600/40 text-red-300" : ""}
          ${okMsg ? "bg-green-900/40 border border-green-600/40 text-green-300" : ""}
        `}
      >
        {error ? <AlertTriangle className="size-5" /> : <CheckCircle className="size-5" />}
        <span className="text-sm font-medium">{error || okMsg}</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-stone-100">

      {/* --- HEADER --- */}
      <div className="flex flex-col items-center mb-10">
        <div className="size-24 rounded-full bg-gradient-to-br from-stone-800 to-stone-900 border border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.25)] grid place-items-center text-4xl font-bold text-amber-300">
          {avatarInitial}
        </div>

        <h1 className="text-3xl font-bold mt-4">{fullName}</h1>
        <p className="text-stone-400 text-sm">{user.email}</p>
      </div>

      {/* --- TARJETAS --- */}
      <div className="space-y-4">

        <div className="bg-stone-900/70 border border-stone-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Información personal</h2>

          <div className="flex items-center gap-3 mb-3">
            <UserRound className="size-5 text-amber-400" />
            <span className="text-stone-300 font-medium">
              Nombre: <span className="text-stone-400">{fullName}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="size-5 text-amber-400" />
            <span className="text-stone-300 font-medium">
              Email: <span className="text-stone-400">{user.email}</span>
            </span>
          </div>
        </div>

        {/* BOTÓN EDITAR */}
        <button
          onClick={() => {
            setError("");
            setOkMsg("");
            setEditOpen(true);
          }}
          className="w-full h-12 rounded-xl bg-stone-900/60 border border-stone-700/60 hover:bg-stone-800/60 transition flex items-center justify-center gap-2"
        >
          <PencilLine className="size-5" />
          Editar información
        </button>

        {/* BOTÓN CONTRASEÑA */}
        <button
          onClick={() => {
            resetPasswordFields();
            setError("");
            setOkMsg("");
            setPasswordOpen(true);
          }}
          className="w-full h-12 rounded-xl bg-stone-900/60 border border-stone-700/60 hover:bg-stone-800/60 transition flex items-center justify-center gap-2"
        >
          <Lock className="size-5" />
          Cambiar contraseña
        </button>
      </div>

      {/* ---------- MODAL EDITAR ---------- */}
      {editOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="animate-fadeIn bg-stone-900 p-6 rounded-xl border border-stone-700 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Editar información</h2>

            <AlertBox />

            <div className="space-y-3">
              <input
                type="text"
                className="w-full h-11 rounded-lg bg-stone-800 px-3 border border-stone-700"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                type="text"
                className="w-full h-11 rounded-lg bg-stone-800 px-3 border border-stone-700"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <button
              onClick={handleEditSubmit}
              className="mt-4 w-full h-11 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
            >
              Guardar cambios
            </button>

            <button
              onClick={() => setEditOpen(false)}
              className="mt-3 w-full h-11 bg-stone-800 rounded-lg hover:bg-stone-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ---------- MODAL CONTRASEÑA ---------- */}
      {passwordOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => {
            resetPasswordFields();
            setPasswordOpen(false);
          }}
        >
          <div
            className="animate-fadeIn bg-stone-900 p-6 rounded-xl border border-stone-700 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>

            <AlertBox />

            <input
              type="password"
              placeholder="Contraseña actual"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full h-11 rounded-lg bg-stone-800 px-3 border border-stone-700 mb-3"
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full h-11 rounded-lg bg-stone-800 px-3 border border-stone-700 mb-3"
            />

            <input
              type="password"
              placeholder="Repetir nueva contraseña"
              value={newPass2}
              onChange={(e) => setNewPass2(e.target.value)}
              className="w-full h-11 rounded-lg bg-stone-800 px-3 border border-stone-700"
            />

            <button
              onClick={handlePasswordSubmit}
              className="mt-4 w-full h-11 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
            >
              Cambiar contraseña
            </button>

            <button
              onClick={() => {
                resetPasswordFields();
                setPasswordOpen(false);
              }}
              className="mt-3 w-full h-11 bg-stone-800 rounded-lg hover:bg-stone-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}