import { Link } from "react-router-dom"
import default_user_account from "@/assets/account/default_user_icon.png"

export default function Account() {
    return (
        <section className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-5">Mi cuenta</h1>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2x1 font-bold">Bienvenido, Usuario</h1>
                    <h1 className="text-2x1"><strong>Nombre:</strong> Nombre Completo</h1>
                    <h1 className="text-2x1"><strong>Email:</strong> usuario@ejemplo.com</h1>
                    <h1 className="text-2x1"><strong>Direccion:</strong> Los trapenses 10</h1>
                </div>

                <img
                    src={default_user_account}
                    alt="Imagen de Usuario"
                    className="h-30 w-30 rounded-full object-cover border-2 border-amber-400 bg-stone-400" />
            </div>



            <div className="grid gap-3">
                <div className="p-4 rounded-lg bg-stone-900/40 border border-stone-700">
                    <h2 className="font-semibold">Órdenes</h2>
                    <p className="text-sm text-stone-300 mt-2">Aquí verás tus órdenes recientes.</p>
                    <div className="mt-3">
                        <Link to="/orders" className="text-amber-400 hover:underline text-sm">Ver órdenes</Link>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-stone-900/40 border border-stone-700">
                    <h2 className="font-semibold">Ajustes</h2>
                    <p className="text-sm text-stone-300 mt-2">Preferencias de la cuenta y métodos de pago.</p>
                    <div className="mt-3">
                        <Link to="/account/settings" className="text-amber-400 hover:underline text-sm">Ir a ajustes</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
