"use client"

import { create } from "zustand"
import { api } from "./api"
import type {
  Student,
  Course,
  Grade,
  Teacher,
  Subject,
  Attendance,
  Assignment,
  StudentAssignment,
  Withdrawal,
  AcademicPeriod,
  Career,
  Enrollment,
  StudentRiskAlert,
} from "./data"

interface StoreState {
  // Data
  students: Student[]
  courses: Course[]
  grades: Grade[]
  teachers: Teacher[]
  subjects: Subject[]
  attendances: Attendance[]
  assignments: Assignment[]
  studentAssignments: StudentAssignment[]
  withdrawals: Withdrawal[]
  academicPeriods: AcademicPeriod[]
  careers: Career[]
  enrollments: Enrollment[]
  studentRiskAlerts: StudentRiskAlert[]
  selectedPeriodId: string | null

  // Loading state
  isLoading: boolean
  error: string | null

  // Initialize data from API
  initialize: () => Promise<void>

  setSelectedPeriod: (periodId: string | null) => void

  // Student actions
  addStudent: (student: Student) => Promise<void>
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>
  deleteStudent: (id: string) => Promise<void>

  // Course actions
  addCourse: (course: Course) => Promise<void>
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>
  deleteCourse: (id: string) => Promise<void>

  // Grade actions
  addGrade: (grade: Grade) => Promise<void>
  updateGrade: (id: string, grade: Partial<Grade>) => Promise<void>
  deleteGrade: (id: string) => Promise<void>

  // Teacher actions
  addTeacher: (teacher: Teacher) => Promise<void>
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>
  deleteTeacher: (id: string) => Promise<void>

  // Subject actions
  addSubject: (subject: Subject) => Promise<void>
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>

  // Attendance actions
  addAttendance: (attendance: Attendance) => Promise<void>
  updateAttendance: (id: string, attendance: Partial<Attendance>) => Promise<void>
  deleteAttendance: (id: string) => Promise<void>
  bulkAddAttendance: (attendances: Attendance[]) => Promise<void>

  // Assignment actions
  addAssignment: (assignment: Assignment) => Promise<void>
  updateAssignment: (id: string, assignment: Partial<Assignment>) => Promise<void>
  deleteAssignment: (id: string) => Promise<void>

  // Student Assignment actions
  addStudentAssignment: (studentAssignment: StudentAssignment) => Promise<void>
  updateStudentAssignment: (id: string, studentAssignment: Partial<StudentAssignment>) => Promise<void>
  deleteStudentAssignment: (id: string) => Promise<void>

  // Withdrawal actions
  addWithdrawal: (withdrawal: Withdrawal) => Promise<void>
  updateWithdrawal: (id: string, withdrawal: Partial<Withdrawal>) => Promise<void>
  deleteWithdrawal: (id: string) => Promise<void>

  addAcademicPeriod: (period: AcademicPeriod) => Promise<void>
  updateAcademicPeriod: (id: string, period: Partial<AcademicPeriod>) => Promise<void>

  addCareer: (career: Career) => Promise<void>
  updateCareer: (id: string, career: Partial<Career>) => Promise<void>

  addEnrollment: (enrollment: Enrollment) => Promise<void>
  updateEnrollment: (id: string, enrollment: Partial<Enrollment>) => Promise<void>
  deleteEnrollment: (id: string) => Promise<void>

  addRiskAlert: (alert: StudentRiskAlert) => Promise<void>
  updateRiskAlert: (id: string, alert: Partial<StudentRiskAlert>) => Promise<void>
  resolveRiskAlert: (id: string, notes: string) => Promise<void>
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial empty state
  students: [],
  courses: [],
  grades: [],
  teachers: [],
  subjects: [],
  attendances: [],
  assignments: [],
  studentAssignments: [],
  withdrawals: [],
  academicPeriods: [],
  careers: [],
  enrollments: [],
  studentRiskAlerts: [],
  selectedPeriodId: "2025-1",
  isLoading: false,
  error: null,

