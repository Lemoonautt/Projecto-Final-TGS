// Tipos de usuario y autenticación
export type UserRole = "admin" | "student"

export interface User {
  id: string
  email: string
  password: string 
  role: UserRole
  studentId?: string 
  name: string
}


export const users: User[] = [
  {
    id: "admin-1",
    email: "admin@universidad.edu",
    password: "admin123",
    role: "admin",
    name: "Administrador",
  },
  {
    id: "student-1",
    email: "maria.garcia@universidad.edu",
    password: "estudiante123",
    role: "student",
    studentId: "1", // María García López
    name: "María García López",
  },
  {
    id: "student-2",
    email: "carlos.martinez@universidad.edu",
    password: "estudiante123",
    role: "student",
    studentId: "2", // Carlos Martínez Ruiz
    name: "Carlos Martínez Ruiz",
  },
  {
    id: "student-3",
    email: "ana.rodriguez@universidad.edu",
    password: "estudiante123",
    role: "student",
    studentId: "3", // Ana Rodríguez
    name: "Ana Rodríguez Fernández",
  },
  {
    id: "student-4",
    email: "pablo.sanchez@universidad.edu",
    password: "estudiante123",
    role: "student",
    studentId: "4", // Pablo Sánchez
    name: "Pablo Sánchez Torres",
  },
  {
    id: "student-6",
    email: "diego.lopez@universidad.edu",
    password: "estudiante123",
    role: "student",
    studentId: "6", // Diego López
    name: "Diego López Moreno",
  },
  {
    id: "student-8",
    email: "adrian.ruiz@universidad.edu",
    password: "estudiante123",
    role: "student",
    studentId: "8", // Adrián Ruiz
    name: "Adrián Ruiz Navarro",
  },
]

export function authenticateUser(email: string, password: string): User | null {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  return user || null
}

export function getUserByStudentId(studentId: string): User | null {
  return users.find((u) => u.studentId === studentId) || null
}
