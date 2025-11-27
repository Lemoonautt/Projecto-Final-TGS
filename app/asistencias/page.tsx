"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, CheckCircle, XCircle, Clock, AlertCircle, TrendingDown } from "lucide-react"
import type { Attendance } from "@/lib/data"

export default function AsistenciasPage() {
  const { attendances, students, subjects, addAttendance, bulkAddAttendance } = useStore()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [bulkAttendance, setBulkAttendance] = useState<Record<string, Attendance["status"]>>({})

  const activeStudents = students.filter((s) => s.status === "active")

  const todayAttendances = useMemo(() => {
    return attendances.filter((a) => a.date === selectedDate)
  }, [attendances, selectedDate])

  const attendanceStats = useMemo(() => {
    const today = todayAttendances
    return {
      present: today.filter((a) => a.status === "present").length,
      absent: today.filter((a) => a.status === "absent").length,
      late: today.filter((a) => a.status === "late").length,
      excused: today.filter((a) => a.status === "excused").length,
    }
  }, [todayAttendances])

  // Estudiantes con más inasistencias
  const studentsWithMostAbsences = useMemo(() => {
    const absenceCount: Record<string, number> = {}
    attendances
      .filter((a) => a.status === "absent")
      .forEach((a) => {
        absenceCount[a.studentId] = (absenceCount[a.studentId] || 0) + 1
      })

    return Object.entries(absenceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([studentId, count]) => {
        const student = students.find((s) => s.id === studentId)
        return { student, count }
      })
      .filter((item) => item.student)
  }, [attendances, students])

  const handleBulkSubmit = () => {
    if (!selectedSubject) return

    const newAttendances: Attendance[] = Object.entries(bulkAttendance).map(([studentId, status]) => ({
      id: Date.now().toString() + studentId,
      studentId,
      subjectId: selectedSubject,
      date: selectedDate,
      status,
    }))

    bulkAddAttendance(newAttendances)
    setIsOpen(false)
    setBulkAttendance({})
    setSelectedSubject("")
  }

  const initializeBulkAttendance = () => {
    const initial: Record<string, Attendance["status"]> = {}
    activeStudents.forEach((s) => {
      initial[s.id] = "present"
    })
    setBulkAttendance(initial)
  }

  const getStatusBadge = (status: Attendance["status"]) => {
    const config = {
      present: { icon: CheckCircle, class: "bg-emerald-100 text-emerald-700", label: "Presente" },
      absent: { icon: XCircle, class: "bg-red-100 text-red-700", label: "Ausente" },
      late: { icon: Clock, class: "bg-amber-100 text-amber-700", label: "Tardanza" },
      excused: { icon: AlertCircle, class: "bg-blue-100 text-blue-700", label: "Justificado" },
    }
    const { icon: Icon, class: className, label } = config[status]
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : "Desconocido"
  }

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject?.name || "Desconocida"
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header title="Control de Asistencias" />
        <main className="p-6">
          <Tabs defaultValue="registro" className="space-y-6">
            <TabsList>
              <TabsTrigger value="registro">Registro Diario</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="alertas">Alertas de Inasistencia</TabsTrigger>
            </TabsList>

            <TabsContent value="registro" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-emerald-100 p-3">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{attendanceStats.present}</p>
                        <p className="text-sm text-muted-foreground">Presentes</p>
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
                        <p className="text-2xl font-bold">{attendanceStats.absent}</p>
                        <p className="text-sm text-muted-foreground">Ausentes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-amber-100 p-3">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{attendanceStats.late}</p>
                        <p className="text-sm text-muted-foreground">Tardanzas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-3">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{attendanceStats.excused}</p>
                        <p className="text-sm text-muted-foreground">Justificados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registro de Asistencia */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Registro de Asistencia</CardTitle>
                    <CardDescription>Toma de asistencia por materia y fecha</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            initializeBulkAttendance()
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Tomar Asistencia
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Registrar Asistencia - {selectedDate}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Materia</Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar materia" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name} - {subject.gradeLevel}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Estudiante</TableHead>
                                <TableHead>Grado</TableHead>
                                <TableHead>Estado</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activeStudents.map((student) => (
                                <TableRow key={student.id}>
                                  <TableCell className="font-medium">
                                    {student.firstName} {student.lastName}
                                  </TableCell>
                                  <TableCell>{student.grade}</TableCell>
                                  <TableCell>
                                    <Select
                                      value={bulkAttendance[student.id] || "present"}
                                      onValueChange={(value) =>
                                        setBulkAttendance({
                                          ...bulkAttendance,
                                          [student.id]: value as Attendance["status"],
                                        })
                                      }
                                    >
                                      <SelectTrigger className="w-36">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="present">Presente</SelectItem>
                                        <SelectItem value="absent">Ausente</SelectItem>
                                        <SelectItem value="late">Tardanza</SelectItem>
                                        <SelectItem value="excused">Justificado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleBulkSubmit} disabled={!selectedSubject}>
                              Guardar Asistencia
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAttendances.length > 0 ? (
                        todayAttendances.map((attendance) => (
                          <TableRow key={attendance.id}>
                            <TableCell className="font-medium">{getStudentName(attendance.studentId)}</TableCell>
                            <TableCell>{getSubjectName(attendance.subjectId)}</TableCell>
                            <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                            <TableCell className="text-muted-foreground">{attendance.notes || "-"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No hay registros de asistencia para esta fecha
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Asistencias</CardTitle>
                  <CardDescription>Registro completo de todas las asistencias</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendances
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((attendance) => (
                          <TableRow key={attendance.id}>
                            <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">{getStudentName(attendance.studentId)}</TableCell>
                            <TableCell>{getSubjectName(attendance.subjectId)}</TableCell>
                            <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                            <TableCell className="text-muted-foreground">{attendance.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alertas">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    Estudiantes con Mayor Inasistencia
                  </CardTitle>
                  <CardDescription>Estudiantes que requieren seguimiento por alta cantidad de faltas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Tutor</TableHead>
                        <TableHead>Teléfono Tutor</TableHead>
                        <TableHead>Total Inasistencias</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsWithMostAbsences.map(({ student, count }) => (
                        <TableRow key={student!.id}>
                          <TableCell className="font-medium">
                            {student!.firstName} {student!.lastName}
                          </TableCell>
                          <TableCell>{student!.grade}</TableCell>
                          <TableCell>{student!.parentName}</TableCell>
                          <TableCell>{student!.parentPhone}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                count >= 5
                                  ? "bg-red-100 text-red-700"
                                  : count >= 3
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-700"
                              }
                            >
                              {count} faltas
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {count >= 5 ? (
                              <Badge className="bg-red-100 text-red-700">Crítico</Badge>
                            ) : count >= 3 ? (
                              <Badge className="bg-amber-100 text-amber-700">Atención</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700">Normal</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {studentsWithMostAbsences.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No hay alertas de inasistencia
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
