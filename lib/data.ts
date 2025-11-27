// Gestión Académica (Semestre/Período)
export interface AcademicPeriod {
  id: string
  name: string
  year: number
  semester: 1 | 2
  startDate: string
  endDate: string
  status: "active" | "closed" | "upcoming"
}

// Carrera Universitaria
export interface Career {
  id: string
  name: string
  code: string
  faculty: string
  duration: number 
  description: string
  status: "active" | "inactive"
}

// Estudiante Universitario 
export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  enrollmentDate: string
  careerId: string 
  currentSemester: number 
  nivel: number 
  status: "active" | "inactive" | "graduated" | "withdrawn" | "suspended"
  avatar?: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  studentCode: string 
  withdrawalDate?: string
  withdrawalReason?: string
}

// Inscripción a Gestión 
export interface Enrollment {
  id: string
  studentId: string
  periodId: string 
  subjectIds: string[] 
  enrollmentDate: string
  status: "active" | "withdrawn" | "completed"
}

// Docente 
export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  hireDate: string
  specialization: string
  status: "active" | "inactive" | "on_leave"
  address: string
  degree: string 
  academicRank: "Auxiliar" | "Titular" | "Asociado" | "Emérito"
  salary?: number
}

// Materia/Asignatura (actualizada)
export interface Subject {
  id: string
  name: string
  code: string
  description: string
  teacherId: string
  careerId: string 
  semester: number 
  nivel: number 
  credits: number
  schedule: string
  classroom: string
  prerequisites?: string[] 
}

// Asistencia 
export interface Attendance {
  id: string
  studentId: string
  subjectId: string
  periodId: string 
  date: string
  status: "present" | "absent" | "late" | "excused"
  notes?: string
}

// Calificación 
export interface Grade {
  id: string
  studentId: string
  subjectId: string
  periodId: string 
  type: "partial1" | "partial2" | "partial3" | "final" | "recovery" | "practice"
  grade: number
  maxGrade: number
  weight: number 
  date: string
  comments?: string
}

// Abandono/Baja 
export interface Withdrawal {
  id: string
  studentId: string
  periodId: string
  date: string
  reason: WithdrawalReason
  type: "temporary" | "permanent" | "transfer" | "academic"
  subjectIds?: string[] 
  notes?: string
  returnDate?: string
  followUpNotes?: string
  riskLevel: "low" | "medium" | "high"
}

export type WithdrawalReason =
  | "economic"
  | "academic_performance"
  | "health"
  | "work"
  | "family"
  | "relocation"
  | "lack_of_interest"
  | "schedule_conflict"
  | "other"

export const withdrawalReasonLabels: Record<WithdrawalReason, string> = {
  economic: "Problemas económicos",
  academic_performance: "Bajo rendimiento académico",
  health: "Problemas de salud",
  work: "Incompatibilidad laboral",
  family: "Problemas familiares",
  relocation: "Cambio de residencia",
  lack_of_interest: "Pérdida de interés en la carrera",
  schedule_conflict: "Conflicto de horarios",
  other: "Otros motivos",
}

// Seguimiento de estudiante en riesgo
export interface StudentRiskAlert {
  id: string
  studentId: string
  periodId: string
  type: "attendance" | "grades" | "behavior" | "dropout_risk"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  date: string
  resolved: boolean
  resolvedDate?: string
  resolvedNotes?: string
}

// Mantener compatibilidad
export interface Assignment {
  id: string
  subjectId: string
  periodId: string
  title: string
  description: string
  dueDate: string
  maxScore: number
  type: "homework" | "project" | "exam" | "quiz" | "presentation" | "lab"
  status: "active" | "closed"
}

export interface StudentAssignment {
  id: string
  assignmentId: string
  studentId: string
  submittedDate?: string
  score?: number
  status: "pending" | "submitted" | "graded" | "late" | "missing"
  feedback?: string
}

export interface Course {
  id: string
  name: string
  code: string
  description: string
  teacher: string
  credits: number
  schedule: string
  capacity: number
  enrolled: number
}

// ============ DATOS INICIALES ============

