"use client";

import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { addHours, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  isPast: boolean;
}

interface VisioCall {
  id: number;
  scheduledAt: string;
  offre: { titre: string };
}

export default function CalendrierPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/video-call/my-calls", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: VisioCall[]) => {
        const now = new Date();
        const formatted = data.map((call) => {
          const start = parseISO(call.scheduledAt);
          return {
            id: call.id,
            title: `📹 Visio : ${call.offre.titre}`,
            start,
            end: addHours(start, 1),
            isPast: start < now,
          };
        });
        setEvents(formatted);
      });
  }, []);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const dateISO = slotInfo.start.toISOString();
    router.push(`/planifier-visio?date=${dateISO}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📅 Calendrier des Visios</h1>
      <div style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={(event) => router.push(`/video-call/${event.id}`)}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={(event) => {
            const style = {
              backgroundColor: event.isPast ? "#ccc" : "#3b82f6",
              borderRadius: "6px",
              opacity: event.isPast ? 0.6 : 1,
              color: "white",
              padding: "4px",
            };
            return { style };
          }}
          messages={{
            today: "Aujourd'hui",
            next: "Suivant",
            previous: "Précédent",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
            date: "Date",
            time: "Heure",
            event: "Événement",
          }}
          culture="fr"
        />
      </div>
    </div>
  );
}
