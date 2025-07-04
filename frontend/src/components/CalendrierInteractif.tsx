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
  const [isLoading, setIsLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);
  const [upcomingCalls, setUpcomingCalls] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

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
        setTotalCalls(data.length);
        setUpcomingCalls(formatted.filter(event => !event.isPast).length);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
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
        backgroundColor: event.isPast ? "#e5e7eb" : "#3b82f6",
        border: event.isPast ? "1px solid #d1d5db" : "1px solid #2563eb",
        color: event.isPast ? "#6b7280" : "white",
        cursor: event.isPast ? "not-allowed" : "pointer",
        opacity: event.isPast ? 0.7 : 1,
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "600",
        boxShadow: event.isPast ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      },
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-16">
        {/* Stats skeleton - Style identique à la page principale */}
        <section className="py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calendar skeleton */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-16 animate-pulse"></div>
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Stats Section - Style identique à la page principale */}
      <section className="py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalCalls}</div>
              <div className="text-gray-600">Total visios</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{upcomingCalls}</div>
              <div className="text-gray-600">À venir</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">{new Set(events.map(e => e.title.split('avec ')[1])).size}</div>
              <div className="text-gray-600">Candidats</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-600 mb-2">{Math.round((upcomingCalls / totalCalls) * 100) || 0}%</div>
              <div className="text-gray-600">Planification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section - Style identique aux Featured Categories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            📅 Votre planning de visioconférences
          </h2>
          
          {/* Calendar Container - Style des category cards */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="calendar-container" style={{ height: "700px" }}>
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
                    noEventsInRange: "Aucun événement dans cette période",
                    showMore: (total) => `+ ${total} de plus`,
                  }}
                  eventPropGetter={eventStyleGetter}
                  style={{ 
                    backgroundColor: "transparent",
                    borderRadius: "12px",
                    fontFamily: "system-ui, -apple-system, sans-serif"
                  }}
                  className="modern-calendar"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Style des Quick Filters de la page principale */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Actions rapides
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "📅 Planifier", action: "/planifier-visio", color: "hover:bg-blue-50 hover:border-blue-200" },
              { label: "🎥 Mes visios", action: "/mes-visios", color: "hover:bg-green-50 hover:border-green-200" },
              { label: "👤 Mon profil", action: "/profile", color: "hover:bg-purple-50 hover:border-purple-200" },
              { label: "📊 Dashboard", action: "/dashboard", color: "hover:bg-indigo-50 hover:border-indigo-200" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.action)}
                className={`px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 ${item.color} cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Help Cards - Style des category cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Guide d'utilisation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Planifier", desc: "Cliquez sur un créneau libre", icon: "📅", color: "from-blue-500 to-cyan-500" },
              { title: "Rejoindre", desc: "Cliquez sur un événement", icon: "🎥", color: "from-green-500 to-emerald-500" },
              { title: "Naviguer", desc: "Changez de vue (mois/semaine)", icon: "🔄", color: "from-purple-500 to-pink-500" },
              { title: "Historique", desc: "Événements passés en gris", icon: "📊", color: "from-yellow-500 to-orange-500" },
            ].map((guide) => (
              <div
                key={guide.title}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${guide.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {guide.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                <p className="text-gray-600">{guide.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .modern-calendar .rbc-toolbar {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border: none;
        }
        
        .modern-calendar .rbc-toolbar button {
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .modern-calendar .rbc-toolbar button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .modern-calendar .rbc-toolbar button.rbc-active {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
        }
        
        .modern-calendar .rbc-toolbar .rbc-toolbar-label {
          color: white;
          font-size: 28px;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .modern-calendar .rbc-month-view,
        .modern-calendar .rbc-time-view {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          background: white;
        }
        
        .modern-calendar .rbc-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 2px solid #e2e8f0;
          color: #475569;
          font-weight: 700;
          padding: 16px 12px;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }
        
        .modern-calendar .rbc-date-cell {
          text-align: center;
          padding: 12px;
          font-weight: 600;
          color: #374151;
          transition: all 0.3s ease;
          border-radius: 8px;
          margin: 2px;
        }
        
        .modern-calendar .rbc-date-cell:hover {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          transform: scale(1.05);
        }
        
        .modern-calendar .rbc-today {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%) !important;
          color: white !important;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .modern-calendar .rbc-off-range-bg {
          background: #f9fafb;
        }
        
        .modern-calendar .rbc-event {
          border-radius: 8px;
          padding: 6px 12px;
          margin: 2px 0;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
        }
        
        .modern-calendar .rbc-event:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .modern-calendar .rbc-slot-selection {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          border: 2px solid #3b82f6;
          border-radius: 8px;
        }
        
        .modern-calendar .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid #f1f5f9;
        }
        
        .modern-calendar .rbc-time-view .rbc-time-gutter {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-right: 1px solid #e2e8f0;
          border-radius: 12px 0 0 12px;
        }
        
        .modern-calendar .rbc-time-view .rbc-time-content {
          border-left: none;
        }
        
        .modern-calendar .rbc-current-time-indicator {
          background: #ef4444;
          height: 3px;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
        }
      `}</style>
    </div>
  );
}
