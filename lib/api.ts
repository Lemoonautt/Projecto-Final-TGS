// API client para 
const API_URL = "http://localhost:3001"

// Helper para manejar errores
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Generic CRUD operations
async function getAll<T>(resource: string): Promise<T[]> {
  const response = await fetch(`${API_URL}/${resource}`)
  return handleResponse<T[]>(response)
}

async function getById<T>(resource: string, id: string): Promise<T> {
  const response = await fetch(`${API_URL}/${resource}/${id}`)
  return handleResponse<T>(response)
}

async function create<T>(resource: string, data: Partial<T>): Promise<T> {
  const response = await fetch(`${API_URL}/${resource}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<T>(response)
}

async function update<T>(resource: string, id: string, data: Partial<T>): Promise<T> {
  const response = await fetch(`${API_URL}/${resource}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<T>(response)
}

async function remove(resource: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${resource}/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

// API functions for each resource
export const api = {
  // Students
  students: {
    getAll: () => getAll("students"),
    getById: (id: string) => getById("students", id),
    create: (data: any) => create("students", data),
    update: (id: string, data: any) => update("students", id, data),
    delete: (id: string) => remove("students", id),
  },

  // Teachers
  teachers: {
    getAll: () => getAll("teachers"),
    getById: (id: string) => getById("teachers", id),
    create: (data: any) => create("teachers", data),
    update: (id: string, data: any) => update("teachers", id, data),
    delete: (id: string) => remove("teachers", id),
  },

  // Subjects
  subjects: {
    getAll: () => getAll("subjects"),
    getById: (id: string) => getById("subjects", id),
    create: (data: any) => create("subjects", data),
    update: (id: string, data: any) => update("subjects", id, data),
    delete: (id: string) => remove("subjects", id),
  },

  // Grades
  grades: {
    getAll: () => getAll("grades"),
    getById: (id: string) => getById("grades", id),
    create: (data: any) => create("grades", data),
    update: (id: string, data: any) => update("grades", id, data),
    delete: (id: string) => remove("grades", id),
  },

  // Attendance
  attendances: {
    getAll: () => getAll("attendances"),
    getById: (id: string) => getById("attendances", id),
    create: (data: any) => create("attendances", data),
    update: (id: string, data: any) => update("attendances", id, data),
    delete: (id: string) => remove("attendances", id),
    bulkCreate: async (attendances: any[]) => {
      const promises = attendances.map((attendance) => create("attendances", attendance))
      return Promise.all(promises)
    },
  },

  // Assignments
  assignments: {
    getAll: () => getAll("assignments"),
    getById: (id: string) => getById("assignments", id),
    create: (data: any) => create("assignments", data),
    update: (id: string, data: any) => update("assignments", id, data),
    delete: (id: string) => remove("assignments", id),
  },

  // Student Assignments
  studentAssignments: {
    getAll: () => getAll("studentAssignments"),
    getById: (id: string) => getById("studentAssignments", id),
    create: (data: any) => create("studentAssignments", data),
    update: (id: string, data: any) => update("studentAssignments", id, data),
    delete: (id: string) => remove("studentAssignments", id),
  },

  // Withdrawals
  withdrawals: {
    getAll: () => getAll("withdrawals"),
    getById: (id: string) => getById("withdrawals", id),
    create: (data: any) => create("withdrawals", data),
    update: (id: string, data: any) => update("withdrawals", id, data),
    delete: (id: string) => remove("withdrawals", id),
  },

  // Academic Periods
  academicPeriods: {
    getAll: () => getAll("academicPeriods"),
    getById: (id: string) => getById("academicPeriods", id),
    create: (data: any) => create("academicPeriods", data),
    update: (id: string, data: any) => update("academicPeriods", id, data),
  },

  // Careers
  careers: {
    getAll: () => getAll("careers"),
    getById: (id: string) => getById("careers", id),
    create: (data: any) => create("careers", data),
    update: (id: string, data: any) => update("careers", id, data),
  },

  // Enrollments
  enrollments: {
    getAll: () => getAll("enrollments"),
    getById: (id: string) => getById("enrollments", id),
    create: (data: any) => create("enrollments", data),
    update: (id: string, data: any) => update("enrollments", id, data),
    delete: (id: string) => remove("enrollments", id),
  },

  // Student Risk Alerts
  studentRiskAlerts: {
    getAll: () => getAll("studentRiskAlerts"),
    getById: (id: string) => getById("studentRiskAlerts", id),
    create: (data: any) => create("studentRiskAlerts", data),
    update: (id: string, data: any) => update("studentRiskAlerts", id, data),
  },

  // Courses
  courses: {
    getAll: () => getAll("courses"),
    getById: (id: string) => getById("courses", id),
    create: (data: any) => create("courses", data),
    update: (id: string, data: any) => update("courses", id, data),
    delete: (id: string) => remove("courses", id),
  },
}
