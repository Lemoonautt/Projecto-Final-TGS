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
import { Clock, MapPin, Users, BookOpen } from "lucide-react"

export default function MisMateriasPage() {
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

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 pl-64">
        <Header title="Mis Materias" subtitle={`${currentPeriod?.name} - Semestre ${student?.currentSemester}`} />
        <div className="p-6">
          {/* Resumen */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Materias Inscritas</p>
                    <p className="text-2xl font-bold">{enrolledSubjects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Créditos</p>
                    <p className="text-2xl font-bold">{enrolledSubjects.reduce((acc, s) => acc + s.credits, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera</p>
                    <p className="text-lg font-bold">{career?.code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de materias */}
          <div className="grid gap-4 md:grid-cols-2">
            {enrolledSubjects.map((subject) => {
              const teacher = teachers.find((t) => t.id === subject.teacherId)
              return (
                <Card key={subject.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {subject.code}
                        </Badge>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <CardDescription>{subject.description}</CardDescription>
                      </div>
                      <Badge className="bg-primary/10 text-primary">{subject.credits} créditos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Docente */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {teacher?.firstName[0]}
                            {teacher?.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {teacher?.firstName} {teacher?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{teacher?.academicRank}</p>
                        </div>
                      </div>

                      {/* Horario y aula */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {subject.schedule}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {subject.classroom}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {enrolledSubjects.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">No tienes materias inscritas</p>
                <p className="text-sm text-muted-foreground">Contacta a administración para inscribirte en materias</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
