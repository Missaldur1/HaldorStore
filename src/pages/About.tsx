import { Link } from "react-router"
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Leaf,
  Recycle,
  Hammer,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react"
import { usePageTitle } from "@/hooks/useDocumentTitle"

// Imagen local opcional (colócala si quieres): public/images/hero/About.jpg
const HERO_IMG = "/images/hero/About.jpg"
const FALLBACK_IMG = "https://placehold.co/1600x600/111315/ffffff?text=HaldorStore"

export default function About() {
  usePageTitle("Acerca de")
  return (
    <section className="space-y-10">
      <Hero />
      <Story />
      <Values />
      <Timeline />
      <Team />
      <ContactBlock />
    </section>
  )
}

/* ============= HERO ============= */

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/80 to-slate-900/80">
      <img
        src={HERO_IMG}
        alt="Sobre HaldorStore"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
        className="absolute inset-0 size-full object-cover opacity-30"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 via-slate-900/50 to-stone-800/60" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-500 via-sky-500 to-stone-500 opacity-70" />
      <div className="relative px-6 py-16 sm:px-10 md:px-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Acerca de <span className="text-amber-400">HaldorStore</span>
        </h1>
        <p className="mt-3 max-w-prose text-stone-300/90">
          Inspirados por el norte: productos con identidad, materiales duraderos y diseño moderno.
        </p>
        <div className="mt-6">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
          >
            Ver catálogo <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ============= STORY ============= */

function Story() {
  return (
    <section aria-labelledby="heading-story">
      <h2 id="heading-story" className="text-xl sm:text-2xl font-bold mb-3">Nuestra historia</h2>
      <div className="rounded-2xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-5 sm:p-6">
        <p className="text-sm text-stone-300/90 max-w-3xl">
          Nacimos con una idea simple: combinar la estética nórdica —minimalista, ruda y funcional—
          con productos pensados para durar. Creemos en lo esencial: buenos materiales, procesos
          responsables y una experiencia de compra honesta. Cada colección es un tributo al
          espíritu explorador del norte, con un enfoque moderno y urbano.
        </p>
      </div>
    </section>
  )
}

/* ============= VALUES ============= */

function Values() {
  const values = [
    { icon: <ShieldCheck className="size-5 text-amber-400" />, title: "Calidad sin compromisos", text: "Materiales seleccionados y controles exigentes." },
    { icon: <Leaf className="size-5 text-amber-400" />, title: "Respeto por el entorno", text: "Preferimos procesos y empaques responsables." },
    { icon: <Recycle className="size-5 text-amber-400" />, title: "Larga vida útil", text: "Diseños atemporales y piezas reparables cuando es posible." },
    { icon: <Hammer className="size-5 text-amber-400" />, title: "Diseño funcional", text: "Forma y función se equilibran en cada detalle." },
    { icon: <Award className="size-5 text-amber-400" />, title: "Excelencia en servicio", text: "Soporte cercano y garantías claras." },
    { icon: <Users className="size-5 text-amber-400" />, title: "Comunidad", text: "Co-creamos con feedback real de la tribu." },
  ]

  return (
    <section aria-labelledby="heading-values">
      <h2 id="heading-values" className="text-xl sm:text-2xl font-bold mb-4">Nuestros valores</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {values.map(v => (
          <article key={v.title} className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-grid size-9 place-items-center rounded-lg bg-stone-800/70 border border-stone-700/60">
                {v.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{v.title}</h3>
                <p className="text-xs text-stone-300/80">{v.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ============= TIMELINE ============= */

function Timeline() {
  const milestones = [
    { year: "2023", title: "Primer drop", text: "Lanzamos nuestra primera colección cápsula inspirada en runas." },
    { year: "2024", title: "Expansión", text: "Sumamos accesorios y joyería funcional." },
    { year: "2025", title: "Sustentabilidad", text: "Optimizamos empaques y trazabilidad de proveedores." },
  ]

  return (
    <section aria-labelledby="heading-timeline">
      <h2 id="heading-timeline" className="text-xl sm:text-2xl font-bold mb-4">Camino recorrido</h2>
      <div className="relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500 via-sky-500 to-stone-500 opacity-70 rounded-full" />
        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.year} className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
              <div className="text-amber-300 text-xs font-semibold">{m.year}</div>
              <div className="text-sm font-semibold">{m.title}</div>
              <p className="text-sm text-stone-300/85">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============= TEAM ============= */

function Team() {
  const team = [
    { name: "Erik", role: "Diseño", avatar: "https://i.pravatar.cc/100?img=11" },
    { name: "Freya", role: "Operaciones", avatar: "https://i.pravatar.cc/100?img=16" },
    { name: "Rune", role: "Atención al Cliente", avatar: "https://i.pravatar.cc/100?img=22" },
  ]

  return (
    <section aria-labelledby="heading-team">
      <h2 id="heading-team" className="text-xl sm:text-2xl font-bold mb-4">El equipo</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map(p => (
          <article key={p.name} className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-4">
            <div className="flex items-center gap-3">
              <img
                src={p.avatar}
                alt={p.name}
                className="size-12 rounded-full object-cover bg-stone-800"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/96x96/111315/fff?text=+" }}
              />
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-stone-300/80">{p.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ============= CONTACT ============= */

function ContactBlock() {
  const mapSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=-70.75%2C-33.6%2C-70.5%2C-33.35&layer=mapnik&marker=-33.45%2C-70.65"

  return (
    <section aria-labelledby="heading-contact">
      <h2 id="heading-contact" className="text-xl sm:text-2xl font-bold mb-4">Dónde encontrarnos</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mapa */}
        <div className="overflow-hidden rounded-xl border border-stone-700/50 bg-stone-900/60">
          <div className="aspect-[16/9]">
            <iframe
              title="Mapa HaldorStore - Santiago, Chile"
              src={mapSrc}
              className="size-full"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-3 text-xs text-stone-300/80">
            Ver en{" "}
            <a
              href="https://www.openstreetmap.org/?mlat=-33.45&mlon=-70.65#map=12/-33.45/-70.65"
              target="_blank" rel="noreferrer"
              className="underline hover:text-amber-300"
            >
              OpenStreetMap
            </a>
          </div>
        </div>

        {/* Datos + CTA */}
        <div className="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-900/70 to-slate-900/70 p-5 sm:p-6">
          <ul className="space-y-2 text-sm text-stone-300/90">
            <li className="flex items-center gap-2"><MapPin className="size-4 text-amber-400" /> Santiago, Chile</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-amber-400" /> <a href="tel:+56900000000" className="hover:text-amber-300">+56 9 0000 0000</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-amber-400" /> <a href="mailto:hola@haldor.store" className="hover:text-amber-300">hola@haldor.store</a></li>
          </ul>

          <div className="mt-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black text-sm font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            >
              Explorar catálogo <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
