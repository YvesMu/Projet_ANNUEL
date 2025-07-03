"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Offre {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  typeContrat: string;
  lieu: string;
  salaire: string;
  createdAt: string;
}

interface Postulation {
  id: number;
  offre: Offre;
  createdAt: string;
  status: "EN_ATTENTE" | "ENTRETIEN" | "RETENUE" | "REFUSE" | "ACCEPTE";
}

export default function Dashboard() {
  const router = useRouter();
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);

      if (payload.role === "professionnel") {
        router.push("/dashboard-pro");
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/postulations/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setPostulations(data))
        .catch((err) => console.error("Erreur lors du chargement des candidatures :", err))
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Erreur de décodage du token", err);
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👤
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Mon Espace Candidat
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Suivez l&apos;évolution de vos candidatures et découvrez de nouvelles opportunités
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h2>
              <p className="text-gray-600">Récupération de vos candidatures</p>
            </div>
          ) : postulations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">💼</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tu n&apos;as pas encore postulé à des offres.
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Commencez votre parcours professionnel en postulant à des offres qui vous intéressent
              </p>
              <a
                href="/offres"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">🔍</span>
                Découvrir les offres
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Mes candidatures</h2>
                <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                  {postulations.length} candidature{postulations.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postulations.map((postulation) => (
                  <div
                    key={postulation.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {postulation.offre.titre}
                        </h2>
                      </div>
                      <div className="ml-3">
                        <span className="text-2xl">💼</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {postulation.offre.description}
                    </p>

                    {/* Détails de l'offre */}
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600 flex items-center justify-between">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{postulation.offre.domaine}</span>
                        <span>📍 {postulation.offre.lieu}</span>
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {postulation.offre.typeContrat}
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {postulation.offre.salaire}€
                        </span>
                      </div>
                    </div>

                    {/* Date de candidature */}
                    <p className="text-sm text-gray-500 mb-4 flex items-center">
                      <span className="mr-2">📅</span>
                      Postulé le : {new Date(postulation.createdAt).toLocaleDateString()}
                    </p>

                    {/* Statut avec badge coloré */}
                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-medium ${
                          postulation.status === "ACCEPTE"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : postulation.status === "REFUSE"
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : postulation.status === "RETENUE"
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : postulation.status === "ENTRETIEN"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                            : "bg-gradient-to-r from-gray-400 to-gray-500"
                        }`}
                      >
                        <span className="mr-2">
                          {postulation.status === "ACCEPTE" ? "✅" :
                           postulation.status === "REFUSE" ? "❌" :
                           postulation.status === "RETENUE" ? "⭐" :
                           postulation.status === "ENTRETIEN" ? "🎯" : "⏳"}
                        </span>
                        {postulation.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
