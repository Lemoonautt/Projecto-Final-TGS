# UniGestión - Sistema de Gestión Universitaria

Protipo de Sistema de seguimiento de gestión académica universitaria con seguimiento de estudiantes, calificaciones, asistencias y control de abandonos.

## 🚀 Inicio Rápido

### estudiantes

- Limberg Edgar Montes Tancara
- Jorge Luis Quispe Mollericona
- Elionai Paredes Rojas

### Requisitos
- Node.js 18+
- npm

### Instalación

```bash
# Instalar dependencias
npm install
```

### Ejecutar el Sistema

**Opción 1: Ejecutar todo (Recomendado)**
```bash
npm run dev:full
```
Este comando inicia simultáneamente:
- json-server en el puerto 3001 (backend simulado)
- Next.js en el puerto 3000 (frontend)

**Opción 2: Ejecutar manualmente**
```bash
# Terminal 1: Iniciar json-server
npm run server

# Terminal 2: Iniciar Next.js
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 🔑 Credenciales de Acceso

### Administrador
- **Email:** admin@universidad.edu
- **Contraseña:** admin123
- **Acceso:** Dashboard con todas las funcionalidades

## 📊 Características

- ✅ Gestión de estudiantes
- ✅ Gestión de docentes
- ✅ Gestión de carreras y materias
- ✅ Registro de asistencias
- ✅ Calificaciones (parciales, finales, recuperatorios)
- ✅ Tareas y trabajos
- ✅ Seguimiento de bajas/abandonos
- ✅ Alertas de riesgo académico
- ✅ Portal del estudiante
- ✅ Reportes y estadísticas

## 🗄️ Persistencia de Datos

El sistema utiliza **json-server** para simular un backend REST API:
- Los datos se almacenan en `db.json`
- Todos los cambios persisten entre recargas de página
- API REST completa disponible en `http://localhost:3001`

### Endpoints de la API

```
GET    /students              # Obtener todos los estudiantes
GET    /students/:id          # Obtener un estudiante
POST   /students              # Crear estudiante
PATCH  /students/:id          # Actualizar estudiante
DELETE /students/:id          # Eliminar estudiante

# Similar para:
/teachers, /subjects, /grades, /attendances, /assignments,
/studentAssignments, /withdrawals, /academicPeriods, /careers,
/enrollments, /studentRiskAlerts, /courses
```

## 🏗️ Estructura del Proyecto

```
app/                    # Rutas de Next.js (App Router)
  ├── login/           # Página de login
    ├── mi-portal/       # Portal del estudiante
      ├── estudiantes/     # Gestión de estudiantes
        ├── docentes/        # Gestión de docentes
          ├── materias/        # Gestión de materias
            └── ...              # Otros módulos
            
            components/            # Componentes React
              ├── ui/             # Componentes de UI (shadcn/ui)
                ├── layout/         # Componentes de layout
                  ├── students/       # Componentes de estudiantes
                    └── ...             # Otros componentes
                    
                    lib/                  # Utilidades y lógica
                      ├── api.ts         # Cliente API para json-server
                        ├── store.ts       # Store de Zustand con API
                          ├── auth-store.ts  # Store de autenticación
                            └── data.ts        # Tipos de datos
                            
                            db.json               # Base de datos JSON
                            ```
                            
                            ## 🔧 Tecnologías
                            
                            - **Frontend:** Next.js 16, React 19, TypeScript
                            - **Estado:** Zustand
                            - **UI:** shadcn/ui (Radix UI + Tailwind CSS)
                            - **Formularios:** React Hook Form + Zod
                            - **Gráficos:** Recharts
                            - **Backend Simulado:** json-server
                            
                            ## 📝 Scripts Disponibles
                            
                            ```bash
                            npm run dev:full      # Ejecutar Next.js + json-server
                            npm run dev           # Solo Next.js
                            npm run server        # Solo json-server
                            npm run build         # Compilar para producción
npm run start         # Iniciar en producción
npm run lint          # Ejecutar ESLint
```

## 🎓 Contexto Universitario Boliviano

El sistema está adaptado al contexto universitario boliviano:
- **Gestiones:** Períodos académicos (Gestión 1/2025, etc.)
- **Carreras:** Programas académicos de 10-12 semestres
- **Materias:** Con código, prerequisitos
- **Calificaciones:** Sistema de 0-100 puntos
- **Horarios:** Formato local boliviano



## 📄 Licencia

Este es un proyecto académico de demostración.
