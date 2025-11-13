import { Mail, Phone, MapPin, ShieldCheck, Truck, CreditCard, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-10 text-stone-100">
      {/* Acento superior (match con navbar) */}
      <div className="h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />

      <div className="bg-gradient-to-b from-slate-900/80 to-stone-900/80 border-t border-stone-700/50">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca + newsletter */}
          <section aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="font-extrabold tracking-tight text-xl">
              Haldor<span className="text-amber-400">Store</span>
            </h2>
            <p className="mt-2 text-sm text-stone-300/80">
              Estilo nórdico moderno. Calidad, simpleza y durabilidad.
            </p>

            {/* Beneficios rápidos */}
            <ul className="mt-4 space-y-2 text-sm text-stone-300/90">
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-amber-400" /> Envíos rápidos
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-amber-400" /> Compras seguras
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="size-4 text-amber-400" /> Múltiples medios de pago
              </li>
            </ul>

            {/* Newsletter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex items-center gap-2"
              aria-label="Suscripción al boletín"
            >
              <label htmlFor="newsletter" className="sr-only">Tu correo</label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="Tu correo"
                className="
                  h-10 flex-1 rounded-lg border border-stone-700/60 bg-stone-900/60
                  px-3 text-sm placeholder:text-stone-400 outline-none
                  focus:ring-2 focus:ring-amber-400/60
                "
              />
              <button
                type="submit"
                className="
                  h-10 px-3 rounded-lg border border-stone-700/60
                  hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60
                  text-sm inline-flex items-center gap-2
                "
                aria-label="Suscribirme"
              >
                <Send className="size-4" />
                <span className="hidden sm:inline">Suscribirme</span>
              </button>
            </form>
          </section>

          {/* Navegación */}
          <section aria-labelledby="footer-nav">
            <h3 id="footer-nav" className="font-semibold text-stone-200">Navegación</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="/">Inicio</a></li>
              <li><a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="/catalog">Catálogo</a></li>
              <li><a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="/contact">Contacto</a></li>
            </ul>
          </section>

          {/* Ayuda */}
          <section aria-labelledby="footer-help">
            <h3 id="footer-help" className="font-semibold text-stone-200">Ayuda</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="#">Envíos y devoluciones</a></li>
              <li><a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="#">Cambios y garantías</a></li>
              <li><a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="#">Preguntas frecuentes</a></li>
            </ul>
          </section>

          {/* Contacto */}
          <section aria-labelledby="footer-contact">
            <h3 id="footer-contact" className="font-semibold text-stone-200">Contacto</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-300/90">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-amber-400" />
                <a href="mailto:hola@haldor.store" className="hover:text-amber-300">hola@haldor.store</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-amber-400" />
                <a href="tel:+56900000000" className="hover:text-amber-300">+56 9 0000 0000</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-amber-400" />
                <span>Chile</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Línea final */}
        <div className="border-t border-stone-700/50">
          <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <p>© {new Date().getFullYear()} HaldorStore. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="#">Términos</a>
              <a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="#">Privacidad</a>
              <a className="hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 rounded" href="#">Soporte</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