// Gestiones Académicas
export const academicPeriods: AcademicPeriod[] = [
  {
    id: "2025-1",
    name: "Gestión 1/2025",
    year: 2025,
    semester: 1,
    startDate: "2025-02-03",
    endDate: "2025-06-30",
    status: "active",
  },
  {
    id: "2024-2",
    name: "Gestión 2/2024",
    year: 2024,
    semester: 2,
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    status: "closed",
  },
  {
    id: "2024-1",
    name: "Gestión 1/2024",
    year: 2024,
    semester: 1,
    startDate: "2024-02-05",
    endDate: "2024-06-28",
    status: "closed",
  },
]

// Carreras
export const careers: Career[] = [
  {
    id: "1",
    name: "Ingeniería de Sistemas",
    code: "SIS",
    faculty: "Facultad de Ingeniería",
    duration: 10,
    description: "Formación en desarrollo de software, redes y sistemas de información",
    status: "active",
  },
  {
    id: "2",
    name: "Administración de Empresas",
    code: "ADM",
    faculty: "Facultad de Ciencias Económicas",
    duration: 10,
    description: "Gestión empresarial, finanzas y recursos humanos",
    status: "active",
  },
  {
    id: "3",
    name: "Derecho",
    code: "DER",
    faculty: "Facultad de Ciencias Jurídicas",
    duration: 10,
    description: "Formación en ciencias jurídicas y derecho",
    status: "active",
  },
  {
    id: "4",
    name: "Medicina",
    code: "MED",
    faculty: "Facultad de Ciencias de la Salud",
    duration: 12,
    description: "Formación médica integral",
    status: "active",
  },
]

// Estudiantes universitarios
export const students: Student[] = [
  {
    id: "1",
    firstName: "María",
    lastName: "García López",
    email: "maria.garcia@universidad.edu",
    phone: "+591 712 345 678",
    dateOfBirth: "2002-03-15",
    enrollmentDate: "2023-02-01",
    careerId: "1",
    currentSemester: 5,
    nivel: 3, // Tercer año (semestres 5-6)
    status: "active",
    address: "Av. América 123, Cochabamba",
    emergencyContact: "Carmen López",
    emergencyPhone: "+591 712 345 679",
    studentCode: "SIS-2023-001",
  },
  {
    id: "2",
    firstName: "Carlos",
    lastName: "Martínez Ruiz",
    email: "carlos.martinez@universidad.edu",
    phone: "+591 723 456 789",
    dateOfBirth: "2001-07-22",
    enrollmentDate: "2022-02-01",
    careerId: "1",
    currentSemester: 7,
    nivel: 4, // Cuarto año (semestres 7-8)
    status: "active",
    address: "Calle Jordán 456, Cochabamba",
    emergencyContact: "José Martínez",
    emergencyPhone: "+591 723 456 780",
    studentCode: "SIS-2022-015",
  },
  {
    id: "3",
    firstName: "Ana",
    lastName: "Rodríguez Fernández",
    email: "ana.rodriguez@universidad.edu",
    phone: "+591 734 567 890",
    dateOfBirth: "2003-11-08",
    enrollmentDate: "2024-02-01",
    careerId: "2",
    currentSemester: 3,
    nivel: 2, // Segundo año (semestres 3-4)
    status: "active",
    address: "Av. Heroínas 789, Cochabamba",
    emergencyContact: "Laura Fernández",
    emergencyPhone: "+591 734 567 891",
    studentCode: "ADM-2024-008",
  },
  {
    id: "4",
    firstName: "Pablo",
    lastName: "Sánchez Torres",
    email: "pablo.sanchez@universidad.edu",
    phone: "+591 745 678 901",
    dateOfBirth: "2000-05-30",
    enrollmentDate: "2021-02-01",
    careerId: "3",
    currentSemester: 9,
    nivel: 5, // Quinto año (semestres 9-10)
    status: "active",
    address: "Calle España 321, Cochabamba",
    emergencyContact: "Miguel Sánchez",
    emergencyPhone: "+591 745 678 902",
    studentCode: "DER-2021-022",
  },
  {
    id: "5",
    firstName: "Lucía",
    lastName: "Hernández Díaz",
    email: "lucia.hernandez@universidad.edu",
    phone: "+591 756 789 012",
    dateOfBirth: "2002-09-12",
    enrollmentDate: "2023-02-01",
    careerId: "1",
    currentSemester: 5,
    nivel: 3, // Tercer año (semestres 5-6)
    status: "withdrawn",
    address: "Av. Ballivián 654, Cochabamba",
    emergencyContact: "Rosa Díaz",
    emergencyPhone: "+591 756 789 013",
    studentCode: "SIS-2023-003",
    withdrawalDate: "2024-11-01",
    withdrawalReason: "Problemas económicos",
  },
  {
    id: "6",
    firstName: "Diego",
    lastName: "López Moreno",
    email: "diego.lopez@universidad.edu",
    phone: "+591 767 890 123",
    dateOfBirth: "1999-01-25",
    enrollmentDate: "2020-02-01",
    careerId: "4",
    currentSemester: 10,
    nivel: 5, // Quinto año (semestres 9-10)
    status: "active",
    address: "Calle Sucre 987, Cochabamba",
    emergencyContact: "Antonio López",
    emergencyPhone: "+591 767 890 124",
    studentCode: "MED-2020-005",
  },
  {
    id: "7",
    firstName: "Elena",
    lastName: "Jiménez Castro",
    email: "elena.jimenez@universidad.edu",
    phone: "+591 778 901 234",
    dateOfBirth: "2003-04-18",
    enrollmentDate: "2024-02-01",
    careerId: "2",
    currentSemester: 3,
    nivel: 2, // Segundo año (semestres 3-4)
    status: "suspended",
    address: "Av. Ayacucho 147, Cochabamba",
    emergencyContact: "María Castro",
    emergencyPhone: "+591 778 901 235",
    studentCode: "ADM-2024-012",
  },
  {
    id: "8",
    firstName: "Adrián",
    lastName: "Ruiz Navarro",
    email: "adrian.ruiz@universidad.edu",
    phone: "+591 789 012 345",
    dateOfBirth: "2001-12-03",
    enrollmentDate: "2022-02-01",
    careerId: "1",
    currentSemester: 7,
    nivel: 4, // Cuarto año (semestres 7-8)
    status: "active",
    address: "Calle Calama 258, Cochabamba",
    emergencyContact: "Pedro Ruiz",
    emergencyPhone: "+591 789 012 346",
    studentCode: "SIS-2022-018",
  },
]

