"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useCurrentStudentId } from "@/lib/auth-store"
import { useStore } from "@/lib/store"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, AlertCircle, Calendar } from "lucide-react"

const statusConfig = {
  present: { label: "Presente", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  absent: { label: "Ausente", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  late: { label: "Tardanza", icon: Clock, color: "text-warning-foreground", bg: "bg-warning/10" },
  excused: { label: "Justificado", icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" },
}

export default function MiAsistenciaPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const studentId = useCurrentStudentId()
  const { students, attendances, subjects, enrollments, careers, academicPeriods } = useStore()

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
  const currentEnrollment = enrollments.find((e) => e.studentId === studentId && e.periodId === currentPeriod?.id)

  const enrolledSubjects = subjects.filter((s) => currentEnrollment?.subjectIds.includes(s.id))

  const studentAttendances = attendances.filter((a) => a.studentId === studentId && a.periodId === currentPeriod?.id)

  // Estadísticas por materia
  const getSubjectAttendance = (subjectId: string) => {
    const subjectAttendances = studentAttendances.filter((a) => a.subjectId === subjectId)
    const present = subjectAttendances.filter((a) => a.status === "present").length
    const absent = subjectAttendances.filter((a) => a.status === "absent").length
    const late = subjectAttendances.filter((a) => a.status === "late").length
    const excused = subjectAttendances.filter((a) => a.status === "excused").length
    const total = subjectAttendances.length
    const rate = total > 0 ? ((present + excused) / total) * 100 : 100

    return { present, absent, late, excused, total, rate }
  }

  // Estadísticas generales
  const totalStats = {
    present: studentAttendances.filter((a) => a.status === "present").length,
    absent: studentAttendances.filter((a) => a.status === "absent").length,
    late: studentAttendances.filter((a) => a.status === "late").length,
    excused: studentAttendances.filter((a) => a.status === "excused").length,
    total: studentAttendances.length,
  }
  const overallRate = totalStats.total > 0 ? ((totalStats.present + totalStats.excused) / totalStats.total) * 100 : 100

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 pl-64">
        <Header title="Mi Asistencia" subtitle={`${currentPeriod?.name}`} />
        <div className="p-6">
          {/* Resumen general */}
          <div className="grid gap-4 md:grid-cols-5 mb-6">
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa de Asistencia</p>
                    <p className="text-3xl font-bold">{overallRate.toFixed(0)}%</p>
                  </div>
                  <div
                    className={`h-16 w-16 rounded-full flex items-center justify-center ${
                      overallRate >= 75 ? "bg-success/10" : "bg-destructive/10"
                    }`}
                  >
                    {overallRate >= 75 ? (
                      <CheckCircle className="h-8 w-8 text-success" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    )}
                  </div>
                </div>
                <Progress value={overallRate} className="h-2" />
                {overallRate < 75 && (
                  <p className="mt-2 text-xs text-destructive">
                    Tu asistencia está por debajo del mínimo requerido (75%)
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-6 w-6 mx-auto text-success mb-2" />
                <p className="text-2xl font-bold">{totalStats.present}</p>
                <p className="text-xs text-muted-foreground">Asistencias</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <XCircle className="h-6 w-6 mx-auto text-destructive mb-2" />
                <p className="text-2xl font-bold">{totalStats.absent}</p>
                <p className="text-xs text-muted-foreground">Faltas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-6 w-6 mx-auto text-warning-foreground mb-2" />
                <p className="text-2xl font-bold">{totalStats.late}</p>
                <p className="text-xs text-muted-foreground">Tardanzas</p>
              </CardContent>
            </Card>
          </div>

          {/* Asistencia por materia */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Asistencia por Materia</CardTitle>
              <CardDescription>Resumen de asistencia en cada una de tus materias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledSubjects.map((subject) => {
                  const stats = getSubjectAttendance(subject.id)
                  return (
                    <div key={subject.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {subject.code}
                          </Badge>
                          <p className="font-medium">{subject.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{stats.rate.toFixed(0)}%</p>
                          <Badge
                            className={
                              stats.rate >= 75 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                            }
                          >
                            {stats.total} clases
                          </Badge>
                        </div>
                      </div>
                      <Progress value={stats.rate} className="h-2 mb-2" />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-success" />
                          {stats.present} presentes
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-destructive" />
                          {stats.absent} faltas
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-warning-foreground" />
                          {stats.late} tardanzas
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Historial de asistencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historial de Asistencia
              </CardTitle>
              <CardDescription>Registro detallado de tus asistencias</CardDescription>
            </CardHeader>
            <CardContent>
              {studentAttendances.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentAttendances
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((attendance) => {
                          const subject = subjects.find((s) => s.id === attendance.subjectId)
                          const config = statusConfig[attendance.status]
                          const Icon = config.icon

                          return (
                            <TableRow key={attendance.id}>
                              <TableCell>
                                {new Date(attendance.date).toLocaleDateString("es-ES", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{subject?.name}</p>
                                  <p className="text-xs text-muted-foreground">{subject?.code}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${config.bg} ${config.color}`}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">{attendance.notes || "-"}</TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No hay registros de asistencia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
