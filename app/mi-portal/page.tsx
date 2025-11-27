"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useCurrentStudentId } from "@/lib/auth-store"
import { useStore } from "@/lib/store"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, BookOpen, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function MiPortalPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const studentId = useCurrentStudentId()
  const { students, grades, subjects, enrollments, attendances, careers, academicPeriods } = useStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role === "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !studentId) {
    return null
  }

  const student = students.find((s) => s.id === studentId)
  const career = careers.find((c) => c.id === student?.careerId)
  const currentPeriod = academicPeriods.find((p) => p.status === "active")

  // Obtener inscripción actual
  const currentEnrollment = enrollments.find((e) => e.studentId === studentId && e.periodId === currentPeriod?.id)

  // Obtener materias inscritas
  const enrolledSubjects = subjects.filter((s) => currentEnrollment?.subjectIds.includes(s.id))

  // Calificaciones del estudiante en el período actual
  const studentGrades = grades.filter((g) => g.studentId === studentId && g.periodId === currentPeriod?.id)

  // Calcular promedio general
  const calculateAverage = () => {
    if (studentGrades.length === 0) return 0
    const sum = studentGrades.reduce((acc, g) => acc + g.grade, 0)
    return sum / studentGrades.length
  }

  // Asistencias del estudiante
  const studentAttendances = attendances.filter((a) => a.studentId === studentId && a.periodId === currentPeriod?.id)

  const attendanceStats = {
    present: studentAttendances.filter((a) => a.status === "present").length,
    absent: studentAttendances.filter((a) => a.status === "absent").length,
    late: studentAttendances.filter((a) => a.status === "late").length,
    excused: studentAttendances.filter((a) => a.status === "excused").length,
    total: studentAttendances.length,
  }

  const attendanceRate =
    attendanceStats.total > 0
      ? ((attendanceStats.present + attendanceStats.excused) / attendanceStats.total) * 100
      : 100

  const average = calculateAverage()

  // Progreso en la carrera
  const totalSemesters = career?.duration || 10
  const progressPercentage = student ? (student.currentSemester / totalSemesters) * 100 : 0

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 pl-64">
        <Header
          title={`Bienvenido, ${student?.firstName}`}
          subtitle={`${career?.name} - Semestre ${student?.currentSemester}`}
        />
        <div className="p-6">
          {/* Perfil del estudiante */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {student?.firstName[0]}
                    {student?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {student?.firstName} {student?.lastName}
                  </h2>
                  <p className="text-muted-foreground">{student?.email}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge variant="outline">{student?.studentCode}</Badge>
                    <Badge className="bg-primary/10 text-primary">{career?.name}</Badge>
                    <Badge className="bg-success/10 text-success">Semestre {student?.currentSemester}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Gestión Actual</p>
                  <p className="text-lg font-semibold">{currentPeriod?.name}</p>
                </div>
              </div>

              {/* Progreso en la carrera */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso en la carrera</span>
                  <span className="text-sm text-muted-foreground">
                    Semestre {student?.currentSemester} de {totalSemesters}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Promedio</p>
                    <p className="text-2xl font-bold">{average.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Asistencia</p>
                    <p className="text-2xl font-bold">{attendanceRate.toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <BookOpen className="h-6 w-6 text-warning-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Materias</p>
                    <p className="text-2xl font-bold">{enrolledSubjects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créditos</p>
                    <p className="text-2xl font-bold">{enrolledSubjects.reduce((acc, s) => acc + s.credits, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Materias y horarios */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Materias Inscritas
                </CardTitle>
                <CardDescription>Tus materias del semestre actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledSubjects.map((subject) => {
                    const subjectGrades = studentGrades.filter((g) => g.subjectId === subject.id)
                    const subjectAvg =
                      subjectGrades.length > 0
                        ? subjectGrades.reduce((acc, g) => acc + g.grade, 0) / subjectGrades.length
                        : null

                    return (
                      <div key={subject.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {subject.code}
                            </Badge>
                            <h4 className="font-medium">{subject.name}</h4>
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {subject.schedule}
                            </span>
                            <span>{subject.classroom}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {subjectAvg !== null ? (
                            <Badge
                              className={
                                subjectAvg >= 70
                                  ? "bg-success/10 text-success"
                                  : subjectAvg >= 51
                                    ? "bg-warning/10 text-warning-foreground"
                                    : "bg-destructive/10 text-destructive"
                              }
                            >
                              {subjectAvg.toFixed(0)} pts
                            </Badge>
                          ) : (
                            <Badge variant="outline">Sin notas</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {enrolledSubjects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No tienes materias inscritas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resumen de asistencia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Resumen de Asistencia
                </CardTitle>
                <CardDescription>Tu registro de asistencia este semestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Asistencias</span>
                    <span className="font-medium text-success">{attendanceStats.present}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Faltas</span>
                    <span className="font-medium text-destructive">{attendanceStats.absent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tardanzas</span>
                    <span className="font-medium text-warning-foreground">{attendanceStats.late}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Justificadas</span>
                    <span className="font-medium">{attendanceStats.excused}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Tasa de asistencia</span>
                      <span className="font-bold text-lg">{attendanceRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={attendanceRate} className="h-2" />
                    {attendanceRate < 75 && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                        <p className="text-sm text-destructive">
                          Tu asistencia está por debajo del mínimo requerido (75%)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
