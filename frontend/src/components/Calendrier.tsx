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

export default function CalendrierVisio() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-call/my-calls`, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header moderne */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Calendrier des Visioconférences
              </h1>
              <p className="text-gray-600 mt-1">Gérez et visualisez vos rendez-vous professionnels</p>
            </div>
          </div>
        </div>

        {/* Calendrier dans un conteneur moderne */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Toolbar personnalisée */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  🎯
                </div>
                <span className="font-semibold">Planning des entretiens</span>
              </div>
              <div className="text-blue-100 text-sm">
                {events.length} visio{events.length > 1 ? 's' : ''} programmée{events.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Zone du calendrier */}
          <div className="p-6">
            <div 
              className="calendar-container rounded-xl overflow-hidden shadow-inner bg-gray-50/50"
              style={{ height: "700px" }}
            >
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={(event) => router.push(`/video-call/${event.id}`)}
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
                eventPropGetter={(event) => {
                  const now = new Date();
                  if (event.end < now) {
                    return {
                      style: {
                        backgroundColor: "#e2e8f0",
                        color: "#64748b",
                        textDecoration: "line-through",
                        opacity: 0.7,
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        fontWeight: "500",
                      },
                    };
                  }
                  return {
                    style: {
                      backgroundColor: "linear-gradient(135deg, #3b82f6, #6366f1)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "6px 12px",
                      fontSize: "13px",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    },
                  };
                }}
                dayPropGetter={(date) => {
                  const today = new Date();
                  if (
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                  ) {
                    return {
                      style: {
                        backgroundColor: "#eff6ff",
                        border: "2px solid #3b82f6",
                        borderRadius: "8px",
                      },
                    };
                  }
                  return {};
                }}
              />
            </div>
          </div>

          {/* Footer informatif */}
          <div className="border-t border-gray-200/50 p-4 bg-gray-50/50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span>Visios programmées</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Visios passées</span>
                </div>
              </div>
              <div className="text-gray-500">
                💡 Cliquez sur un événement pour rejoindre la visio
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés pour le calendrier */}
      <style jsx global>{`
        .calendar-container .rbc-calendar {
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .calendar-container .rbc-header {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          color: #374151;
          font-weight: 600;
          padding: 12px 8px;
          border: none;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .calendar-container .rbc-today {
          background-color: #eff6ff !important;
        }
        
        .calendar-container .rbc-toolbar {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .calendar-container .rbc-toolbar button {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .calendar-container .rbc-toolbar button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .calendar-container .rbc-toolbar button.rbc-active {
          background: linear-gradient(135deg, #1d4ed8, #4338ca);
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.4);
        }
        
        .calendar-container .rbc-month-view,
        .calendar-container .rbc-time-view {
          border: none;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .calendar-container .rbc-date-cell {
          padding: 8px;
          font-weight: 500;
        }
        
        .calendar-container .rbc-event {
          transition: all 0.3s ease;
        }
        
        .calendar-container .rbc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
        }
      `}</style>
    </div>
  );
}
