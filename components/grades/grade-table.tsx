"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Grade } from "@/lib/data"

interface GradeTableProps {
  onEdit: (grade: Grade) => void
}

export function GradeTable({ onEdit }: GradeTableProps) {
  const { grades, students, courses, deleteGrade } = useStore()
  const [search, setSearch] = useState("")
  const [filterCourse, setFilterCourse] = useState<string>("all")

  const filteredGrades = grades.filter((grade) => {
    const student = students.find((s) => s.id === grade.studentId)
    const course = courses.find((c) => c.id === grade.courseId)

    const matchesSearch =
      student?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      course?.name.toLowerCase().includes(search.toLowerCase())

    const matchesCourse = filterCourse === "all" || grade.courseId === filterCourse

    return matchesSearch && matchesCourse
  })

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "bg-success/10 text-success"
    if (grade >= 7) return "bg-primary/10 text-primary"
    if (grade >= 5) return "bg-warning/10 text-warning-foreground"
    return "bg-destructive/10 text-destructive"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por estudiante o curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cursos</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.map((grade) => {
              const student = students.find((s) => s.id === grade.studentId)
              const course = courses.find((c) => c.id === grade.courseId)

              return (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">
                    {student?.firstName} {student?.lastName}
                  </TableCell>
                  <TableCell>{course?.name}</TableCell>
                  <TableCell>{grade.period}</TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(grade.grade)}>{grade.grade.toFixed(1)}</Badge>
                  </TableCell>
                  <TableCell>{new Date(grade.date).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(grade)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteGrade(grade.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
