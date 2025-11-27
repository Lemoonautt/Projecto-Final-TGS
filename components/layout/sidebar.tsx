"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/auth-store"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  BookMarked,
  ClipboardCheck,
  FileSpreadsheet,
  UserX,
  Building2,
  BarChart3,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Seguimiento Académico", href: "/seguimiento", icon: BarChart3 },
  { name: "Estudiantes", href: "/estudiantes", icon: Users },
  { name: "Docentes", href: "/docentes", icon: UserCheck },
  { name: "Carreras", href: "/carreras", icon: Building2 },
  { name: "Materias", href: "/materias", icon: BookMarked },
  { name: "Asistencias", href: "/asistencias", icon: ClipboardCheck },
  { name: "Calificaciones", href: "/calificaciones", icon: GraduationCap },
  { name: "Tareas", href: "/tareas", icon: FileSpreadsheet },
  { name: "Abandonos", href: "/bajas", icon: UserX },
  { name: "Reportes", href: "/reportes", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">UniGestión</h1>
            <p className="text-xs text-sidebar-foreground/60">Sistema Universitario</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-3 rounded-lg bg-sidebar-accent/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-sidebar-foreground/70" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "Administrador"}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <Link
            href="/configuracion"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <Settings className="h-5 w-5" />
            Configuración
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  )
}
