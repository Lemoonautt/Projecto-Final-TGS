"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "./auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Helper hooks
export function useIsAdmin(): boolean {
  const user = useAuthStore((state) => state.user)
  return user?.role === "admin"
}

export function useIsStudent(): boolean {
  const user = useAuthStore((state) => state.user)
  return user?.role === "student"
}

export function useCurrentStudentId(): string | null {
  const user = useAuthStore((state) => state.user)
  return user?.studentId || null
}
