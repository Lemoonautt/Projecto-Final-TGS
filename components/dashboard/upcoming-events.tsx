import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Reunión de Padres",
    date: "28 Nov 2024",
    time: "18:00",
    type: "meeting",
  },
  {
    id: 2,
    title: "Examen de Matemáticas",
    date: "02 Dic 2024",
    time: "09:00",
    type: "exam",
  },
  {
    id: 3,
    title: "Excursión Cultural",
    date: "05 Dic 2024",
    time: "08:00",
    type: "event",
  },
  {
    id: 4,
    title: "Entrega de Notas",
    date: "15 Dic 2024",
    time: "10:00",
    type: "deadline",
  },
]

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{event.title}</p>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{event.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
