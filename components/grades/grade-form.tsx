"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import type { Grade } from "@/lib/data"

interface GradeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade?: Grade | null
}

export function GradeForm({ open, onOpenChange, grade }: GradeFormProps) {
  const { students, courses, addGrade, updateGrade } = useStore()
  const [formData, setFormData] = useState<Partial<Grade>>({
    studentId: "",
    courseId: "",
    grade: 0,
    period: "",
    date: new Date().toISOString().split("T")[0],
    comments: "",
  })

  useEffect(() => {
    if (grade) {
      setFormData(grade)
    } else {
      setFormData({
        studentId: "",
        courseId: "",
        grade: 0,
        period: "",
        date: new Date().toISOString().split("T")[0],
        comments: "",
      })
    }
  }, [grade, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (grade) {
      updateGrade(grade.id, formData)
    } else {
      addGrade({
        ...formData,
        id: Date.now().toString(),
      } as Grade)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{grade ? "Editar Calificación" : "Nueva Calificación"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Estudiante</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estudiante" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Curso</Label>
            <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="grade">Calificación (0-10)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1er Trimestre">1er Trimestre</SelectItem>
                  <SelectItem value="2do Trimestre">2do Trimestre</SelectItem>
                  <SelectItem value="3er Trimestre">3er Trimestre</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios (opcional)</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
              placeholder="Observaciones sobre el desempeño del estudiante..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{grade ? "Guardar Cambios" : "Registrar Calificación"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
