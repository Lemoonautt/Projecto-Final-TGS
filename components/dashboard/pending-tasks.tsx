"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { FileText, Calendar } from "lucide-react"

export function PendingTasks() {
  const { assignments, subjects, studentAssignments } = useStore()

  const activeAssignments = assignments
    .filter((a) => a.status === "active")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || "Desconocida"
  }

  const getPendingCount = (assignmentId: string) => {
    return studentAssignments.filter((sa) => sa.assignmentId === assignmentId && sa.status === "pending").length
  }

  const getTypeBadge = (type: string) => {
    const config: Record<string, { class: string; label: string }> = {
      homework: { class: "bg-blue-100 text-blue-700", label: "Tarea" },
      project: { class: "bg-purple-100 text-purple-700", label: "Proyecto" },
      exam: { class: "bg-red-100 text-red-700", label: "Examen" },
      quiz: { class: "bg-amber-100 text-amber-700", label: "Quiz" },
      presentation: { class: "bg-emerald-100 text-emerald-700", label: "Presentación" },
    }
    const c = config[type] || { class: "bg-gray-100 text-gray-700", label: type }
    return <Badge className={c.class}>{c.label}</Badge>
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tareas Próximas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{assignment.title}</p>
                <p className="text-xs text-muted-foreground">{getSubjectName(assignment.subjectId)}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeBadge(assignment.type)}
                  <span className="text-xs text-muted-foreground">{getPendingCount(assignment.id)} pendientes</span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`flex items-center gap-1 text-xs ${
                    isOverdue(assignment.dueDate) ? "text-red-600" : "text-muted-foreground"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {activeAssignments.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay tareas pendientes</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
