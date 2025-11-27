"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useStore } from "@/lib/store"

export function GradeChart() {
  const { courses, grades } = useStore()

  const data = courses.slice(0, 5).map((course) => {
    const courseGrades = grades.filter((g) => g.courseId === course.id)
    const avgGrade =
      courseGrades.length > 0 ? courseGrades.reduce((acc, g) => acc + g.grade, 0) / courseGrades.length : 0

    return {
      name: course.name.length > 10 ? course.name.slice(0, 10) + "..." : course.name,
      promedio: Number(avgGrade.toFixed(1)),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Promedio por Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="promedio" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
