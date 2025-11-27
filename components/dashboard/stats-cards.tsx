"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  UserCheck,
  ClipboardCheck,
  AlertTriangle,
  Building2,
} from "lucide-react"
import { useStore } from "@/lib/store"

export function StatsCards() {
  const {
    students,
    subjects,
    grades,
    teachers,
    attendances,
    enrollments,
    withdrawals,
    careers,
    academicPeriods,
    studentRiskAlerts,
    selectedPeriodId,
  } = useStore()

  const currentPeriod = academicPeriods.find((p) => p.id === selectedPeriodId)

  // Estudiantes inscritos en la gestión actual
  const enrolledStudentIds = enrollments
    .filter((e) => e.periodId === selectedPeriodId && e.status === "active")
    .map((e) => e.studentId)
  const enrolledCount = enrolledStudentIds.length

  const activeStudents = students.filter((s) => s.status === "active").length
  const activeTeachers = teachers.filter((t) => t.status === "active").length

  // Calificaciones de la gestión actual
  const periodGrades = grades.filter((g) => g.periodId === selectedPeriodId)
  const averageGrade =
    periodGrades.length > 0 ? (periodGrades.reduce((acc, g) => acc + g.grade, 0) / periodGrades.length).toFixed(0) : "0"

  // Asistencias de la gestión actual
  const periodAttendances = attendances.filter((a) => a.periodId === selectedPeriodId)
  const attendanceRate =
    periodAttendances.length > 0
      ? Math.round((periodAttendances.filter((a) => a.status === "present").length / periodAttendances.length) * 100)
      : 0

  // Alertas activas
  const activeAlerts = studentRiskAlerts.filter((a) => a.periodId === selectedPeriodId && !a.resolved).length

  // Abandonos de la gestión
  const periodWithdrawals = withdrawals.filter((w) => w.periodId === selectedPeriodId).length

  const stats = [
    {
      title: "Estudiantes Inscritos",
      value: enrolledCount.toString(),
      change: currentPeriod?.name || "Gestión actual",
      changeType: "neutral" as const,
      icon: Users,
      description: `${activeStudents} activos en total`,
    },
    {
      title: "Docentes Activos",
      value: activeTeachers.toString(),
      change: `${teachers.length} total`,
      changeType: "neutral" as const,
      icon: UserCheck,
      description: `${teachers.filter((t) => t.status === "on_leave").length} de licencia`,
    },
    {
      title: "Carreras",
      value: careers.filter((c) => c.status === "active").length.toString(),
      change: "Activas",
      changeType: "positive" as const,
      icon: Building2,
      description: `${subjects.length} materias ofertadas`,
    },
    {
      title: "Promedio General",
      value: `${averageGrade}/100`,
      change: Number(averageGrade) >= 70 ? "Aprobatorio" : "Bajo",
      changeType: Number(averageGrade) >= 70 ? "positive" : "negative",
      icon: GraduationCap,
      description: `${periodGrades.length} calificaciones`,
    },
    {
      title: "Tasa Asistencia",
      value: `${attendanceRate}%`,
      change: attendanceRate >= 80 ? "Normal" : "Baja",
      changeType: attendanceRate >= 80 ? "positive" : "negative",
      icon: ClipboardCheck,
      description: `${periodAttendances.length} registros`,
    },
    {
      title: "Materias Activas",
      value: subjects.length.toString(),
      change: "En curso",
      changeType: "neutral" as const,
      icon: BookOpen,
      description: "Este semestre",
    },
    {
      title: "Alertas Activas",
      value: activeAlerts.toString(),
      change: activeAlerts > 0 ? "Requieren atención" : "Sin alertas",
      changeType: activeAlerts > 0 ? "negative" : "positive",
      icon: AlertTriangle,
      description: "Estudiantes en riesgo",
    },
    {
      title: "Abandonos",
      value: periodWithdrawals.toString(),
      change: `${withdrawals.filter((w) => w.type === "temporary").length} temporales`,
      changeType: "neutral" as const,
      icon: TrendingUp,
      description: "En esta gestión",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : stat.changeType === "negative"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
