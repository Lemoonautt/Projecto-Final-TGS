erDiagram
    %% ============================================
    %% NÚCLEO: GESTIÓN ACADÉMICA - MERMAID
    %% ============================================
    
    ESTUDIANTE {
        int id_estudiante PK
        string codigo UK
        string nombres
        string apellidos
        string dni UK
        string email
        string telefono
        date fecha_ingreso
        string estado "activo/inactivo/egresado/retirado"
        int id_carrera FK
    }
    
    CARRERA {
        int id_carrera PK
        string codigo UK
        string nombre
        int creditos_totales
        int duracion_semestres
    }
    
    MATERIA {
        int id_materia PK
        string codigo UK
        string nombre
        int creditos
        int semestre_sugerido
        int id_carrera FK
    }
    
    DOCENTE {
        int id_docente PK
        string codigo UK
        string nombres
        string apellidos
        string email
        string especialidad
    }
    
    PERIODO {
        int id_periodo PK
        string codigo UK "2024-1"
        date fecha_inicio
        date fecha_fin
        string estado "activo/finalizado"
    }
    
    GRUPO {
        int id_grupo PK
        int id_materia FK
        int id_periodo FK
        int id_docente FK
        string seccion "A/B/C"
        int cupo_maximo
        string horario
    }
    
    %% ============================================
    %% OPERACIÓN ACADÉMICA
    %% ============================================
    
    MATRICULA {
        int id_matricula PK
        int id_estudiante FK
        int id_grupo FK
        int id_periodo FK
        date fecha_matricula
        string estado "cursando/aprobado/reprobado/retirado"
        decimal nota_final
    }
    
    ASISTENCIA {
        int id_asistencia PK
        int id_matricula FK
        date fecha
        string estado "presente/ausente/justificado"
    }
    
    EVALUACION {
        int id_evaluacion PK
        int id_grupo FK
        string nombre "Parcial 1/Final/Trabajo"
        decimal peso_porcentaje
        date fecha
    }
    
    NOTA {
        int id_nota PK
        int id_matricula FK
        int id_evaluacion FK
        decimal calificacion
        date fecha_registro
    }
    
    %% ============================================
    %% SEGUIMIENTO Y ALERTAS
    %% ============================================
    
    INDICADOR_ESTUDIANTE {
        int id_indicador PK
        int id_estudiante FK
        int id_periodo FK
        decimal promedio_periodo
        decimal promedio_acumulado
        decimal porcentaje_asistencia
        decimal avance_curricular
        int materias_reprobadas
        string nivel_riesgo "bajo/medio/alto/critico"
        date fecha_calculo
    }
    
    ALERTA {
        int id_alerta PK
        int id_estudiante FK
        string tipo "bajo_rendimiento/ausentismo/riesgo_desercion"
        string descripcion
        date fecha_generacion
        string estado "pendiente/atendida/cerrada"
    }
    
    %% ============================================
    %% CASOS E INTERVENCIONES
    %% ============================================
    
    CASO {
        int id_caso PK
        int id_estudiante FK
        string tipo "seguimiento/riesgo_academico/abandono"
        date fecha_apertura
        string estado "abierto/en_proceso/cerrado"
        int responsable FK
        string observaciones
    }
    
    INTERVENCION {
        int id_intervencion PK
        int id_caso FK
        string tipo "tutoria/entrevista/plan_mejora"
        date fecha
        string descripcion
        string resultado
    }
    
    ABANDONO {
        int id_abandono PK
        int id_estudiante FK
        date fecha_abandono
        string motivo "academico/economico/personal/laboral"
        string detalle
        int id_caso FK
    }
    
    %% ============================================
    %% USUARIOS
    %% ============================================
    
    USUARIO {
        int id_usuario PK
        string username UK
        string password_hash
        string rol "admin/coordinador/docente/estudiante"
        string email
        string estado "activo/inactivo"
    }
    
    %% ============================================
    %% RELACIONES
    %% ============================================
    
    ESTUDIANTE }o--|| CARRERA : "estudia"
    ESTUDIANTE ||--o{ MATRICULA : "se_matricula"
    ESTUDIANTE ||--o{ INDICADOR_ESTUDIANTE : "tiene"
    ESTUDIANTE ||--o{ ALERTA : "genera"
    ESTUDIANTE ||--o{ CASO : "tiene"
    ESTUDIANTE ||--o| ABANDONO : "puede_abandonar"
    
    CARRERA ||--o{ MATERIA : "contiene"
    
    MATERIA ||--o{ GRUPO : "se_imparte"
    
    DOCENTE ||--o{ GRUPO : "dicta"
    
    PERIODO ||--o{ GRUPO : "tiene"
    PERIODO ||--o{ INDICADOR_ESTUDIANTE : "calcula"
    
    GRUPO ||--o{ MATRICULA : "inscribe"
    GRUPO ||--o{ EVALUACION : "programa"
    
    MATRICULA ||--o{ ASISTENCIA : "registra"
    MATRICULA ||--o{ NOTA : "obtiene"
    
    EVALUACION ||--o{ NOTA : "califica"
    
    ALERTA ||--o| CASO : "puede_generar"
    CASO ||--o{ INTERVENCION : "requiere"
    CASO ||--o| ABANDONO : "puede_resultar"
    
    USUARIO ||--o{ CASO : "atiende"