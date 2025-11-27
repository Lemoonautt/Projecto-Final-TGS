"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import type { Assignment, StudentAssignment } from "@/lib/data"

export default function TareasPage() {
  const {
    assignments,
    studentAssignments,
    students,
    subjects,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    updateStudentAssignment,
  } = useStore()
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isGradeOpen, setIsGradeOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [formData, setFormData] = useState<Partial<Assignment>>({
    subjectId: "",
    title: "",
    description: "",
    dueDate: "",
    maxScore: 10,
    type: "homework",
    status: "active",
  })

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      subjects
        .find((s) => s.id === a.subjectId)
        ?.name.toLowerCase()
        .includes(search.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData)
    } else {
      addAssignment({
        ...formData,
        id: Date.now().toString(),
      } as Assignment)
    }
    setIsOpen(false)
    setEditingAssignment(null)
    setFormData({
      subjectId: "",
      title: "",
      description: "",
      dueDate: "",
      maxScore: 10,
      type: "homework",
      status: "active",
    })
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setFormData(assignment)
    setIsOpen(true)
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || "Desconocida"
  }

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : "Desconocido"
  }

  const getTypeBadge = (type: Assignment["type"]) => {
    const config: Record<string, { class: string; label: string }> = {
      homework: { class: "bg-blue-100 text-blue-700", label: "Tarea" },
      project: { class: "bg-purple-100 text-purple-700", label: "Proyecto" },
      exam: { class: "bg-red-100 text-red-700", label: "Examen" },
      quiz: { class: "bg-amber-100 text-amber-700", label: "Quiz" },
      presentation: { class: "bg-emerald-100 text-emerald-700", label: "Presentación" },
    }
    const typeConfig = config[type] || { class: "bg-gray-100 text-gray-700", label: "Otro" }
    return <Badge className={typeConfig.class}>{typeConfig.label}</Badge>
  }

  const getSubmissionStatusBadge = (status: StudentAssignment["status"]) => {
    const config: Record<string, { icon: typeof Clock; class: string; label: string }> = {
      pending: { icon: Clock, class: "bg-gray-100 text-gray-700", label: "Pendiente" },
      submitted: { icon: CheckCircle, class: "bg-blue-100 text-blue-700", label: "Entregado" },
      graded: { icon: CheckCircle, class: "bg-emerald-100 text-emerald-700", label: "Calificado" },
      late: { icon: AlertTriangle, class: "bg-amber-100 text-amber-700", label: "Tardío" },
      missing: { icon: XCircle, class: "bg-red-100 text-red-700", label: "No Entregado" },
    }
    const statusConfig = config[status] || { icon: Clock, class: "bg-gray-100 text-gray-700", label: "Desconocido" }
    const { icon: Icon, class: className, label } = statusConfig
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getAssignmentSubmissions = (assignmentId: string) => {
    return studentAssignments.filter((sa) => sa.assignmentId === assignmentId)
  }

  // Stats
  const stats = useMemo(() => {
    const total = studentAssignments.length
    return {
      pending: studentAssignments.filter((sa) => sa.status === "pending").length,
      submitted: studentAssignments.filter((sa) => sa.status === "submitted").length,
      graded: studentAssignments.filter((sa) => sa.status === "graded").length,
      missing: studentAssignments.filter((sa) => sa.status === "missing").length,
    }
  }, [studentAssignments])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header title="Gestión de Tareas y Trabajos" />
        <main className="p-6">
          <Tabs defaultValue="tareas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tareas">Tareas y Trabajos</TabsTrigger>
              <TabsTrigger value="entregas">Entregas de Estudiantes</TabsTrigger>
            </TabsList>

            <TabsContent value="tareas" className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-gray-100 p-3">
                        <Clock className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.pending}</p>
                        <p className="text-sm text-muted-foreground">Pendientes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.submitted}</p>
                        <p className="text-sm text-muted-foreground">Por Calificar</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-emerald-100 p-3">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.graded}</p>
                        <p className="text-sm text-muted-foreground">Calificados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-100 p-3">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.missing}</p>
                        <p className="text-sm text-muted-foreground">No Entregados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Tareas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tareas y Trabajos Asignados</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar tarea..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setEditingAssignment(null)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Nueva Tarea
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingAssignment ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                              <Label>Título</Label>
                              <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Materia</Label>
                              <Select
                                value={formData.subjectId}
                                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar materia" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                      {subject.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, type: value as Assignment["type"] })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="homework">Tarea</SelectItem>
                                  <SelectItem value="project">Proyecto</SelectItem>
                                  <SelectItem value="exam">Examen</SelectItem>
                                  <SelectItem value="quiz">Quiz</SelectItem>
                                  <SelectItem value="presentation">Presentación</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Fecha de Entrega</Label>
                              <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Puntuación Máxima</Label>
                              <Input
                                type="number"
                                min="1"
                                value={formData.maxScore}
                                onChange={(e) =>
                                  setFormData({ ...formData, maxScore: Number.parseInt(e.target.value) })
                                }
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Descripción</Label>
                              <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Estado</Label>
                              <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, status: value as Assignment["status"] })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Activo</SelectItem>
                                  <SelectItem value="closed">Cerrado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit">{editingAssignment ? "Guardar Cambios" : "Crear Tarea"}</Button>
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
                        <TableHead>Tarea</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha Entrega</TableHead>
                        <TableHead>Puntuación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{assignment.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{assignment.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getSubjectName(assignment.subjectId)}</TableCell>
                          <TableCell>{getTypeBadge(assignment.type)}</TableCell>
                          <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{assignment.maxScore} pts</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                assignment.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {assignment.status === "active" ? "Activo" : "Cerrado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedAssignment(assignment)
                                  setIsGradeOpen(true)
                                }}
                              >
                                <ClipboardCheck className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(assignment)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => deleteAssignment(assignment.id)}>
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
            </TabsContent>

            <TabsContent value="entregas">
              <Card>
                <CardHeader>
                  <CardTitle>Entregas de Estudiantes</CardTitle>
                  <CardDescription>Estado de las entregas de todos los estudiantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Tarea</TableHead>
                        <TableHead>Fecha Entrega</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Puntuación</TableHead>
                        <TableHead>Retroalimentación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentAssignments.map((sa) => {
                        const assignment = assignments.find((a) => a.id === sa.assignmentId)
                        return (
                          <TableRow key={sa.id}>
                            <TableCell className="font-medium">{getStudentName(sa.studentId)}</TableCell>
                            <TableCell>{assignment?.title || "Desconocida"}</TableCell>
                            <TableCell>
                              {sa.submittedDate ? new Date(sa.submittedDate).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell>{getSubmissionStatusBadge(sa.status)}</TableCell>
                            <TableCell>
                              {sa.score !== undefined ? `${sa.score}/${assignment?.maxScore || 10}` : "-"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{sa.feedback || "-"}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal para calificar entregas */}
          <Dialog open={isGradeOpen} onOpenChange={setIsGradeOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Calificar: {selectedAssignment?.title}</DialogTitle>
              </DialogHeader>
              {selectedAssignment && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Puntuación</TableHead>
                      <TableHead>Retroalimentación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAssignmentSubmissions(selectedAssignment.id).map((sa) => (
                      <TableRow key={sa.id}>
                        <TableCell className="font-medium">{getStudentName(sa.studentId)}</TableCell>
                        <TableCell>{getSubmissionStatusBadge(sa.status)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={selectedAssignment.maxScore}
                            value={sa.score || ""}
                            onChange={(e) =>
                              updateStudentAssignment(sa.id, {
                                score: Number.parseFloat(e.target.value),
                                status: "graded",
                              })
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={sa.feedback || ""}
                            onChange={(e) => updateStudentAssignment(sa.id, { feedback: e.target.value })}
                            placeholder="Agregar comentario..."
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