// Docentes
export const teachers: Teacher[] = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez González",
    email: "juan.perez@universidad.edu",
    phone: "+591 711 111 111",
    dateOfBirth: "1975-05-15",
    hireDate: "2010-02-01",
    specialization: "Programación y Bases de Datos",
    status: "active",
    address: "Zona Norte, Cochabamba",
    degree: "Ph.D. en Ciencias de la Computación",
    academicRank: "Titular",
  },
  {
    id: "2",
    firstName: "Ana",
    lastName: "Martín López",
    email: "ana.martin@universidad.edu",
    phone: "+591 722 222 222",
    dateOfBirth: "1980-03-22",
    hireDate: "2012-02-01",
    specialization: "Gestión Empresarial",
    status: "active",
    address: "Zona Sur, Cochabamba",
    degree: "Maestría en Administración de Empresas",
    academicRank: "Asociado",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Ruiz Fernández",
    email: "carlos.ruiz@universidad.edu",
    phone: "+591 733 333 333",
    dateOfBirth: "1970-11-08",
    hireDate: "2005-02-01",
    specialization: "Derecho Civil y Comercial",
    status: "active",
    address: "Centro, Cochabamba",
    degree: "Ph.D. en Derecho",
    academicRank: "Emérito",
  },
  {
    id: "4",
    firstName: "María",
    lastName: "González Torres",
    email: "maria.gonzalez@universidad.edu",
    phone: "+591 744 444 444",
    dateOfBirth: "1978-07-30",
    hireDate: "2011-02-01",
    specialization: "Redes y Telecomunicaciones",
    status: "active",
    address: "Zona Oeste, Cochabamba",
    degree: "Maestría en Telecomunicaciones",
    academicRank: "Titular",
  },
  {
    id: "5",
    firstName: "Roberto",
    lastName: "Sánchez Moreno",
    email: "roberto.sanchez@universidad.edu",
    phone: "+591 755 555 555",
    dateOfBirth: "1985-09-12",
    hireDate: "2015-02-01",
    specialization: "Anatomía y Fisiología",
    status: "active",
    address: "Zona Este, Cochabamba",
    degree: "Médico Cirujano, Especialista en Anatomía",
    academicRank: "Asociado",
  },
]

