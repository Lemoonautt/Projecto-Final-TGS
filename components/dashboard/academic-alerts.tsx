"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { AlertTriangle, TrendingDown, Clock } from "lucide-react"

export function AcademicAlerts() {
  const { studentRiskAlerts, students, selectedPeriodId, careers } = useStore()

  const activeAlerts = studentRiskAlerts
    .filter((a) => a.periodId === selectedPeriodId && !a.resolved)
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
    .slice(0, 5)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "medium":
        return <TrendingDown className="h-4 w-4 text-warning" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      case "high":
        return <Badge variant="destructive">Alto</Badge>
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medio</Badge>
      default:
        return <Badge variant="secondary">Bajo</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "attendance":
        return <Badge variant="outline">Asistencia</Badge>
      case "grades":
        return <Badge variant="outline">Calificaciones</Badge>
      case "dropout_risk":
        return <Badge variant="outline">Abandono</Badge>
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Alertas Académicas</CardTitle>
        <a href="/seguimiento" className="text-sm font-medium text-primary hover:underline">
          Ver todas
        </a>
      </CardHeader>
      <CardContent>
        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const student = students.find((s) => s.id === alert.studentId)
              const career = careers.find((c) => c.id === student?.careerId)
              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {student?.firstName} {student?.lastName}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {career?.code}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(alert.type)}
                      {getSeverityBadge(alert.severity)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-success/10 p-3">
              <AlertTriangle className="h-6 w-6 text-success" />
            </div>
            <p className="mt-2 text-sm font-medium">Sin alertas activas</p>
            <p className="text-xs text-muted-foreground">Todos los estudiantes están al día</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
