"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Pencil, Trash2, Clock, MapPin, BookOpen } from "lucide-react"
import type { Subject } from "@/lib/data"
import { calcularNivel, getNivelLabel } from "@/lib/utils"

export default function MateriasPage() {
  const { subjects, teachers, careers, addSubject, updateSubject, deleteSubject } = useStore()
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: "",
    code: "",
    description: "",
    teacherId: "",
    careerId: "",
    semester: 1,
    nivel: 1,
    credits: 3,
    schedule: "",
    classroom: "",
  })

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const subjectData = {
      ...formData,
      nivel: calcularNivel(formData.semester || 1),
    }

    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, subjectData)
      } else {
        await addSubject({
          ...subjectData,
          id: Date.now().toString(),
        } as Subject)
      }
      setIsOpen(false)
      setEditingSubject(null)
      setFormData({
        name: "",
        code: "",
        description: "",
        teacherId: "",
        careerId: "",
        semester: 1,
        nivel: 1,
        credits: 3,
        schedule: "",
        classroom: "",
      })
    } catch (error) {
      console.error("Error al guardar materia:", error)
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData(subject)
    setIsOpen(true)
  }

  const handleSemesterChange = (semester: number) => {
    setFormData({
      ...formData,
      semester,
      nivel: calcularNivel(semester),
    })
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Sin asignar"
  }

  const getCareerName = (careerId: string) => {
    const career = careers.find((c) => c.id === careerId)
    return career ? career.code : ""
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header title="Gestión de Materias" subtitle="Administración de asignaturas y materias" />
        <main className="p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Materias / Asignaturas</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar materia..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingSubject(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Materia
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingSubject ? "Editar Materia" : "Nueva Materia"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Programación Avanzada"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Código</Label>
                          <Input
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="SIS-501"
                            required
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Descripción</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            placeholder="Descripción de la materia"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Carrera</Label>
                          <Select
                            value={formData.careerId}
                            onValueChange={(value) => setFormData({ ...formData, careerId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar carrera" />
                            </SelectTrigger>
                            <SelectContent>
                              {careers.map((career) => (
                                <SelectItem key={career.id} value={career.id}>
                                  {career.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Docente</Label>
                          <Select
                            value={formData.teacherId}
                            onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar docente" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.firstName} {teacher.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Semestre</Label>
                          <Select
                            value={formData.semester?.toString()}
                            onValueChange={(value) => handleSemesterChange(parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar semestre" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                                <SelectItem key={sem} value={sem.toString()}>
                                  {sem}° Semestre - {getNivelLabel(calcularNivel(sem))}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Créditos</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: Number.parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Aula</Label>
                          <Input
                            value={formData.classroom}
                            onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                            placeholder="Lab. 101"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Horario</Label>
                          <Input
                            value={formData.schedule}
                            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                            placeholder="Lun, Mié, Vie 8:00-10:00"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">{editingSubject ? "Guardar Cambios" : "Crear Materia"}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">{subject.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getCareerName(subject.careerId)}</Badge>
                      </TableCell>
                      <TableCell>{getTeacherName(subject.teacherId)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Sem {subject.semester} - {getNivelLabel(subject.nivel)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" /> {subject.schedule}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" /> {subject.classroom}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subject.credits} créditos</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(subject)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteSubject(subject.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
