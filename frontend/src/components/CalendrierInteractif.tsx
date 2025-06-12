"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addHours, parseISO } from "date-fns";
import moment from "moment";

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

interface VisioCall {
  id: number;
  scheduledAt: string;
  offre: { titre: string };
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
        const formatted = data.map((call) => ({
          id: call.id,
          title: `📹 Visio : ${call.offre.titre}`,
          start: parseISO(call.scheduledAt),
          end: addHours(parseISO(call.scheduledAt), 1),
        }));
        setEvents(formatted);
      });
  }, []);

  const handleSlotSelect = ({ start }: { start: Date }) => {
    const localISOString = start.toISOString().slice(0, 16);
    router.push(`/planifier-visio?date=${localISOString}`);
  };

  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => router.push(`/video-call/${event.id}`)}
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
        style={{ backgroundColor: "white", borderRadius: "8px", padding: "10px" }}
      />
    </div>
  );
}
