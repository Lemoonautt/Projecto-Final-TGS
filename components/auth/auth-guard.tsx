"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import type { UserRole } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function AuthGuard({ children, allowedRoles = ["admin"], redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Redirigir según el rol
      if (user.role === "student") {
        router.push("/mi-portal")
      } else {
        router.push("/")
      }
    }
  }, [isAuthenticated, user, allowedRoles, redirectTo, router])

  if (!isAuthenticated) {
    return null
  }

  if (user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
