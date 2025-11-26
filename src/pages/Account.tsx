import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/useDocumentTitle" 
import {
  UserRound,
  Mail,
  PencilLine,
  Lock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  MapPin,
  Pencil,
} from "lucide-react";

import {
  updateUserProfile,
  changePassword,
} from "@/services/userService";

import {
  listRegions,
  listProvinces,
  listCommunes,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/services/locationService";

import CustomSelect from "@/components/CustomSelect";

/* =====================================================================================
    COMPONENTE PRINCIPAL ACCOUNT
===================================================================================== */

export default function Account() {
  usePageTitle("Mi cuenta")
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

  /* ======================= EDITAR PERFIL ======================= */
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
      setOkMsg("Datos actualizados correctamente");
    } catch (err: any) {
      setError(err?.detail || "Error al actualizar los datos");
    }
  }

  /* ======================= CAMBIAR CONTRASEÑA ======================= */
  async function handlePasswordSubmit() {
    setError("");
    setOkMsg("");

    if (newPass !== newPass2) {
      setError("Las contraseñas no coinciden");
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
    }
  }

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
      {/* HEADER */}
      <div className="flex flex-col items-center mb-10">
        <div className="size-24 rounded-full bg-gradient-to-br from-stone-800 to-stone-900 border border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.25)] grid place-items-center text-4xl font-bold text-amber-300">
          {avatarInitial}
        </div>
        <h1 className="text-3xl font-bold mt-4">{fullName}</h1>
        <p className="text-stone-400 text-sm">{user.email}</p>
      </div>

      <div className="space-y-4">
        {/* Info personal */}
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

        {/* Editar datos */}
        <button
          onClick={() => {
            setError("");
            setOkMsg("");
            setEditOpen(true);
          }}
          className="w-full h-12 rounded-xl bg-stone-900/60 border border-stone-700/60 hover:bg-stone-800/60 flex items-center justify-center gap-2"
        >
          <PencilLine className="size-5" />
          Editar información
        </button>

        {/* DIRECCIONES */}
        <AddressesSection />

        {/* Cambiar contraseña */}
        <button
          onClick={() => {
            resetPasswordFields();
            setError("");
            setOkMsg("");
            setPasswordOpen(true);
          }}
          className="w-full h-12 rounded-xl bg-stone-900/60 border border-stone-700/60 hover:bg-stone-800/60 flex items-center justify-center gap-2"
        >
          <Lock className="size-5" />
          Cambiar contraseña
        </button>
      </div>

      {/* MODAL EDITAR PERFIL */}
      {editOpen && (
        <EditProfileModal
          close={() => setEditOpen(false)}
          handleSubmit={handleEditSubmit}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          AlertBox={AlertBox}
        />
      )}

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {passwordOpen && (
        <PasswordModal
          close={() => setPasswordOpen(false)}
          handleSubmit={handlePasswordSubmit}
          oldPass={oldPass}
          newPass={newPass}
          newPass2={newPass2}
          setOldPass={setOldPass}
          setNewPass={setNewPass}
          setNewPass2={setNewPass2}
          AlertBox={AlertBox}
        />
      )}
    </div>
  );
}

/* =====================================================================================
    SUBCOMPONENTES — MODALES
===================================================================================== */

function EditProfileModal({
  close,
  handleSubmit,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  AlertBox,
}: any) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]"
      onClick={close}
    >
      <div
        className="bg-stone-900 p-6 rounded-xl border border-stone-700 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Editar información</h2>

        <AlertBox />

        <div className="space-y-3">
          <input
            type="text"
            className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full h-11 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30"
        >
          Guardar cambios
        </button>

        <button
          onClick={close}
          className="mt-3 w-full h-11 bg-stone-800 rounded-lg hover:bg-stone-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function PasswordModal({
  close,
  handleSubmit,
  oldPass,
  newPass,
  newPass2,
  setOldPass,
  setNewPass,
  setNewPass2,
  AlertBox,
}: any) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]"
      onClick={close}
    >
      <div
        className="bg-stone-900 p-6 rounded-xl border border-stone-700 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>

        <AlertBox />

        <input
          type="password"
          placeholder="Contraseña actual"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3 mb-3"
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3 mb-3"
        />

        <input
          type="password"
          placeholder="Repetir nueva contraseña"
          value={newPass2}
          onChange={(e) => setNewPass2(e.target.value)}
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full h-11 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30"
        >
          Cambiar contraseña
        </button>

        <button
          onClick={close}
          className="mt-3 w-full h-11 bg-stone-800 rounded-lg hover:bg-stone-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* =====================================================================================
    SECCIÓN DE DIRECCIONES — CON CUSTOM SELECT
===================================================================================== */

