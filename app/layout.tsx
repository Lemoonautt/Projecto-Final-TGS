import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StoreInitializer } from "@/components/store-initializer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "UniGestión - Sistema de Gestión Universitaria",
    template: "%s | UniGestión",
  },
  description:
    "Sistema completo de seguimiento académico, gestión de estudiantes, calificaciones y control de abandonos universitarios",
  keywords: ["universidad", "gestión académica", "estudiantes", "calificaciones", "asistencias"],
  authors: [{ name: "UniGestión" }],
  creator: "UniGestión",
  applicationName: "UniGestión",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <StoreInitializer>{children}</StoreInitializer>
        <Analytics />
      </body>
    </html>
  )
}
