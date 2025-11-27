"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"
import { Users, AlertTriangle, CheckCircle, GraduationCap, Filter } from "lucide-react"

export default function SeguimientoPage() {
  const {
    students,
    subjects,
    attendances,
    grades,
    enrollments,
    academicPeriods,
    careers,
    studentRiskAlerts,
    selectedPeriodId,
    setSelectedPeriod,
  } = useStore()

  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)

  // Período actual
  const currentPeriod = academicPeriods.find((p) => p.id === selectedPeriodId)

  // Estudiantes inscritos en la gestión seleccionada
  const enrolledStudents = useMemo(() => {
    if (!selectedPeriodId) return []
    const periodEnrollments = enrollments.filter((e) => e.periodId === selectedPeriodId && e.status === "active")
    return periodEnrollments
      .map((e) => {
        const student = students.find((s) => s.id === e.studentId)
        return student ? { ...student, enrollment: e } : null
      })
      .filter(Boolean) as ((typeof students)[0] & { enrollment: (typeof enrollments)[0] })[]
  }, [enrollments, students, selectedPeriodId])

  // Filtrar por carrera
  const filteredStudents = useMemo(() => {
    if (!selectedCareerId) return enrolledStudents
    return enrolledStudents.filter((s) => s.careerId === selectedCareerId)
  }, [enrolledStudents, selectedCareerId])

  // Materias de la gestión
  const periodSubjects = useMemo(() => {
    if (!selectedPeriodId) return []
    const enrolledSubjectIds = new Set(
      enrollments.filter((e) => e.periodId === selectedPeriodId).flatMap((e) => e.subjectIds),
    )
    return subjects.filter((s) => enrolledSubjectIds.has(s.id))
  }, [enrollments, subjects, selectedPeriodId])

  // Estadísticas de asistencia por gestión
  const attendanceStats = useMemo(() => {
    if (!selectedPeriodId) return { present: 0, absent: 0, late: 0, excused: 0, total: 0, rate: 0 }
    const periodAttendances = attendances.filter((a) => a.periodId === selectedPeriodId)
    const stats = {
      present: periodAttendances.filter((a) => a.status === "present").length,
      absent: periodAttendances.filter((a) => a.status === "absent").length,
      late: periodAttendances.filter((a) => a.status === "late").length,
      excused: periodAttendances.filter((a) => a.status === "excused").length,
      total: periodAttendances.length,
      rate: 0,
    }
    stats.rate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
    return stats
  }, [attendances, selectedPeriodId])

  // Estadísticas de calificaciones por gestión
  const gradeStats = useMemo(() => {
    if (!selectedPeriodId) return { average: 0, passing: 0, failing: 0, total: 0 }
    const periodGrades = grades.filter((g) => g.periodId === selectedPeriodId)
    const avgGrade =
      periodGrades.length > 0 ? periodGrades.reduce((acc, g) => acc + g.grade, 0) / periodGrades.length : 0
    return {
      average: Math.round(avgGrade),
      passing: periodGrades.filter((g) => g.grade >= 51).length,
      failing: periodGrades.filter((g) => g.grade < 51).length,
      total: periodGrades.length,
    }
  }, [grades, selectedPeriodId])

  // Rendimiento por estudiante
  const studentPerformance = useMemo(() => {
    return filteredStudents.map((student) => {
      const studentGrades = grades.filter((g) => g.studentId === student.id && g.periodId === selectedPeriodId)
      const studentAttendances = attendances.filter(
        (a) => a.studentId === student.id && a.periodId === selectedPeriodId,
      )
      const avgGrade =
        studentGrades.length > 0 ? studentGrades.reduce((acc, g) => acc + g.grade, 0) / studentGrades.length : 0
      const attendanceRate =
        studentAttendances.length > 0
          ? Math.round(
              (studentAttendances.filter((a) => a.status === "present").length / studentAttendances.length) * 100,
            )
          : 0
      const alerts = studentRiskAlerts.filter(
        (a) => a.studentId === student.id && a.periodId === selectedPeriodId && !a.resolved,
      )
      const career = careers.find((c) => c.id === student.careerId)

      return {
        ...student,
        avgGrade: Math.round(avgGrade),
        attendanceRate,
        subjectsEnrolled: student.enrollment.subjectIds.length,
        alerts: alerts.length,
        riskLevel:
          alerts.length > 0
            ? alerts.some((a) => a.severity === "critical" || a.severity === "high")
              ? "high"
              : "medium"
            : "low",
        career,
      }
    })
  }, [filteredStudents, grades, attendances, studentRiskAlerts, selectedPeriodId, careers])

  // Rendimiento por materia
  const subjectPerformance = useMemo(() => {
    const subjectsToShow = selectedSubjectId ? periodSubjects.filter((s) => s.id === selectedSubjectId) : periodSubjects
    return subjectsToShow.map((subject) => {
      const subjectGrades = grades.filter((g) => g.subjectId === subject.id && g.periodId === selectedPeriodId)
      const subjectAttendances = attendances.filter(
        (a) => a.subjectId === subject.id && a.periodId === selectedPeriodId,
      )
      const avgGrade =
        subjectGrades.length > 0 ? subjectGrades.reduce((acc, g) => acc + g.grade, 0) / subjectGrades.length : 0
      const attendanceRate =
        subjectAttendances.length > 0
          ? Math.round(
              (subjectAttendances.filter((a) => a.status === "present").length / subjectAttendances.length) * 100,
            )
          : 0
      const enrolledCount = enrollments.filter(
        (e) => e.periodId === selectedPeriodId && e.subjectIds.includes(subject.id),
      ).length

      return {
        ...subject,
        avgGrade: Math.round(avgGrade),
        attendanceRate,
        enrolledCount,
        passingCount: subjectGrades.filter((g) => g.grade >= 51).length,
        failingCount: subjectGrades.filter((g) => g.grade < 51).length,
      }
    })
  }, [periodSubjects, grades, attendances, enrollments, selectedPeriodId, selectedSubjectId])

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">Alto Riesgo</Badge>
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Riesgo Medio</Badge>
      case "low":
        return <Badge className="bg-success text-success-foreground">Sin Riesgo</Badge>
      default:
        return <Badge variant="secondary">N/A</Badge>
    }
  }

  const getGradeBadge = (grade: number) => {
    if (grade >= 80) return <Badge className="bg-success text-success-foreground">{grade}</Badge>
    if (grade >= 51) return <Badge className="bg-warning text-warning-foreground">{grade}</Badge>
    return <Badge variant="destructive">{grade}</Badge>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Seguimiento Académico" subtitle="Control centralizado de asistencias y calificaciones" />
        <div className="p-6">
          {/* Filtros principales */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Filtros de Gestión</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="min-w-[200px]">
                  <label className="mb-1.5 block text-sm font-medium">Gestión Académica</label>
                  <Select value={selectedPeriodId || ""} onValueChange={(value) => setSelectedPeriod(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar gestión" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicPeriods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name} {period.status === "active" && "(Activa)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[200px]">
                  <label className="mb-1.5 block text-sm font-medium">Carrera</label>
                  <Select
                    value={selectedCareerId || "all"}
                    onValueChange={(value) => setSelectedCareerId(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las carreras" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las carreras</SelectItem>
                      {careers.map((career) => (
                        <SelectItem key={career.id} value={career.id}>
                          {career.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[200px]">
                  <label className="mb-1.5 block text-sm font-medium">Materia</label>
                  <Select
                    value={selectedSubjectId || "all"}
                    onValueChange={(value) => setSelectedSubjectId(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las materias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las materias</SelectItem>
                      {periodSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Estudiantes Inscritos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStudents.length}</div>
                <p className="text-xs text-muted-foreground">En {currentPeriod?.name || "la gestión"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Asistencia</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceStats.rate}%</div>
                <Progress value={attendanceStats.rate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
                <GraduationCap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradeStats.average}/100</div>
                <p className="text-xs text-muted-foreground">
                  {gradeStats.passing} aprobados, {gradeStats.failing} reprobados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentRiskAlerts.filter((a) => a.periodId === selectedPeriodId && !a.resolved).length}
                </div>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de contenido */}
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList>
              <TabsTrigger value="students">Por Estudiante</TabsTrigger>
              <TabsTrigger value="subjects">Por Materia</TabsTrigger>
              <TabsTrigger value="alerts">Alertas de Riesgo</TabsTrigger>
            </TabsList>

            {/* Tab: Por Estudiante */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Estudiante</CardTitle>
                  <CardDescription>
                    Seguimiento de calificaciones y asistencias de cada estudiante en {currentPeriod?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Semestre</TableHead>
                        <TableHead>Materias</TableHead>
                        <TableHead>Promedio</TableHead>
                        <TableHead>Asistencia</TableHead>
                        <TableHead>Riesgo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentPerformance.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">{student.studentCode}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.career?.code}</Badge>
                          </TableCell>
                          <TableCell>{student.currentSemester}°</TableCell>
                          <TableCell>{student.subjectsEnrolled}</TableCell>
                          <TableCell>{getGradeBadge(student.avgGrade)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={student.attendanceRate} className="w-16" />
                              <span className="text-sm">{student.attendanceRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getRiskBadge(student.riskLevel)}</TableCell>
                        </TableRow>
                      ))}
                      {studentPerformance.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No hay estudiantes inscritos en esta gestión
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Por Materia */}
            <TabsContent value="subjects">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Materia</CardTitle>
                  <CardDescription>Estadísticas de cada materia en {currentPeriod?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Materia</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Inscritos</TableHead>
                        <TableHead>Promedio</TableHead>
                        <TableHead>Aprobados</TableHead>
                        <TableHead>Reprobados</TableHead>
                        <TableHead>Asistencia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectPerformance.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{subject.code}</Badge>
                          </TableCell>
                          <TableCell>{subject.enrolledCount}</TableCell>
                          <TableCell>{getGradeBadge(subject.avgGrade)}</TableCell>
                          <TableCell>
                            <span className="text-success">{subject.passingCount}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-destructive">{subject.failingCount}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={subject.attendanceRate} className="w-16" />
                              <span className="text-sm">{subject.attendanceRate}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {subjectPerformance.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No hay materias en esta gestión
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Alertas */}
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Alertas de Riesgo Académico</CardTitle>
                  <CardDescription>Estudiantes que requieren seguimiento especial</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Severidad</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentRiskAlerts
                        .filter((a) => a.periodId === selectedPeriodId)
                        .sort((a, b) => (a.resolved ? 1 : -1))
                        .map((alert) => {
                          const student = students.find((s) => s.id === alert.studentId)
                          return (
                            <TableRow key={alert.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {student?.firstName} {student?.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{student?.studentCode}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {alert.type === "attendance" && "Asistencia"}
                                  {alert.type === "grades" && "Calificaciones"}
                                  {alert.type === "behavior" && "Comportamiento"}
                                  {alert.type === "dropout_risk" && "Riesgo de Abandono"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {alert.severity === "critical" && <Badge variant="destructive">Crítico</Badge>}
                                {alert.severity === "high" && <Badge variant="destructive">Alto</Badge>}
                                {alert.severity === "medium" && (
                                  <Badge className="bg-warning text-warning-foreground">Medio</Badge>
                                )}
                                {alert.severity === "low" && <Badge variant="secondary">Bajo</Badge>}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                              <TableCell>{new Date(alert.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {alert.resolved ? (
                                  <Badge className="bg-success text-success-foreground">Resuelto</Badge>
                                ) : (
                                  <Badge variant="outline">Pendiente</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      {studentRiskAlerts.filter((a) => a.periodId === selectedPeriodId).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No hay alertas en esta gestión
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
