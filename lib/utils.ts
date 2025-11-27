import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcularNivel(semestre: number): number {
  return Math.ceil(semestre / 2)
}

export function getNivelLabel(nivel: number): string {
  const labels: Record<number, string> = {
    1: "Primer Año",
    2: "Segundo Año",
    3: "Tercer Año",
    4: "Cuarto Año",
    5: "Quinto Año",
    6: "Sexto Año",
  }
  return labels[nivel] || `Año ${nivel}`
}

export function getNivelFromSemester(semestre: number): {
  nivel: number
  label: string
} {
  const nivel = calcularNivel(semestre)
  return {
    nivel,
    label: getNivelLabel(nivel)
  }
}
