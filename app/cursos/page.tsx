"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CourseCard } from "@/components/courses/course-card"
import { CourseForm } from "@/components/courses/course-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Course } from "@/lib/data"

export default function CursosPage() {
  const { courses, deleteCourse } = useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setFormOpen(true)
  }

  const handleNewCourse = () => {
    setSelectedCourse(null)
    setFormOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Cursos" subtitle="Gestiona los cursos y materias" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Catálogo de cursos disponibles</p>
            </div>
            <Button onClick={handleNewCourse}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Curso
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onEdit={handleEdit} onDelete={deleteCourse} />
            ))}
          </div>
        </div>
      </main>

      <CourseForm open={formOpen} onOpenChange={setFormOpen} course={selectedCourse} />
    </div>
  )
}
