"use client";

import { Calendar, momentLocalizer, /*EventProps*/ } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addHours, parseISO, isBefore } from "date-fns";
import moment from "moment";

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
  candidat: { prenom: string; nom: string };
}

export default function CalendrierInteractif() {
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
          const end = addHours(start, 1);
          return {
            id: call.id,
            title: `📹 ${call.offre.titre} avec ${call.candidat.prenom} ${call.candidat.nom}`,
            start,
            end,
            isPast: isBefore(end, now),
          };
        });
        setEvents(formatted);
      });
  }, []);

  const handleSlotSelect = ({ start }: { start: Date }) => {
    const localISOString = start.toISOString().slice(0, 16);
    router.push(`/planifier-visio?date=${localISOString}`);
  };

  const handleEventSelect = (event: Event) => {
    if (!event.isPast) {
      router.push(`/video-call/${event.id}`);
    }
  };

  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.isPast ? "#ccc" : "#2563eb", // gris ou bleu
        color: event.isPast ? "#666" : "white",
        cursor: event.isPast ? "not-allowed" : "pointer",
        opacity: event.isPast ? 0.6 : 1,
      },
    };
  };

  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSlotSelect}
        views={["month", "week", "day"]}
        culture="fr"
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
        eventPropGetter={eventStyleGetter}
        style={{ backgroundColor: "white", borderRadius: "8px", padding: "10px" }}
      />
    </div>
  );
}
