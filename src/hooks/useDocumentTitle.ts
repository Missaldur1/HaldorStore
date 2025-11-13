import { useEffect } from "react"

type Options = {
  brand?: string          // por si quieres cambiar la marca en el futuro
  sep?: string            // separador, por defecto " - "
  position?: "prefix" | "suffix" // "HaldorStore - Página" o "Página - HaldorStore"
}

/**
 * Establece el título del documento con marca fija.
 * usePageTitle("Catálogo") => "HaldorStore - Catálogo"
 */
export function usePageTitle(page?: string, opts?: Options) {
  const brand = opts?.brand ?? "HaldorStore"
  const sep = opts?.sep ?? " - "
  const position = opts?.position ?? "prefix"

  useEffect(() => {
    const prev = document.title
    const final = page
      ? (position === "suffix" ? `${page}${sep}${brand}` : `${brand}${sep}${page}`)
      : brand // si no hay page, deja solo la marca

    document.title = final
    return () => { document.title = prev }
  // ojo: no pases objetos dinámicos en opts; usa literales para evitar re-renders
  }, [page, brand, sep, position])
}
