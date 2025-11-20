// src/components/AppErrorBoundary.tsx
import { Component, type ReactNode } from "react"

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error?: Error
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Esto te va a mostrar el detalle en la consola del navegador
    console.error("Error en la aplicación:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-[#0f1316] text-red-300">
          <div className="max-w-lg text-center px-4">
            <h1 className="text-xl font-bold mb-2">Ups, algo salió mal 😅</h1>
            <p className="text-sm mb-3">
              {this.state.error?.message ?? "Error inesperado en la página."}
            </p>
            <p className="text-xs text-stone-400">
              Abre la consola del navegador (F12 &gt; pestaña <b>Console</b>)
              para ver más detalles.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}