  // Initialize all data from API
  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const [
        students,
        courses,
        grades,
        teachers,
        subjects,
        attendances,
        assignments,
        studentAssignments,
        withdrawals,
        academicPeriods,
        careers,
        enrollments,
        studentRiskAlerts,
      ] = await Promise.all([
        api.students.getAll(),
        api.courses.getAll(),
        api.grades.getAll(),
        api.teachers.getAll(),
        api.subjects.getAll(),
        api.attendances.getAll(),
        api.assignments.getAll(),
        api.studentAssignments.getAll(),
        api.withdrawals.getAll(),
        api.academicPeriods.getAll(),
        api.careers.getAll(),
        api.enrollments.getAll(),
        api.studentRiskAlerts.getAll(),
      ])

      set({
        students,
        courses,
        grades,
        teachers,
        subjects,
        attendances,
        assignments,
        studentAssignments,
        withdrawals,
        academicPeriods,
        careers,
        enrollments,
        studentRiskAlerts,
        isLoading: false,
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  setSelectedPeriod: (periodId) => set({ selectedPeriodId: periodId }),

  // Student actions
  addStudent: async (student) => {
    const created = await api.students.create(student)
    set((state) => ({ students: [...state.students, created] }))
  },
  updateStudent: async (id, student) => {
    const updated = await api.students.update(id, student)
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? updated : s)),
    }))
  },
  deleteStudent: async (id) => {
    await api.students.delete(id)
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    }))
  },

  // Course actions
  addCourse: async (course) => {
    const created = await api.courses.create(course)
    set((state) => ({ courses: [...state.courses, created] }))
  },
  updateCourse: async (id, course) => {
    const updated = await api.courses.update(id, course)
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? updated : c)),
    }))
  },
  deleteCourse: async (id) => {
    await api.courses.delete(id)
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    }))
  },

  // Grade actions
  addGrade: async (grade) => {
    const created = await api.grades.create(grade)
    set((state) => ({ grades: [...state.grades, created] }))
  },
  updateGrade: async (id, grade) => {
    const updated = await api.grades.update(id, grade)
    set((state) => ({
      grades: state.grades.map((g) => (g.id === id ? updated : g)),
    }))
  },
  deleteGrade: async (id) => {
    await api.grades.delete(id)
    set((state) => ({
      grades: state.grades.filter((g) => g.id !== id),
    }))
  },

  // Teacher actions
  addTeacher: async (teacher) => {
    const created = await api.teachers.create(teacher)
    set((state) => ({ teachers: [...state.teachers, created] }))
  },
  updateTeacher: async (id, teacher) => {
    const updated = await api.teachers.update(id, teacher)
    set((state) => ({
      teachers: state.teachers.map((t) => (t.id === id ? updated : t)),
    }))
  },
  deleteTeacher: async (id) => {
    await api.teachers.delete(id)
    set((state) => ({
      teachers: state.teachers.filter((t) => t.id !== id),
    }))
  },

  // Subject actions
  addSubject: async (subject) => {
    const created = await api.subjects.create(subject)
    set((state) => ({ subjects: [...state.subjects, created] }))
  },
  updateSubject: async (id, subject) => {
    const updated = await api.subjects.update(id, subject)
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? updated : s)),
    }))
  },
  deleteSubject: async (id) => {
    await api.subjects.delete(id)
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    }))
  },

  // Attendance actions
  addAttendance: async (attendance) => {
    const created = await api.attendances.create(attendance)
    set((state) => ({ attendances: [...state.attendances, created] }))
  },
  updateAttendance: async (id, attendance) => {
    const updated = await api.attendances.update(id, attendance)
    set((state) => ({
      attendances: state.attendances.map((a) => (a.id === id ? updated : a)),
    }))
  },
  deleteAttendance: async (id) => {
    await api.attendances.delete(id)
    set((state) => ({
      attendances: state.attendances.filter((a) => a.id !== id),
    }))
  },
  bulkAddAttendance: async (newAttendances) => {
    const created = await api.attendances.bulkCreate(newAttendances)
    set((state) => ({ attendances: [...state.attendances, ...created] }))
  },

  // Assignment actions
  addAssignment: async (assignment) => {
    const created = await api.assignments.create(assignment)
    set((state) => ({ assignments: [...state.assignments, created] }))
  },
  updateAssignment: async (id, assignment) => {
    const updated = await api.assignments.update(id, assignment)
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? updated : a)),
    }))
  },
  deleteAssignment: async (id) => {
    await api.assignments.delete(id)
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    }))
  },

  // Student Assignment actions
  addStudentAssignment: async (studentAssignment) => {
    const created = await api.studentAssignments.create(studentAssignment)
    set((state) => ({ studentAssignments: [...state.studentAssignments, created] }))
  },
  updateStudentAssignment: async (id, studentAssignment) => {
    const updated = await api.studentAssignments.update(id, studentAssignment)
    set((state) => ({
      studentAssignments: state.studentAssignments.map((sa) => (sa.id === id ? updated : sa)),
    }))
  },
  deleteStudentAssignment: async (id) => {
    await api.studentAssignments.delete(id)
    set((state) => ({
      studentAssignments: state.studentAssignments.filter((sa) => sa.id !== id),
    }))
  },

  // Withdrawal actions
  addWithdrawal: async (withdrawal) => {
    const created = await api.withdrawals.create(withdrawal)
    set((state) => ({ withdrawals: [...state.withdrawals, created] }))
  },
  updateWithdrawal: async (id, withdrawal) => {
    const updated = await api.withdrawals.update(id, withdrawal)
    set((state) => ({
      withdrawals: state.withdrawals.map((w) => (w.id === id ? updated : w)),
    }))
  },
  deleteWithdrawal: async (id) => {
    await api.withdrawals.delete(id)
    set((state) => ({
      withdrawals: state.withdrawals.filter((w) => w.id !== id),
    }))
  },

  addAcademicPeriod: async (period) => {
    const created = await api.academicPeriods.create(period)
    set((state) => ({ academicPeriods: [...state.academicPeriods, created] }))
  },
  updateAcademicPeriod: async (id, period) => {
    const updated = await api.academicPeriods.update(id, period)
    set((state) => ({
      academicPeriods: state.academicPeriods.map((p) => (p.id === id ? updated : p)),
    }))
  },

  addCareer: async (career) => {
    const created = await api.careers.create(career)
    set((state) => ({ careers: [...state.careers, created] }))
  },
  updateCareer: async (id, career) => {
    const updated = await api.careers.update(id, career)
    set((state) => ({
      careers: state.careers.map((c) => (c.id === id ? updated : c)),
    }))
  },

  addEnrollment: async (enrollment) => {
    const created = await api.enrollments.create(enrollment)
    set((state) => ({ enrollments: [...state.enrollments, created] }))
  },
  updateEnrollment: async (id, enrollment) => {
    const updated = await api.enrollments.update(id, enrollment)
    set((state) => ({
      enrollments: state.enrollments.map((e) => (e.id === id ? updated : e)),
    }))
  },
  deleteEnrollment: async (id) => {
    await api.enrollments.delete(id)
    set((state) => ({
      enrollments: state.enrollments.filter((e) => e.id !== id),
    }))
  },

  addRiskAlert: async (alert) => {
    const created = await api.studentRiskAlerts.create(alert)
    set((state) => ({ studentRiskAlerts: [...state.studentRiskAlerts, created] }))
  },
  updateRiskAlert: async (id, alert) => {
    const updated = await api.studentRiskAlerts.update(id, alert)
    set((state) => ({
      studentRiskAlerts: state.studentRiskAlerts.map((a) => (a.id === id ? updated : a)),
    }))
  },
  resolveRiskAlert: async (id, notes) => {
    const updated = await api.studentRiskAlerts.update(id, {
      resolved: true,
      resolvedDate: new Date().toISOString().split("T")[0],
      resolvedNotes: notes,
    })
    set((state) => ({
      studentRiskAlerts: state.studentRiskAlerts.map((a) => (a.id === id ? updated : a)),
    }))
  },
}))
