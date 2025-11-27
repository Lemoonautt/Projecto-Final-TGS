"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, AlertCircle, Lock, Mail } from "lucide-react"
import { authenticateUser } from "@/lib/auth"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = authenticateUser(email, password)

    if (user) {
      login(user)
      // Redirigir según el rol
      if (user.role === "admin") {
        router.push("/")
      } else {
        router.push("/mi-portal")
      }
    } else {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">UniGestión</h1>
          <p className="text-muted-foreground">Sistema de Gestión Universitaria</p>
        </div>

        {/* Formulario de login */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@universidad.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información de demo */}
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Credenciales de demostración:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <div>
                  <p className="font-medium text-foreground">Administrador</p>
                  <p className="text-muted-foreground text-xs">admin@universidad.edu</p>
                </div>
                <code className="text-xs bg-background px-2 py-1 rounded">admin123</code>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <div>
                  <p className="font-medium text-foreground">Estudiante (María)</p>
                  <p className="text-muted-foreground text-xs">maria.garcia@universidad.edu</p>
                </div>
                <code className="text-xs bg-background px-2 py-1 rounded">estudiante123</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
