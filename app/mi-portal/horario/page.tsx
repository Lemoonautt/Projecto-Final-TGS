"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useCurrentStudentId } from "@/lib/auth-store"
import { useStore } from "@/lib/store"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

export default function MiHorarioPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const studentId = useCurrentStudentId()
  const { students, subjects, enrollments, careers, academicPeriods, teachers } = useStore()

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

  // Agrupar materias por día
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const getSubjectsByDay = (dayAbbr: string) => {
    return enrolledSubjects.filter((subject) => subject.schedule.toLowerCase().includes(dayAbbr.toLowerCase()))
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 pl-64">
        <Header title="Mi Horario" subtitle={`${currentPeriod?.name} - ${career?.name}`} />
        <div className="p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Horario Semanal</CardTitle>
              <CardDescription>Tu horario de clases para el semestre {student?.currentSemester}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {days.map((day) => {
                  const daySubjects = getSubjectsByDay(day)
                  return (
                    <div key={day} className="space-y-2">
                      <div className="rounded-lg bg-muted px-3 py-2 text-center font-semibold">
                        {day === "Lun" && "Lunes"}
                        {day === "Mar" && "Martes"}
                        {day === "Mié" && "Miércoles"}
                        {day === "Jue" && "Jueves"}
                        {day === "Vie" && "Viernes"}
                        {day === "Sáb" && "Sábado"}
                      </div>
                      {daySubjects.length > 0 ? (
                        daySubjects.map((subject) => {
                          const teacher = teachers.find((t) => t.id === subject.teacherId)
                          // Extraer hora del schedule
                          const timeMatch = subject.schedule.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/)
                          const time = timeMatch ? timeMatch[0] : ""

                          return (
                            <div key={subject.id} className="rounded-lg border bg-card p-3 space-y-2">
                              <Badge variant="outline" className="text-xs w-full justify-center">
                                {subject.code}
                              </Badge>
                              <p className="text-sm font-medium text-center leading-tight">{subject.name}</p>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <p className="flex items-center justify-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {time}
                                </p>
                                <p className="flex items-center justify-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {subject.classroom}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                          Sin clases
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lista completa */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Materias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {enrolledSubjects.map((subject) => {
                  const teacher = teachers.find((t) => t.id === subject.teacherId)
                  return (
                    <div key={subject.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{subject.code}</Badge>
                            <span className="font-medium">{subject.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {teacher?.firstName} {teacher?.lastName}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {subject.schedule}
                          </p>
                          <p className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {subject.classroom}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
