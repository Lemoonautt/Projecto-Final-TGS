"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  UserX,
  Clock,
  ArrowRightLeft,
  Calendar,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Briefcase,
  Heart,
  Home,
  BookX,
  CalendarX,
  HelpCircle,
  GraduationCap,
} from "lucide-react"
import { type Withdrawal, type WithdrawalReason, withdrawalReasonLabels } from "@/lib/data"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const reasonIcons: Record<WithdrawalReason, React.ElementType> = {
  economic: DollarSign,
  academic_performance: TrendingDown,
  health: Heart,
  work: Briefcase,
  family: Home,
  relocation: Home,
  lack_of_interest: BookX,
  schedule_conflict: CalendarX,
  other: HelpCircle,
}

const reasonColors: Record<WithdrawalReason, string> = {
  economic: "#ef4444",
  academic_performance: "#f97316",
  health: "#ec4899",
  work: "#8b5cf6",
  family: "#06b6d4",
  relocation: "#14b8a6",
  lack_of_interest: "#eab308",
  schedule_conflict: "#6366f1",
  other: "#6b7280",
}

export default function BajasPage() {
  const {
    withdrawals,
    students,
    academicPeriods,
    careers,
    enrollments,
    selectedPeriodId,
    setSelectedPeriod,
    addWithdrawal,
    updateWithdrawal,
    updateStudent,
  } = useStore()

  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filterReason, setFilterReason] = useState<string>("all")
  const [formData, setFormData] = useState<Partial<Withdrawal>>({
    studentId: "",
    periodId: selectedPeriodId || "",
    date: new Date().toISOString().split("T")[0],
    reason: "other" as WithdrawalReason,
    type: "temporary",
    notes: "",
    returnDate: "",
    riskLevel: "medium",
    followUpNotes: "",
  })

  const currentPeriod = academicPeriods.find((p) => p.id === selectedPeriodId)

  // Estudiantes disponibles para dar de baja (activos en la gestión actual)
  const availableStudents = useMemo(() => {
    const enrolledIds = enrollments
      .filter((e) => e.periodId === selectedPeriodId && e.status === "active")
      .map((e) => e.studentId)
    return students.filter((s) => s.status === "active" && enrolledIds.includes(s.id))
  }, [students, enrollments, selectedPeriodId])

  const reasonStats = useMemo(() => {
    const counts: Record<string, number> = {}
    withdrawals.forEach((w) => {
      counts[w.reason] = (counts[w.reason] || 0) + 1
    })
    return Object.entries(counts)
      .map(([reason, count]) => ({
        name: withdrawalReasonLabels[reason as WithdrawalReason] || reason,
        value: count,
        reason: reason as WithdrawalReason,
        color: reasonColors[reason as WithdrawalReason] || "#6b7280",
      }))
      .sort((a, b) => b.value - a.value)
  }, [withdrawals])

  // Estadísticas por tipo
  const stats = useMemo(() => {
    const periodWithdrawals = withdrawals.filter((w) => !selectedPeriodId || w.periodId === selectedPeriodId)
    return {
      temporary: periodWithdrawals.filter((w) => w.type === "temporary").length,
      permanent: periodWithdrawals.filter((w) => w.type === "permanent").length,
      transfer: periodWithdrawals.filter((w) => w.type === "transfer").length,
      academic: periodWithdrawals.filter((w) => w.type === "academic").length,
      total: periodWithdrawals.length,
      highRisk: periodWithdrawals.filter((w) => w.riskLevel === "high").length,
    }
  }, [withdrawals, selectedPeriodId])

  const careerStats = useMemo(() => {
    const counts: Record<string, number> = {}
    withdrawals.forEach((w) => {
      const student = students.find((s) => s.id === w.studentId)
      if (student) {
        const career = careers.find((c) => c.id === student.careerId)
        const careerName = career?.code || "Sin carrera"
        counts[careerName] = (counts[careerName] || 0) + 1
      }
    })
    return Object.entries(counts).map(([name, count]) => ({ name, abandonos: count }))
  }, [withdrawals, students, careers])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addWithdrawal({
      ...formData,
      id: Date.now().toString(),
      periodId: selectedPeriodId || formData.periodId,
    } as Withdrawal)

    updateStudent(formData.studentId!, {
      status: formData.type === "temporary" ? "suspended" : "withdrawn",
      withdrawalDate: formData.date,
      withdrawalReason: withdrawalReasonLabels[formData.reason as WithdrawalReason],
    })

    setIsOpen(false)
    setFormData({
      studentId: "",
      periodId: selectedPeriodId || "",
      date: new Date().toISOString().split("T")[0],
      reason: "other" as WithdrawalReason,
      type: "temporary",
      notes: "",
      returnDate: "",
      riskLevel: "medium",
      followUpNotes: "",
    })
  }

  const handleReactivate = (studentId: string, withdrawalId: string) => {
    updateStudent(studentId, { status: "active" })
    updateWithdrawal(withdrawalId, { returnDate: new Date().toISOString().split("T")[0] })
  }

  const getStudentInfo = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return null
    const career = careers.find((c) => c.id === student.careerId)
    return { ...student, career }
  }

  const getTypeBadge = (type: Withdrawal["type"]) => {
    const config = {
      temporary: { icon: Clock, class: "bg-warning/20 text-warning-foreground border-warning", label: "Temporal" },
      permanent: { icon: UserX, class: "bg-destructive/20 text-destructive border-destructive", label: "Definitiva" },
      transfer: { icon: ArrowRightLeft, class: "bg-primary/20 text-primary border-primary", label: "Traslado" },
      academic: { icon: GraduationCap, class: "bg-muted text-muted-foreground border-muted", label: "Académica" },
    }
    const { icon: Icon, class: className, label } = config[type]
    return (
      <Badge variant="outline" className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">Alto</Badge>
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medio</Badge>
      case "low":
        return <Badge className="bg-success text-success-foreground">Bajo</Badge>
      default:
        return <Badge variant="secondary">N/A</Badge>
    }
  }

  const filteredWithdrawals = withdrawals.filter((w) => {
    const student = getStudentInfo(w.studentId)
    const matchesSearch =
      student?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      withdrawalReasonLabels[w.reason]?.toLowerCase().includes(search.toLowerCase())
    const matchesPeriod = !selectedPeriodId || w.periodId === selectedPeriodId
    const matchesReason = filterReason === "all" || w.reason === filterReason
    return matchesSearch && matchesPeriod && matchesReason
  })

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header title="Gestión de Abandonos" subtitle="Control y análisis de bajas universitarias" />
        <main className="p-6">
          <Tabs defaultValue="registro" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="registro">Registro de Bajas</TabsTrigger>
                <TabsTrigger value="analisis">Análisis de Causas</TabsTrigger>
                <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
              </TabsList>

              {/* Selector de gestión */}
              <Select value={selectedPeriodId || ""} onValueChange={(value) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar gestión" />
                </SelectTrigger>
                <SelectContent>
                  {academicPeriods.map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tab: Registro */}
            <TabsContent value="registro" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-5">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-muted p-3">
                        <UserX className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-sm text-muted-foreground">Total Bajas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-warning/20 p-3">
                        <Clock className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.temporary}</p>
                        <p className="text-sm text-muted-foreground">Temporales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-destructive/20 p-3">
                        <UserX className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.permanent}</p>
                        <p className="text-sm text-muted-foreground">Definitivas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/20 p-3">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.academic}</p>
                        <p className="text-sm text-muted-foreground">Académicas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-destructive/20 p-3">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.highRisk}</p>
                        <p className="text-sm text-muted-foreground">Alto Riesgo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de registros */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Registro de Bajas - {currentPeriod?.name || "Todas las gestiones"}</CardTitle>
                    <CardDescription>
                      Historial de estudiantes que han abandonado o pausado sus estudios
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select value={filterReason} onValueChange={setFilterReason}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por causa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las causas</SelectItem>
                        {Object.entries(withdrawalReasonLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Registrar Baja
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Registrar Abandono de Estudiante</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label>Estudiante</Label>
                            <Select
                              value={formData.studentId}
                              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estudiante" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableStudents.map((student) => {
                                  const career = careers.find((c) => c.id === student.careerId)
                                  return (
                                    <SelectItem key={student.id} value={student.id}>
                                      {student.firstName} {student.lastName} - {career?.code} ({student.currentSemester}
                                      ° sem)
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Fecha de Baja</Label>
                              <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo de Baja</Label>
                              <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, type: value as Withdrawal["type"] })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="temporary">Temporal</SelectItem>
                                  <SelectItem value="permanent">Definitiva</SelectItem>
                                  <SelectItem value="academic">Académica (reprobación)</SelectItem>
                                  <SelectItem value="transfer">Traslado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Causa del Abandono</Label>
                            <Select
                              value={formData.reason as string}
                              onValueChange={(value) => setFormData({ ...formData, reason: value as WithdrawalReason })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(withdrawalReasonLabels).map(([key, label]) => {
                                  const Icon = reasonIcons[key as WithdrawalReason]
                                  return (
                                    <SelectItem key={key} value={key}>
                                      <span className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {label}
                                      </span>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nivel de Riesgo</Label>
                              <Select
                                value={formData.riskLevel}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, riskLevel: value as "low" | "medium" | "high" })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Bajo</SelectItem>
                                  <SelectItem value="medium">Medio</SelectItem>
                                  <SelectItem value="high">Alto</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {formData.type === "temporary" && (
                              <div className="space-y-2">
                                <Label>Fecha Estimada de Regreso</Label>
                                <Input
                                  type="date"
                                  value={formData.returnDate}
                                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Descripción detallada</Label>
                            <Textarea
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Describa las circunstancias del abandono..."
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Notas de Seguimiento</Label>
                            <Textarea
                              value={formData.followUpNotes}
                              onChange={(e) => setFormData({ ...formData, followUpNotes: e.target.value })}
                              placeholder="Acciones tomadas, contacto con el estudiante..."
                              rows={2}
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit">Registrar Abandono</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Semestre</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Causa</TableHead>
                        <TableHead>Riesgo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWithdrawals.map((withdrawal) => {
                        const studentInfo = getStudentInfo(withdrawal.studentId)
                        const ReasonIcon = reasonIcons[withdrawal.reason] || HelpCircle
                        return (
                          <TableRow key={withdrawal.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {studentInfo?.firstName} {studentInfo?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">{studentInfo?.studentCode}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{studentInfo?.career?.code}</Badge>
                            </TableCell>
                            <TableCell>{studentInfo?.currentSemester}°</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                {new Date(withdrawal.date).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell>{getTypeBadge(withdrawal.type)}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1.5 text-sm">
                                <ReasonIcon className="h-4 w-4" style={{ color: reasonColors[withdrawal.reason] }} />
                                {withdrawalReasonLabels[withdrawal.reason]}
                              </span>
                            </TableCell>
                            <TableCell>{getRiskBadge(withdrawal.riskLevel)}</TableCell>
                            <TableCell className="text-right">
                              {withdrawal.type === "temporary" && studentInfo?.status !== "active" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReactivate(withdrawal.studentId, withdrawal.id)}
                                >
                                  <RefreshCw className="mr-1 h-3 w-3" />
                                  Reactivar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {filteredWithdrawals.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No hay registros de abandonos
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analisis" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Gráfico de causas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Causa de Abandono</CardTitle>
                    <CardDescription>Análisis de las principales razones de deserción</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reasonStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={reasonStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {reasonStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        No hay datos de abandonos
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Gráfico por carrera */}
                <Card>
                  <CardHeader>
                    <CardTitle>Abandonos por Carrera</CardTitle>
                    <CardDescription>Comparativa entre programas académicos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {careerStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={careerStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="abandonos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        No hay datos de abandonos
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detalle de causas */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Detalle por Causa</CardTitle>
                    <CardDescription>Cantidad y porcentaje de cada causa de abandono</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(withdrawalReasonLabels).map(([key, label]) => {
                        const Icon = reasonIcons[key as WithdrawalReason]
                        const count = withdrawals.filter((w) => w.reason === key).length
                        const percentage = withdrawals.length > 0 ? (count / withdrawals.length) * 100 : 0
                        return (
                          <div key={key} className="flex items-center gap-4 rounded-lg border p-4">
                            <div
                              className="rounded-full p-2"
                              style={{ backgroundColor: `${reasonColors[key as WithdrawalReason]}20` }}
                            >
                              <Icon className="h-5 w-5" style={{ color: reasonColors[key as WithdrawalReason] }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{label}</p>
                              <div className="flex items-center gap-2">
                                <Progress value={percentage} className="h-2" />
                                <span className="text-sm text-muted-foreground">{count}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Seguimiento */}
            <TabsContent value="seguimiento">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-warning" />
                      Bajas Temporales - Pendientes de Regreso
                    </CardTitle>
                    <CardDescription>Estudiantes que podrían retomar sus estudios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {withdrawals
                        .filter((w) => w.type === "temporary")
                        .map((withdrawal) => {
                          const studentInfo = getStudentInfo(withdrawal.studentId)
                          const ReasonIcon = reasonIcons[withdrawal.reason]
                          return (
                            <div key={withdrawal.id} className="rounded-lg border p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">
                                    {studentInfo?.firstName} {studentInfo?.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{studentInfo?.career?.name}</p>
                                  <div className="mt-2 flex items-center gap-2 text-sm">
                                    <ReasonIcon
                                      className="h-4 w-4"
                                      style={{ color: reasonColors[withdrawal.reason] }}
                                    />
                                    {withdrawalReasonLabels[withdrawal.reason]}
                                  </div>
                                  {withdrawal.returnDate && (
                                    <p className="mt-1 text-sm text-primary">
                                      Regreso estimado: {new Date(withdrawal.returnDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  {getRiskBadge(withdrawal.riskLevel)}
                                  {studentInfo?.status !== "active" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReactivate(withdrawal.studentId, withdrawal.id)}
                                    >
                                      <RefreshCw className="mr-1 h-3 w-3" />
                                      Reactivar
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {withdrawal.followUpNotes && (
                                <div className="mt-3 rounded bg-muted p-2 text-sm">
                                  <span className="font-medium">Seguimiento: </span>
                                  {withdrawal.followUpNotes}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      {withdrawals.filter((w) => w.type === "temporary").length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No hay bajas temporales</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Casos de Alto Riesgo
                    </CardTitle>
                    <CardDescription>Estudiantes que requieren atención prioritaria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {withdrawals
                        .filter((w) => w.riskLevel === "high")
                        .map((withdrawal) => {
                          const studentInfo = getStudentInfo(withdrawal.studentId)
                          const ReasonIcon = reasonIcons[withdrawal.reason]
                          return (
                            <div
                              key={withdrawal.id}
                              className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">
                                    {studentInfo?.firstName} {studentInfo?.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {studentInfo?.career?.code} - {studentInfo?.currentSemester}° semestre
                                  </p>
                                  <div className="mt-2 flex items-center gap-2 text-sm">
                                    <ReasonIcon
                                      className="h-4 w-4"
                                      style={{ color: reasonColors[withdrawal.reason] }}
                                    />
                                    {withdrawalReasonLabels[withdrawal.reason]}
                                  </div>
                                </div>
                                {getTypeBadge(withdrawal.type)}
                              </div>
                              {withdrawal.notes && (
                                <p className="mt-2 text-sm text-muted-foreground">{withdrawal.notes}</p>
                              )}
                            </div>
                          )
                        })}
                      {withdrawals.filter((w) => w.riskLevel === "high").length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No hay casos de alto riesgo</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
