"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentStudents } from "@/components/dashboard/recent-students"
import { GradeChart } from "@/components/dashboard/grade-chart"
import { AttendanceSummary } from "@/components/dashboard/attendance-summary"
import { PendingTasks } from "@/components/dashboard/pending-tasks"
import { AcademicAlerts } from "@/components/dashboard/academic-alerts"
import { WithdrawalSummary } from "@/components/dashboard/withdrawal-summary"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role === "student") {
      router.push("/mi-portal")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Dashboard" subtitle="Panel de control universitario - Gestión 1/2025" />
        <div className="p-6">
          <StatsCards />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <AttendanceSummary />
            <AcademicAlerts />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <GradeChart />
            <WithdrawalSummary />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <RecentStudents />
            <PendingTasks />
          </div>
        </div>
      </main>
    </div>
  )
}