// Materias universitarias
export const subjects: Subject[] = [
  // Ingeniería de Sistemas - Semestre 5
  {
    id: "1",
    name: "Programación Avanzada",
    code: "SIS-501",
    description: "Patrones de diseño, arquitectura de software",
    teacherId: "1",
    careerId: "1",
    semester: 5,
    nivel: 3, // Tercer año
    credits: 6,
    schedule: "Lun, Mié, Vie 8:00-10:00",
    classroom: "Lab. 101",
    prerequisites: ["SIS-401"],
  },
  {
    id: "2",
    name: "Base de Datos II",
    code: "SIS-502",
    description: "Bases de datos distribuidas, NoSQL, optimización",
    teacherId: "1",
    careerId: "1",
    semester: 5,
    nivel: 3, // Tercer año
    credits: 6,
    schedule: "Mar, Jue 10:00-12:30",
    classroom: "Lab. 102",
    prerequisites: ["SIS-402"],
  },
  {
    id: "3",
    name: "Redes de Computadoras",
    code: "SIS-503",
    description: "Protocolos, configuración de redes, seguridad",
    teacherId: "4",
    careerId: "1",
    semester: 5,
    nivel: 3, // Tercer año
    credits: 5,
    schedule: "Lun, Mié 14:00-16:00",
    classroom: "Lab. 103",
  },
  {
    id: "4",
    name: "Ingeniería de Software",
    code: "SIS-504",
    description: "Metodologías ágiles, gestión de proyectos",
    teacherId: "1",
    careerId: "1",
    semester: 5,
    nivel: 3, // Tercer año
    credits: 5,
    schedule: "Mar, Jue 14:00-16:00",
    classroom: "Aula 201",
  },
  {
    id: "5",
    name: "Sistemas Operativos",
    code: "SIS-505",
    description: "Gestión de procesos, memoria, sistemas distribuidos",
    teacherId: "4",
    careerId: "1",
    semester: 5,
    nivel: 3, // Tercer año
    credits: 5,
    schedule: "Vie 14:00-18:00",
    classroom: "Lab. 104",
  },
  // Administración - Semestre 3
  {
    id: "6",
    name: "Contabilidad Gerencial",
    code: "ADM-301",
    description: "Análisis de costos y toma de decisiones",
    teacherId: "2",
    careerId: "2",
    semester: 3,
    nivel: 2, // Segundo año
    credits: 6,
    schedule: "Lun, Mié, Vie 10:00-12:00",
    classroom: "Aula 301",
  },
  {
    id: "7",
    name: "Marketing Estratégico",
    code: "ADM-302",
    description: "Estrategias de mercado y posicionamiento",
    teacherId: "2",
    careerId: "2",
    semester: 3,
    nivel: 2, // Segundo año
    credits: 5,
    schedule: "Mar, Jue 8:00-10:30",
    classroom: "Aula 302",
  },
  // Derecho - Semestre 9
  {
    id: "8",
    name: "Derecho Procesal Civil",
    code: "DER-901",
    description: "Procedimientos civiles y comerciales",
    teacherId: "3",
    careerId: "3",
    semester: 9,
    nivel: 5, // Quinto año
    credits: 6,
    schedule: "Lun, Mié, Vie 16:00-18:00",
    classroom: "Aula 401",
  },
]

