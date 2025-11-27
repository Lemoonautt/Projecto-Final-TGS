"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { Plus, Search, Building2, Users, BookOpen, GraduationCap } from "lucide-react"
import type { Career } from "@/lib/data"

export default function CarrerasPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { careers, students, subjects, addCareer, updateCareer } = useStore()
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Career>>({
    name: "",
    code: "",
    faculty: "",
    duration: 10,
    description: "",
    status: "active",
  })

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

  const filteredCareers = careers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.faculty.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCareer({
      ...formData,
      id: Date.now().toString(),
    } as Career)
    setIsOpen(false)
    setFormData({
      name: "",
      code: "",
      faculty: "",
      duration: 10,
      description: "",
      status: "active",
    })
  }

  const getCareerStats = (careerId: string) => {
    const careerStudents = students.filter((s) => s.careerId === careerId && s.status === "active")
    const careerSubjects = subjects.filter((s) => s.careerId === careerId)
    return {
      students: careerStudents.length,
      subjects: careerSubjects.length,
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Carreras" subtitle="Gestión de programas académicos" />
        <div className="p-6">
          {/* Header con búsqueda y botón */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar carreras..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Carrera
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Carrera</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Carrera</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Ingeniería de Sistemas"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Código</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="Ej: SIS"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Facultad</Label>
                      <Input
                        value={formData.faculty}
                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                        placeholder="Ej: Facultad de Ingeniería"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duración (semestres)</Label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                        min={1}
                        max={16}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Guardar Carrera</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Grid de carreras */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCareers.map((career) => {
              const stats = getCareerStats(career.id)
              return (
                <Card key={career.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{career.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {career.code}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={career.status === "active" ? "bg-success/10 text-success" : "bg-muted"}>
                        {career.status === "active" ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{career.description}</p>
                    <div className="grid grid-cols-3 gap-4 border-t pt-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                        </div>
                        <p className="text-lg font-bold">{stats.students}</p>
                        <p className="text-xs text-muted-foreground">Estudiantes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <p className="text-lg font-bold">{stats.subjects}</p>
                        <p className="text-xs text-muted-foreground">Materias</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <p className="text-lg font-bold">{career.duration}</p>
                        <p className="text-xs text-muted-foreground">Semestres</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">{career.faculty}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
