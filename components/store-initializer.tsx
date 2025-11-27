"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useStore((state) => state.initialize)
  const isLoading = useStore((state) => state.isLoading)
  const error = useStore((state) => state.error)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Error al cargar datos</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Asegúrate de que json-server esté ejecutándose en el puerto 3001
          </p>
          <p className="text-xs text-muted-foreground">Ejecuta: npm run server</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando datos del servidor...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