// Inscripciones
export const enrollments: Enrollment[] = [
  {
    id: "1",
    studentId: "1",
    periodId: "2025-1",
    subjectIds: ["1", "2", "3", "4", "5"],
    enrollmentDate: "2025-01-15",
    status: "active",
  },
  {
    id: "2",
    studentId: "2",
    periodId: "2025-1",
    subjectIds: ["1", "2", "3", "4", "5"],
    enrollmentDate: "2025-01-16",
    status: "active",
  },
  {
    id: "3",
    studentId: "3",
    periodId: "2025-1",
    subjectIds: ["6", "7"],
    enrollmentDate: "2025-01-15",
    status: "active",
  },
  {
    id: "4",
    studentId: "8",
    periodId: "2025-1",
    subjectIds: ["1", "2", "3", "4", "5"],
    enrollmentDate: "2025-01-17",
    status: "active",
  },
  {
    id: "5",
    studentId: "4",
    periodId: "2025-1",
    subjectIds: ["8"],
    enrollmentDate: "2025-01-15",
    status: "active",
  },
]

// Asistencias con gestión
export const attendances: Attendance[] = [
  { id: "1", studentId: "1", subjectId: "1", periodId: "2025-1", date: "2025-02-10", status: "present" },
  { id: "2", studentId: "1", subjectId: "2", periodId: "2025-1", date: "2025-02-10", status: "present" },
  {
    id: "3",
    studentId: "2",
    subjectId: "1",
    periodId: "2025-1",
    date: "2025-02-10",
    status: "absent",
    notes: "Sin justificación",
  },
  {
    id: "4",
    studentId: "2",
    subjectId: "2",
    periodId: "2025-1",
    date: "2025-02-10",
    status: "late",
    notes: "Llegó 15 min tarde",
  },
  { id: "5", studentId: "1", subjectId: "3", periodId: "2025-1", date: "2025-02-10", status: "present" },
  {
    id: "6",
    studentId: "3",
    subjectId: "6",
    periodId: "2025-1",
    date: "2025-02-10",
    status: "excused",
    notes: "Cita médica",
  },
  { id: "7", studentId: "8", subjectId: "1", periodId: "2025-1", date: "2025-02-10", status: "present" },
  { id: "8", studentId: "1", subjectId: "1", periodId: "2025-1", date: "2025-02-07", status: "present" },
  { id: "9", studentId: "2", subjectId: "1", periodId: "2025-1", date: "2025-02-07", status: "absent" },
  { id: "10", studentId: "2", subjectId: "1", periodId: "2025-1", date: "2025-02-05", status: "absent" },
  { id: "11", studentId: "2", subjectId: "1", periodId: "2025-1", date: "2025-02-03", status: "absent" },
  { id: "12", studentId: "8", subjectId: "2", periodId: "2025-1", date: "2025-02-10", status: "late" },
]

// Calificaciones con gestión y tipos
export const grades: Grade[] = [
  {
    id: "1",
    studentId: "1",
    subjectId: "1",
    periodId: "2025-1",
    type: "partial1",
    grade: 85,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
    comments: "Buen desempeño",
  },
  {
    id: "2",
    studentId: "1",
    subjectId: "2",
    periodId: "2025-1",
    type: "partial1",
    grade: 90,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
  },
  {
    id: "3",
    studentId: "1",
    subjectId: "3",
    periodId: "2025-1",
    type: "partial1",
    grade: 75,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
  },
  {
    id: "4",
    studentId: "2",
    subjectId: "1",
    periodId: "2025-1",
    type: "partial1",
    grade: 70,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
  },
  {
    id: "5",
    studentId: "2",
    subjectId: "2",
    periodId: "2025-1",
    type: "partial1",
    grade: 65,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
    comments: "Necesita mejorar",
  },
  {
    id: "6",
    studentId: "3",
    subjectId: "6",
    periodId: "2025-1",
    type: "partial1",
    grade: 88,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
  },
  {
    id: "7",
    studentId: "8",
    subjectId: "1",
    periodId: "2025-1",
    type: "partial1",
    grade: 82,
    maxGrade: 100,
    weight: 25,
    date: "2025-03-15",
  },
  {
    id: "8",
    studentId: "1",
    subjectId: "1",
    periodId: "2025-1",
    type: "practice",
    grade: 95,
    maxGrade: 100,
    weight: 10,
    date: "2025-02-28",
  },
  {
    id: "9",
    studentId: "2",
    subjectId: "1",
    periodId: "2025-1",
    type: "practice",
    grade: 60,
    maxGrade: 100,
    weight: 10,
    date: "2025-02-28",
  },
]

