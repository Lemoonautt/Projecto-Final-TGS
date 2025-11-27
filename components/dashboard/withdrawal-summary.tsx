"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { withdrawalReasonLabels, type WithdrawalReason } from "@/lib/data"
import { TrendingDown, DollarSign, Heart, Briefcase, BookX, HelpCircle } from "lucide-react"

export function WithdrawalSummary() {
  const { withdrawals, students, careers, selectedPeriodId } = useStore()

  const periodWithdrawals = withdrawals.filter((w) => w.periodId === selectedPeriodId)

  // Top causas
  const reasonCounts: Record<string, number> = {}
  periodWithdrawals.forEach((w) => {
    reasonCounts[w.reason] = (reasonCounts[w.reason] || 0) + 1
  })

  const topReasons = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([reason, count]) => ({
      reason: reason as WithdrawalReason,
      label: withdrawalReasonLabels[reason as WithdrawalReason],
      count,
    }))

  const getReasonIcon = (reason: WithdrawalReason) => {
    const icons: Record<string, React.ElementType> = {
      economic: DollarSign,
      academic_performance: TrendingDown,
      health: Heart,
      work: Briefcase,
      lack_of_interest: BookX,
    }
    const Icon = icons[reason] || HelpCircle
    return <Icon className="h-4 w-4" />
  }

  const recentWithdrawals = periodWithdrawals.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Resumen de Abandonos</CardTitle>
        <a href="/bajas" className="text-sm font-medium text-primary hover:underline">
          Ver todos
        </a>
      </CardHeader>
      <CardContent>
        {/* Causas principales */}
        {topReasons.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Principales causas</p>
            <div className="grid grid-cols-2 gap-2">
              {topReasons.map(({ reason, label, count }) => (
                <div key={reason} className="flex items-center gap-2 rounded-lg border p-2">
                  <div className="rounded-full bg-destructive/10 p-1.5">{getReasonIcon(reason)}</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{label}</p>
                    <p className="text-lg font-bold text-destructive">{count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abandonos recientes */}
        {recentWithdrawals.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Últimos registros</p>
            <div className="space-y-2">
              {recentWithdrawals.map((withdrawal) => {
                const student = students.find((s) => s.id === withdrawal.studentId)
                const career = careers.find((c) => c.id === student?.careerId)
                return (
                  <div key={withdrawal.id} className="flex items-center justify-between rounded-lg border p-2">
                    <div>
                      <p className="text-sm font-medium">
                        {student?.firstName} {student?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {career?.code} - {withdrawalReasonLabels[withdrawal.reason]}
                      </p>
                    </div>
                    <Badge variant={withdrawal.riskLevel === "high" ? "destructive" : "secondary"}>
                      {withdrawal.type === "temporary" ? "Temporal" : "Definitiva"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">No hay abandonos registrados en esta gestión</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
