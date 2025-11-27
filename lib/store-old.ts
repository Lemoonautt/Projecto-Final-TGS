"use client"

import { create } from "zustand"
import {
  type Student,
  type Course,
  type Grade,
  type Teacher,
  type Subject,
  type Attendance,
  type Assignment,
  type StudentAssignment,
  type Withdrawal,
  type AcademicPeriod,
  type Career,
  type Enrollment,
  type StudentRiskAlert,
  students as initialStudents,
  courses as initialCourses,
  grades as initialGrades,
  teachers as initialTeachers,
  subjects as initialSubjects,
  attendances as initialAttendances,
  assignments as initialAssignments,
  studentAssignments as initialStudentAssignments,
  withdrawals as initialWithdrawals,
  academicPeriods as initialAcademicPeriods,
  careers as initialCareers,
  enrollments as initialEnrollments,
  studentRiskAlerts as initialStudentRiskAlerts,
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

  setSelectedPeriod: (periodId: string | null) => void

  // Student actions
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void

  // Course actions
  addCourse: (course: Course) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void

  // Grade actions
  addGrade: (grade: Grade) => void
  updateGrade: (id: string, grade: Partial<Grade>) => void
  deleteGrade: (id: string) => void

  // Teacher actions
  addTeacher: (teacher: Teacher) => void
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void

  // Subject actions
  addSubject: (subject: Subject) => void
  updateSubject: (id: string, subject: Partial<Subject>) => void
  deleteSubject: (id: string) => void

  // Attendance actions
  addAttendance: (attendance: Attendance) => void
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void
  deleteAttendance: (id: string) => void
  bulkAddAttendance: (attendances: Attendance[]) => void

  // Assignment actions
  addAssignment: (assignment: Assignment) => void
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void

  // Student Assignment actions
  addStudentAssignment: (studentAssignment: StudentAssignment) => void
  updateStudentAssignment: (id: string, studentAssignment: Partial<StudentAssignment>) => void
  deleteStudentAssignment: (id: string) => void

  // Withdrawal actions
  addWithdrawal: (withdrawal: Withdrawal) => void
  updateWithdrawal: (id: string, withdrawal: Partial<Withdrawal>) => void
  deleteWithdrawal: (id: string) => void

  addAcademicPeriod: (period: AcademicPeriod) => void
  updateAcademicPeriod: (id: string, period: Partial<AcademicPeriod>) => void

  addCareer: (career: Career) => void
  updateCareer: (id: string, career: Partial<Career>) => void

  addEnrollment: (enrollment: Enrollment) => void
  updateEnrollment: (id: string, enrollment: Partial<Enrollment>) => void
  deleteEnrollment: (id: string) => void

  addRiskAlert: (alert: StudentRiskAlert) => void
  updateRiskAlert: (id: string, alert: Partial<StudentRiskAlert>) => void
  resolveRiskAlert: (id: string, notes: string) => void
}

