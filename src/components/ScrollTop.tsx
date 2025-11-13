import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setShow(y > 400) // umbral para mostrar el botón
    }
    onScroll() // evaluar al cargar
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleClick() {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Subir al inicio"
      title="Subir"
      className={[
        "fixed bottom-6 right-6 z-50",
        "rounded-full p-3",
        "bg-amber-500 text-black",
        "border border-stone-700/60",
        "shadow-lg shadow-amber-500/30",
        "transition-all duration-300",
        "hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-amber-400/70",
        show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
      ].join(" ")}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  )
}
