"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import CalendrierVisio from "@/components/Calendrier";

interface VideoCall {
  id: number;
  offre: { id: number; titre: string };
  candidat: { id: number; prenom: string; nom: string };
  professionnel: { id: number; prenom: string; nom: string };
  scheduledAt: string;
  roomUrl: string;
}

export default function MesVisios() {
  const [calls, setCalls] = useState<VideoCall[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCalls = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-call/my-calls`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setCalls(data);
        setFilteredCalls(data);
      } catch (err) {
        console.error(err);
        alert("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [router]);

  useEffect(() => {
    const now = new Date();
    const result = calls.filter((call) => {
      const matchSearch =
        call.offre.titre.toLowerCase().includes(search.toLowerCase()) ||
        call.candidat.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        call.candidat.nom?.toLowerCase().includes(search.toLowerCase()) ||
        call.professionnel.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        call.professionnel.nom?.toLowerCase().includes(search.toLowerCase());

      const scheduledDate = new Date(call.scheduledAt);

      const matchFilter =
        filter === "all" ||
        (filter === "upcoming" && scheduledDate > now) ||
        (filter === "past" && scheduledDate <= now);

      return matchSearch && matchFilter;
    });

    setFilteredCalls(result);
    setCurrentPage(1);
  }, [search, filter, calls]);

  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleJoin = (callId: number) => {
    router.push(`/video-call/${callId}`);
  };

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
              🎥
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Mes Visios
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gérez et participez à vos entretiens vidéo planifiés
            </p>
          </div>

          <div className="mb-12">
            <CalendrierVisio />
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher une visio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </span>
              </div>

              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "all" | "upcoming" | "past")}
                  className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12 appearance-none min-w-48"
                >
                  <option value="all">📅 Toutes</option>
                  <option value="upcoming">⏳ À venir</option>
                  <option value="past">✅ Terminées</option>
                </select>
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  📋
                </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🎥</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement des visios...</h2>
                <p className="text-gray-600">Récupération de vos entretiens</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-8">🎥</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Aucune visio trouvée</h3>
                <p className="text-gray-600 text-lg mb-8">
                  {search || filter !== "all" 
                    ? "Aucune visio ne correspond à vos critères de recherche."
                    : "Vous n'avez pas encore de visios planifiées."
                  }
                </p>
                {(!search && filter === "all") && (
                  <button
                    onClick={() => router.push("/planifier-visio")}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <span className="mr-3 text-xl">📅</span>
                    Planifier une visio
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedCalls.map((call) => (
                  <div
                    key={call.id}
                    className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-3 ${isUpcoming(call.scheduledAt) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <h3 className="text-xl font-bold text-gray-900">{call.offre.titre}</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              🕒
                            </span>
                            <div>
                              <p className="text-sm text-gray-600">Date et heure</p>
                              <p className="font-medium text-gray-900">
                                {new Date(call.scheduledAt).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              👤
                            </span>
                            <div>
                              <p className="text-sm text-gray-600">Avec</p>
                              <p className="font-medium text-gray-900">
                                {call.professionnel.prenom} {call.professionnel.nom}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          isUpcoming(call.scheduledAt) 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {isUpcoming(call.scheduledAt) ? '⏳ À venir' : '✅ Terminée'}
                        </span>
                        
                        <button
                          onClick={() => handleJoin(call.id)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                        >
                          <span className="mr-2">🎥</span>
                          Rejoindre
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                    >
                      <span className="mr-2">◀</span>
                      Précédent
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                    >
                      Suivant
                      <span className="ml-2">▶</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
