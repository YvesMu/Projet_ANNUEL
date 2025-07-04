"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  photoUrl?: string;
}

interface Offre {
  id: number;
  titre: string;
}

type Status = "EN_ATTENTE" | "ENTRETIEN" | "RETENUE" | "REFUSE" | "ACCEPTE";

interface Postulation {
  id: number;
  candidat: Candidat;
  offre: Offre;
  status: Status;
}

export default function GestionCandidats() {
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchPostulations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/postulations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setPostulations(data);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des candidatures.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulations();
  }, []);

  const handleStatutChange = async (id: number, newStatut: Status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/postulations/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatut }),
      });
      if (!res.ok) throw new Error("Erreur serveur");

      setPostulations((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatut } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handlePlanifierAppel = async (postulation: Postulation) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-call/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidatId: postulation.candidat.id,
          offreId: postulation.offre.id,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur lors de la création de la visio");
      const data = await res.json();

      // Rediriger directement vers la visio
      window.location.href = data.roomUrl;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la planification de l'appel vidéo.");
    }
  };

  const getStatusBadge = (status: Status) => {
    const config = {
      ACCEPTE: { bg: "from-green-500 to-emerald-500", text: "Accepté", icon: "✅" },
      REFUSE: { bg: "from-red-500 to-red-600", text: "Refusé", icon: "❌" },
      RETENUE: { bg: "from-yellow-400 to-orange-500", text: "Retenu", icon: "⭐" },
      ENTRETIEN: { bg: "from-blue-500 to-indigo-500", text: "Entretien", icon: "🎯" },
      EN_ATTENTE: { bg: "from-gray-400 to-gray-500", text: "En attente", icon: "⏳" }
    };
    
    const statusConfig = config[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${statusConfig.bg}`}>
        <span className="mr-1">{statusConfig.icon}</span>
        {statusConfig.text}
      </span>
    );
  };

  const getStatusStats = () => {
    const stats = postulations.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { label: "En attente", count: stats.EN_ATTENTE || 0, color: "text-gray-600", bg: "bg-gray-100" },
      { label: "Entretiens", count: stats.ENTRETIEN || 0, color: "text-blue-600", bg: "bg-blue-100" },
      { label: "Retenus", count: stats.RETENUE || 0, color: "text-yellow-600", bg: "bg-yellow-100" },
      { label: "Acceptés", count: stats.ACCEPTE || 0, color: "text-green-600", bg: "bg-green-100" },
    ];
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👥
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Gestion des Candidats
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gérez toutes les candidatures reçues pour vos offres d&apos;emploi
            </p>
          </div>

          {postulations.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {getStatusStats().map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className={`text-xl font-bold ${stat.color}`}>
                      {stat.count}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{stat.label}</h3>
                  <p className="text-sm text-gray-500">candidature{stat.count > 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement des candidatures...</h2>
              <p className="text-gray-600">Récupération des données</p>
            </div>
          ) : postulations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">📭</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Aucune candidature pour le moment
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Les candidatures apparaîtront ici dès que les candidats postuleront à vos offres
              </p>
              <a 
                href="/dashboard-pro"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">📊</span>
                Tableau de bord
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Toutes les candidatures</h2>
                <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                  {postulations.length} candidature{postulations.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid gap-6">
                {postulations.map((p) => (
                  <div key={p.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 p-8 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        {p.candidat.photoUrl ? (
                          <img
                            src={p.candidat.photoUrl}
                            alt="Photo du candidat"
                            className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 flex items-center justify-center text-purple-600 text-2xl font-bold shadow-lg">
                            {p.candidat.prenom.charAt(0)}{p.candidat.nom.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                              {p.candidat.prenom} {p.candidat.nom}
                            </h3>
                            <p className="text-gray-600 flex items-center mt-1">
                              <span className="mr-2">📧</span>
                              {p.candidat.email}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(p.status)}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <p className="text-gray-700 font-medium flex items-center">
                            <span className="mr-2">💼</span>
                            Candidature pour : <span className="ml-2 font-bold text-purple-600">{p.offre.titre}</span>
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Statut de la candidature
                            </label>
                            <select
                              value={p.status}
                              onChange={(e) => handleStatutChange(p.id, e.target.value as Status)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white"
                            >
                              <option value="EN_ATTENTE">⏳ En attente</option>
                              <option value="ENTRETIEN">🎯 Entretien</option>
                              <option value="RETENUE">⭐ Retenu</option>
                              <option value="REFUSE">❌ Refusé</option>
                              <option value="ACCEPTE">✅ Accepté</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={() => handlePlanifierAppel(p)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                            >
                              <span className="mr-2">📞</span>
                              Planifier visio
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