function AddressesSection() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [regionId, setRegionId] = useState<number | null>(null);
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [communeId, setCommuneId] = useState<number | null>(null);

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [apartment, setApartment] = useState("");
  const [reference, setReference] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  /* Cargar regiones */
  useEffect(() => {
    listRegions().then(setRegions);
  }, []);

  /* Provincias */
  useEffect(() => {
    if (!regionId) return;
    listProvinces(regionId).then(setProvinces);
  }, [regionId]);

  /* Comunas */
  useEffect(() => {
    if (!provinceId) return;
    listCommunes(provinceId).then(setCommunes);
  }, [provinceId]);

  /* Cargar direcciones */
  useEffect(() => {
    listAddresses().then((r) => {
      setAddresses(r);
      setLoading(false);
    });
  }, []);

  /* Crear nueva */
  function openNew() {
    setEditing(null);
    setStreet("");
    setNumber("");
    setApartment("");
    setReference("");
    setIsDefault(false);

    setRegionId(null);
    setProvinceId(null);
    setCommuneId(null);

    setModalOpen(true);
  }

  /* Editar */
  function openEdit(addr: any) {
    setEditing(addr);

    setStreet(addr.street);
    setNumber(addr.number);
    setApartment(addr.apartment);
    setReference(addr.reference);
    setIsDefault(addr.is_default);

    setRegionId(addr.region.id);
    setProvinceId(addr.province.id);
    setCommuneId(addr.commune.id);

    setModalOpen(true);
  }

  async function handleSave() {
    if (!regionId || !provinceId || !communeId) {
      alert("Debe seleccionar región, provincia y comuna.");
      return;
    }

    const payload = {
      street,
      number,
      apartment,
      reference,
      is_default: isDefault,
      region_id: regionId,
      province_id: provinceId,
      commune_id: communeId,
    };

    if (editing) {
      await updateAddress(editing.id, payload);
    } else {
      await createAddress(payload);
    }

    setAddresses(await listAddresses());
    setModalOpen(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta dirección?")) return;
    await deleteAddress(id);
    setAddresses(await listAddresses());
  }

  return (
    <div className="bg-stone-900/70 border border-stone-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Mis direcciones</h2>

        <button
          onClick={openNew}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm flex items-center gap-2"
        >
          <Plus className="size-4" /> Nueva dirección
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Cargando...</p>
      ) : addresses.length === 0 ? (
        <p className="text-stone-400 text-sm">Aún no agregas direcciones.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-lg bg-stone-800/60 border border-stone-700/60 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2 text-amber-300">
                  <MapPin className="size-4" />
                  <strong>
                    {a.street} {a.number}
                  </strong>
                </div>

                <div className="text-sm text-stone-300 mt-1">
                  {a.commune.name}, {a.province.name}, {a.region.name}
                </div>

                {a.is_default && (
                  <span className="text-xs text-green-400">✓ Dirección por defecto</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="p-2 rounded-lg bg-stone-700 hover:bg-stone-600"
                >
                  <Pencil className="size-4" />
                </button>

                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-2 rounded-lg bg-red-700/70 hover:bg-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DIRECCIÓN */}
      {modalOpen && (
        <AddressModal
          close={() => setModalOpen(false)}
          editing={editing}
          regions={regions}
          provinces={provinces}
          communes={communes}
          regionId={regionId}
          provinceId={provinceId}
          communeId={communeId}
          setRegionId={setRegionId}
          setProvinceId={setProvinceId}
          setCommuneId={setCommuneId}
          street={street}
          number={number}
          apartment={apartment}
          reference={reference}
          setStreet={setStreet}
          setNumber={setNumber}
          setApartment={setApartment}
          setReference={setReference}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          handleSave={handleSave}
        />
      )}
    </div>
  );
}

/* =====================================================================================
    MODAL DE DIRECCIÓN — CON CUSTOM SELECT
===================================================================================== */

function AddressModal({
  close,
  editing,
  regions,
  provinces,
  communes,
  regionId,
  provinceId,
  communeId,
  setRegionId,
  setProvinceId,
  setCommuneId,
  street,
  number,
  apartment,
  reference,
  setStreet,
  setNumber,
  setApartment,
  setReference,
  isDefault,
  setIsDefault,
  handleSave,
}: any) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-[999]"
      onClick={close}
    >
      <div
        className="bg-stone-900 p-6 rounded-xl border border-stone-700 max-w-md w-full space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">
          {editing ? "Editar dirección" : "Nueva dirección"}
        </h3>

        {/* CUSTOM SELECTS */}

        <CustomSelect
          label="Región"
          options={regions}
          value={regionId}
          onChange={(v) => {
            setRegionId(v);
            setProvinceId(null);
            setCommuneId(null);
          }}
          placeholder="Seleccione región"
        />

        {regionId && (
          <CustomSelect
            label="Provincia"
            options={provinces}
            value={provinceId}
            onChange={(v) => {
              setProvinceId(v);
              setCommuneId(null);
            }}
            placeholder="Seleccione provincia"
          />
        )}

        {provinceId && (
          <CustomSelect
            label="Comuna"
            options={communes}
            value={communeId}
            onChange={setCommuneId}
            placeholder="Seleccione comuna"
          />
        )}

        {/* CAMPOS DE TEXTO */}
        <input
          type="text"
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
          placeholder="Calle"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />

        <input
          type="text"
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
          placeholder="Número"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <input
          type="text"
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
          placeholder="Depto / Casa"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />

        <input
          type="text"
          className="w-full h-11 bg-stone-800 border border-stone-700 rounded-lg px-3"
          placeholder="Referencia"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-stone-300">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          Dirección por defecto
        </label>

        <button
          onClick={handleSave}
          className="w-full h-11 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg hover:bg-amber-500/30"
        >
          Guardar
        </button>

        <button
          onClick={close}
          className="w-full h-11 bg-stone-800 rounded-lg hover:bg-stone-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}