"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

export function RecentStudents() {
  const { students, careers, enrollments, selectedPeriodId } = useStore()

  // Estudiantes inscritos en la gestión actual
  const enrolledStudentIds = enrollments
    .filter((e) => e.periodId === selectedPeriodId && e.status === "active")
    .map((e) => e.studentId)

  const recentStudents = students.filter((s) => enrolledStudentIds.includes(s.id)).slice(0, 5)

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; class: string }> = {
      active: { label: "Activo", class: "bg-success/10 text-success" },
      suspended: { label: "Suspendido", class: "bg-warning/10 text-warning" },
      withdrawn: { label: "Retirado", class: "bg-destructive/10 text-destructive" },
      inactive: { label: "Inactivo", class: "bg-muted text-muted-foreground" },
      graduated: { label: "Graduado", class: "bg-primary/10 text-primary" },
    }
    const { label, class: className } = config[status] || config.inactive
    return <Badge className={className}>{label}</Badge>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Estudiantes Inscritos</CardTitle>
        <a href="/estudiantes" className="text-sm font-medium text-primary hover:underline">
          Ver todos
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentStudents.map((student) => {
            const career = careers.find((c) => c.id === student.careerId)
            return (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{student.studentCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <Badge variant="outline">{career?.code}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{student.currentSemester}° semestre</p>
                  </div>
                  {getStatusBadge(student.status)}
                </div>
              </div>
            )
          })}
          {recentStudents.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay estudiantes inscritos en esta gestión</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
