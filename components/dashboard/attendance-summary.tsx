"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

export function AttendanceSummary() {
  const { attendances, students, careers, selectedPeriodId } = useStore()

  // Obtener asistencias de la gestión actual
  const periodAttendances = attendances.filter((a) => a.periodId === selectedPeriodId)

  const stats = {
    present: periodAttendances.filter((a) => a.status === "present").length,
    absent: periodAttendances.filter((a) => a.status === "absent").length,
    late: periodAttendances.filter((a) => a.status === "late").length,
    excused: periodAttendances.filter((a) => a.status === "excused").length,
  }

  // Estudiantes con más faltas en la gestión
  const absenceCount: Record<string, number> = {}
  periodAttendances
    .filter((a) => a.status === "absent")
    .forEach((a) => {
      absenceCount[a.studentId] = (absenceCount[a.studentId] || 0) + 1
    })

  const topAbsent = Object.entries(absenceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([studentId, count]) => {
      const student = students.find((s) => s.id === studentId)
      const career = careers.find((c) => c.id === student?.careerId)
      return {
        name: student ? `${student.firstName} ${student.lastName}` : "Desconocido",
        career: career?.code || "",
        count,
      }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumen de Asistencia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 rounded-lg bg-success/10">
            <CheckCircle className="h-5 w-5 text-success mb-1" />
            <span className="text-xl font-bold text-success">{stats.present}</span>
            <span className="text-xs text-success">Presentes</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-destructive/10">
            <XCircle className="h-5 w-5 text-destructive mb-1" />
            <span className="text-xl font-bold text-destructive">{stats.absent}</span>
            <span className="text-xs text-destructive">Ausentes</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-warning/10">
            <Clock className="h-5 w-5 text-warning mb-1" />
            <span className="text-xl font-bold text-warning">{stats.late}</span>
            <span className="text-xs text-warning">Tardanzas</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-primary/10">
            <AlertCircle className="h-5 w-5 text-primary mb-1" />
            <span className="text-xl font-bold text-primary">{stats.excused}</span>
            <span className="text-xs text-primary">Justificados</span>
          </div>
        </div>

        {topAbsent.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Estudiantes con más faltas</h4>
            <div className="space-y-2">
              {topAbsent.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{item.career}</span>
                  </div>
                  <span className="text-destructive font-medium">{item.count} faltas</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