export const useStore = create<StoreState>((set) => ({
  // Initial data
  students: initialStudents,
  courses: initialCourses,
  grades: initialGrades,
  teachers: initialTeachers,
  subjects: initialSubjects,
  attendances: initialAttendances,
  assignments: initialAssignments,
  studentAssignments: initialStudentAssignments,
  withdrawals: initialWithdrawals,
  academicPeriods: initialAcademicPeriods,
  careers: initialCareers,
  enrollments: initialEnrollments,
  studentRiskAlerts: initialStudentRiskAlerts,
  selectedPeriodId: "2025-1", // Gestión activa por defecto

  setSelectedPeriod: (periodId) => set({ selectedPeriodId: periodId }),

  // Student actions
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  updateStudent: (id, student) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...student } : s)),
    })),
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    })),

  // Course actions
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
    })),
  deleteCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    })),

  // Grade actions
  addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] })),
  updateGrade: (id, grade) =>
    set((state) => ({
      grades: state.grades.map((g) => (g.id === id ? { ...g, ...grade } : g)),
    })),
  deleteGrade: (id) =>
    set((state) => ({
      grades: state.grades.filter((g) => g.id !== id),
    })),

  // Teacher actions
  addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, teacher] })),
  updateTeacher: (id, teacher) =>
    set((state) => ({
      teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...teacher } : t)),
    })),
  deleteTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((t) => t.id !== id),
    })),

  // Subject actions
  addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, subject] })),
  updateSubject: (id, subject) =>
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...subject } : s)),
    })),
  deleteSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    })),

  // Attendance actions
  addAttendance: (attendance) => set((state) => ({ attendances: [...state.attendances, attendance] })),
  updateAttendance: (id, attendance) =>
    set((state) => ({
      attendances: state.attendances.map((a) => (a.id === id ? { ...a, ...attendance } : a)),
    })),
  deleteAttendance: (id) =>
    set((state) => ({
      attendances: state.attendances.filter((a) => a.id !== id),
    })),
  bulkAddAttendance: (newAttendances) => set((state) => ({ attendances: [...state.attendances, ...newAttendances] })),

  // Assignment actions
  addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, assignment] })),
  updateAssignment: (id, assignment) =>
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...assignment } : a)),
    })),
  deleteAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    })),

  // Student Assignment actions
  addStudentAssignment: (studentAssignment) =>
    set((state) => ({ studentAssignments: [...state.studentAssignments, studentAssignment] })),
  updateStudentAssignment: (id, studentAssignment) =>
    set((state) => ({
      studentAssignments: state.studentAssignments.map((sa) => (sa.id === id ? { ...sa, ...studentAssignment } : sa)),
    })),
  deleteStudentAssignment: (id) =>
    set((state) => ({
      studentAssignments: state.studentAssignments.filter((sa) => sa.id !== id),
    })),

  // Withdrawal actions
  addWithdrawal: (withdrawal) => set((state) => ({ withdrawals: [...state.withdrawals, withdrawal] })),
  updateWithdrawal: (id, withdrawal) =>
    set((state) => ({
      withdrawals: state.withdrawals.map((w) => (w.id === id ? { ...w, ...withdrawal } : w)),
    })),
  deleteWithdrawal: (id) =>
    set((state) => ({
      withdrawals: state.withdrawals.filter((w) => w.id !== id),
    })),

  addAcademicPeriod: (period) => set((state) => ({ academicPeriods: [...state.academicPeriods, period] })),
  updateAcademicPeriod: (id, period) =>
    set((state) => ({
      academicPeriods: state.academicPeriods.map((p) => (p.id === id ? { ...p, ...period } : p)),
    })),

  addCareer: (career) => set((state) => ({ careers: [...state.careers, career] })),
  updateCareer: (id, career) =>
    set((state) => ({
      careers: state.careers.map((c) => (c.id === id ? { ...c, ...career } : c)),
    })),

  addEnrollment: (enrollment) => set((state) => ({ enrollments: [...state.enrollments, enrollment] })),
  updateEnrollment: (id, enrollment) =>
    set((state) => ({
      enrollments: state.enrollments.map((e) => (e.id === id ? { ...e, ...enrollment } : e)),
    })),
  deleteEnrollment: (id) =>
    set((state) => ({
      enrollments: state.enrollments.filter((e) => e.id !== id),
    })),

  addRiskAlert: (alert) => set((state) => ({ studentRiskAlerts: [...state.studentRiskAlerts, alert] })),
  updateRiskAlert: (id, alert) =>
    set((state) => ({
      studentRiskAlerts: state.studentRiskAlerts.map((a) => (a.id === id ? { ...a, ...alert } : a)),
    })),
  resolveRiskAlert: (id, notes) =>
    set((state) => ({
      studentRiskAlerts: state.studentRiskAlerts.map((a) =>
        a.id === id
          ? { ...a, resolved: true, resolvedDate: new Date().toISOString().split("T")[0], resolvedNotes: notes }
          : a,
      ),
    })),
}))
