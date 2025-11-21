import { Link } from "react-router-dom"

export default function Account() {
    return (
        <section className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Mi cuenta</h1>

            <div className="grid gap-3">
                <div className="p-4 rounded-lg bg-stone-900/40 border border-stone-700">
                    <h2 className="font-semibold">Perfil</h2>
                    <p className="text-sm text-stone-300 mt-2">Nombre: <strong>Usuario</strong></p>
                    <p className="text-sm text-stone-300">Email: <strong>usuario@ejemplo.com</strong></p>
                    <div className="mt-3">
                        <Link to="/account/settings" className="text-amber-400 hover:underline text-sm">Editar perfil</Link>
                    </div>
                </div>

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
