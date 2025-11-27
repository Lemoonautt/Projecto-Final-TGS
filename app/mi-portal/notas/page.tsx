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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, TrendingUp, Minus } from "lucide-react"

const gradeTypeLabels: Record<string, string> = {
  partial1: "Parcial 1",
  partial2: "Parcial 2",
  partial3: "Parcial 3",
  final: "Final",
  recovery: "Recuperatorio",
  practice: "Práctica",
}

export default function MisNotasPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const studentId = useCurrentStudentId()
  const { students, grades, subjects, careers, academicPeriods, enrollments, teachers } = useStore()

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

  const studentGrades = grades.filter((g) => g.studentId === studentId && g.periodId === currentPeriod?.id)

  // Calcular notas por materia
  const getSubjectGrades = (subjectId: string) => {
    return studentGrades.filter((g) => g.subjectId === subjectId)
  }

  const calculateSubjectFinal = (subjectId: string) => {
    const subjectGrades = getSubjectGrades(subjectId)
    if (subjectGrades.length === 0) return null

    // Calcular nota ponderada
    let totalWeight = 0
    let weightedSum = 0

    subjectGrades.forEach((g) => {
      weightedSum += (g.grade / g.maxGrade) * 100 * (g.weight / 100)
      totalWeight += g.weight
    })

    if (totalWeight === 0) return null
    return (weightedSum / totalWeight) * 100
  }

  // Calcular promedio general
  const generalAverage = () => {
    const averages = enrolledSubjects
      .map((s) => calculateSubjectFinal(s.id))
      .filter((avg): avg is number => avg !== null)

    if (averages.length === 0) return 0
    return averages.reduce((acc, avg) => acc + avg, 0) / averages.length
  }

  const avg = generalAverage()

  const getGradeStatus = (grade: number) => {
    if (grade >= 70) return { label: "Aprobado", color: "bg-success/10 text-success" }
    if (grade >= 51) return { label: "En proceso", color: "bg-warning/10 text-warning-foreground" }
    return { label: "Reprobado", color: "bg-destructive/10 text-destructive" }
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 pl-64">
        <Header title="Mis Calificaciones" subtitle={`${currentPeriod?.name} - ${career?.name}`} />
        <div className="p-6">
          {/* Resumen general */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Promedio General</p>
                    <p className="text-3xl font-bold">{avg.toFixed(1)}</p>
                    <Badge className={getGradeStatus(avg).color}>{getGradeStatus(avg).label}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
                    <TrendingUp className="h-7 w-7 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mejor Nota</p>
                    {studentGrades.length > 0 ? (
                      <>
                        <p className="text-3xl font-bold">{Math.max(...studentGrades.map((g) => g.grade))}</p>
                        <p className="text-xs text-muted-foreground">
                          {
                            subjects.find(
                              (s) =>
                                s.id ===
                                studentGrades.find((g) => g.grade === Math.max(...studentGrades.map((g) => g.grade)))
                                  ?.subjectId,
                            )?.name
                          }
                        </p>
                      </>
                    ) : (
                      <p className="text-lg text-muted-foreground">Sin notas</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <Minus className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Materias Evaluadas</p>
                    <p className="text-3xl font-bold">{new Set(studentGrades.map((g) => g.subjectId)).size}</p>
                    <p className="text-xs text-muted-foreground">de {enrolledSubjects.length} inscritas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs por materia */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Calificaciones</CardTitle>
              <CardDescription>Revisa tus notas por cada materia inscrita</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={enrolledSubjects[0]?.id} className="w-full">
                <TabsList className="mb-4 flex flex-wrap gap-1 h-auto">
                  {enrolledSubjects.map((subject) => (
                    <TabsTrigger key={subject.id} value={subject.id} className="text-sm">
                      {subject.code}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {enrolledSubjects.map((subject) => {
                  const subjectGrades = getSubjectGrades(subject.id)
                  const finalGrade = calculateSubjectFinal(subject.id)
                  const teacher = teachers.find((t) => t.id === subject.teacherId)

                  return (
                    <TabsContent key={subject.id} value={subject.id}>
                      <div className="space-y-4">
                        {/* Info de la materia */}
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                          <div>
                            <h3 className="font-semibold text-lg">{subject.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {teacher?.firstName} {teacher?.lastName} · {subject.credits} créditos
                            </p>
                          </div>
                          {finalGrade !== null && (
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Nota Parcial</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{finalGrade.toFixed(1)}</span>
                                <Badge className={getGradeStatus(finalGrade).color}>
                                  {getGradeStatus(finalGrade).label}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tabla de notas */}
                        {subjectGrades.length > 0 ? (
                          <div className="rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Evaluación</TableHead>
                                  <TableHead>Fecha</TableHead>
                                  <TableHead className="text-center">Nota</TableHead>
                                  <TableHead className="text-center">Máximo</TableHead>
                                  <TableHead className="text-center">Peso</TableHead>
                                  <TableHead>Comentarios</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subjectGrades.map((grade) => (
                                  <TableRow key={grade.id}>
                                    <TableCell className="font-medium">
                                      {gradeTypeLabels[grade.type] || grade.type}
                                    </TableCell>
                                    <TableCell>{new Date(grade.date).toLocaleDateString("es-ES")}</TableCell>
                                    <TableCell className="text-center">
                                      <Badge
                                        className={
                                          (grade.grade / grade.maxGrade) * 100 >= 70
                                            ? "bg-success/10 text-success"
                                            : (grade.grade / grade.maxGrade) * 100 >= 51
                                              ? "bg-warning/10 text-warning-foreground"
                                              : "bg-destructive/10 text-destructive"
                                        }
                                      >
                                        {grade.grade}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                      {grade.maxGrade}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">{grade.weight}%</TableCell>
                                    <TableCell className="text-muted-foreground">{grade.comments || "-"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 rounded-lg border border-dashed">
                            <GraduationCap className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                              Aún no hay calificaciones registradas para esta materia
                            </p>
                          </div>
                        )}

                        {/* Barra de progreso de nota */}
                        {finalGrade !== null && (
                          <div className="pt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progreso hacia aprobación (70 pts)</span>
                              <span className="font-medium">{finalGrade.toFixed(1)} / 100</span>
                            </div>
                            <Progress value={finalGrade} className="h-3" />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