// Bajas con causas detalladas
export const withdrawals: Withdrawal[] = [
  {
    id: "1",
    studentId: "5",
    periodId: "2025-1",
    date: "2024-11-01",
    reason: "economic",
    type: "permanent",
    notes: "Dificultades para cubrir matrícula y materiales",
    riskLevel: "high",
    followUpNotes: "Se contactó a servicios de bienestar estudiantil",
  },
  {
    id: "2",
    studentId: "7",
    periodId: "2025-1",
    date: "2024-10-15",
    reason: "academic_performance",
    type: "temporary",
    subjectIds: ["6", "7"],
    notes: "Reprobó 3 materias consecutivas",
    returnDate: "2025-08-01",
    riskLevel: "medium",
    followUpNotes: "Asignado a programa de tutorías",
  },
]

// Alertas de riesgo
export const studentRiskAlerts: StudentRiskAlert[] = [
  {
    id: "1",
    studentId: "2",
    periodId: "2025-1",
    type: "attendance",
    severity: "high",
    description: "4 inasistencias consecutivas en Programación Avanzada",
    date: "2025-02-10",
    resolved: false,
  },
  {
    id: "2",
    studentId: "2",
    periodId: "2025-1",
    type: "grades",
    severity: "medium",
    description: "Promedio por debajo de 70 en Base de Datos II",
    date: "2025-03-16",
    resolved: false,
  },
  {
    id: "3",
    studentId: "7",
    periodId: "2024-2",
    type: "dropout_risk",
    severity: "critical",
    description: "Alto riesgo de abandono: bajo rendimiento + inasistencias",
    date: "2024-10-01",
    resolved: true,
    resolvedDate: "2024-10-15",
    resolvedNotes: "Estudiante dio de baja temporal",
  },
]

// Tareas y trabajos
export const assignments: Assignment[] = [
  {
    id: "1",
    subjectId: "1",
    periodId: "2025-1",
    title: "Proyecto: Patrones de Diseño",
    description: "Implementar un sistema usando al menos 3 patrones de diseño",
    dueDate: "2025-03-28",
    maxScore: 100,
    type: "project",
    status: "active",
  },
  {
    id: "2",
    subjectId: "2",
    periodId: "2025-1",
    title: "Práctica: Consultas Avanzadas",
    description: "Optimización de consultas en PostgreSQL",
    dueDate: "2025-03-20",
    maxScore: 100,
    type: "lab",
    status: "active",
  },
  {
    id: "3",
    subjectId: "6",
    periodId: "2025-1",
    title: "Caso de Estudio: Análisis de Costos",
    description: "Análisis de estructura de costos de una empresa local",
    dueDate: "2025-03-25",
    maxScore: 100,
    type: "project",
    status: "active",
  },
]

// Entregas de estudiantes
export const studentAssignments: StudentAssignment[] = [
  { id: "1", assignmentId: "1", studentId: "1", status: "submitted", submittedDate: "2025-03-26" },
  { id: "2", assignmentId: "1", studentId: "2", status: "pending" },
  {
    id: "3",
    assignmentId: "2",
    studentId: "1",
    status: "graded",
    submittedDate: "2025-03-18",
    score: 95,
    feedback: "Excelente optimización",
  },
  { id: "4", assignmentId: "2", studentId: "8", status: "submitted", submittedDate: "2025-03-19" },
  { id: "5", assignmentId: "3", studentId: "3", status: "pending" },
]

// Mantener cursos para compatibilidad
export const courses: Course[] = [
  {
    id: "1",
    name: "Programación Avanzada",
    code: "SIS-501",
    description: "Patrones de diseño, arquitectura de software",
    teacher: "Dr. Juan Pérez",
    credits: 6,
    schedule: "Lun, Mié, Vie 8:00-10:00",
    capacity: 35,
    enrolled: 28,
  },
  {
    id: "2",
    name: "Base de Datos II",
    code: "SIS-502",
    description: "Bases de datos distribuidas, NoSQL",
    teacher: "Dr. Juan Pérez",
    credits: 6,
    schedule: "Mar, Jue 10:00-12:30",
    capacity: 35,
    enrolled: 30,
  },
]
