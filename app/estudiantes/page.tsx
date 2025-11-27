"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StudentTable } from "@/components/students/student-table"
import { StudentForm } from "@/components/students/student-form"
import { StudentDetail } from "@/components/students/student-detail"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Student } from "@/lib/data"

export default function EstudiantesPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setFormOpen(true)
  }

  const handleView = (student: Student) => {
    setSelectedStudent(student)
    setDetailOpen(true)
  }

  const handleNewStudent = () => {
    setSelectedStudent(null)
    setFormOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Estudiantes" subtitle="Gestiona la información de los estudiantes" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Lista completa de estudiantes matriculados</p>
            </div>
            <Button onClick={handleNewStudent}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Estudiante
            </Button>
          </div>
          <StudentTable onEdit={handleEdit} onView={handleView} />
        </div>
      </main>

      <StudentForm open={formOpen} onOpenChange={setFormOpen} student={selectedStudent} />
      <StudentDetail open={detailOpen} onOpenChange={setDetailOpen} student={selectedStudent} onEdit={handleEdit} />
    </div>
  )
}
