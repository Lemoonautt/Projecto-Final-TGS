"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GradeTable } from "@/components/grades/grade-table"
import { GradeForm } from "@/components/grades/grade-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Grade } from "@/lib/data"

export default function CalificacionesPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role === "student") {
      router.push("/mi-portal")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }
  // </CHANGE>

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade)
    setFormOpen(true)
  }

  const handleNewGrade = () => {
    setSelectedGrade(null)
    setFormOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Calificaciones" subtitle="Registro y seguimiento de notas" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Gestiona las calificaciones de los estudiantes</p>
            </div>
            <Button onClick={handleNewGrade}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Calificación
            </Button>
          </div>
          <GradeTable onEdit={handleEdit} />
        </div>
      </main>

      <GradeForm open={formOpen} onOpenChange={setFormOpen} grade={selectedGrade} />
    </div>
  )
}
