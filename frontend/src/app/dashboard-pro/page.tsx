"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

interface Offre {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  typeContrat: string;
  lieu: string;
  salaire: string;
  createdAt: string;
  postulations: Postulation[];
}

interface Postulation {
  id: number;
  candidat: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    cvUrl?: string;
    photoUrl?: string;
    presentation?: string;
  };
}

export default function DashboardPro() {
  const router = useRouter();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    type JwtPayload = { role: string; [key: string]: unknown };
    let payload: JwtPayload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
      router.push("/login");
      return;
    }

    if (payload.role !== "professionnel") {
      router.push("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Backend Error :", res.status);
          throw new Error("Erreur serveur");
        }

        const data = await res.json();
        setOffres(data);
      } catch (err) {
        console.error("Erreur lors du chargement des offres :", err);
        alert("Erreur lors du chargement des offres.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Confirmer la suppression de l'offre ?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur serveur");
      setOffres(offres.filter((offre) => offre.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👨‍💼
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Dashboard Professionnel
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gérez vos offres d&apos;emploi et suivez les candidatures reçues
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Mes offres d&apos;emploi</h2>
            <div className="flex gap-4">
              <button
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => router.push("/create-offer")}
              >
                <span className="mr-2">✨</span>
                Créer une offre
              </button>
              <button
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => router.push("/dashboard-pro/gestion-candidats")}
              >
                <span className="mr-2">👥</span>
                Gérer les candidats
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Chargement de vos offres...</h3>
              <p className="text-gray-600">Récupération des données</p>
            </div>
          ) : offres.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">💼</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Aucune offre publiée pour l&apos;instant
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Commencez par créer votre première offre d&apos;emploi pour attirer des talents
              </p>
              <button
                onClick={() => router.push("/create-offer")}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">✨</span>
                Créer ma première offre
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {offres.map((offre) => (
                <div
                  key={offre.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 hover:border-gray-200 p-8 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-2">
                        {offre.titre}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {offre.domaine}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {offre.typeContrat}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          📍 {offre.lieu}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {offre.salaire}€ / an
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">
                        {offre.postulations?.length ?? 0}
                      </div>
                      <div className="text-gray-600 font-medium text-sm">
                        candidature{(offre.postulations?.length ?? 0) > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <Link href={`/dashboard-pro/edit-offer/${offre.id}`}>
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                        <span className="mr-2">✏️</span>
                        Modifier
                      </button>
                    </Link>

                    <button
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                      onClick={() => handleDelete(offre.id)}
                    >
                      <span className="mr-2">🗑️</span>
                      Supprimer
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        Candidatures reçues
                      </h4>
                      <Link href={`/dashboard-pro/gestion-candidatures/${offre.id}`}>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
                          <span className="mr-2">⚙️</span>
                          Gérer
                        </button>
                      </Link>
                    </div>

                    {offre.postulations?.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {offre.postulations.map((postulation) => (
                          <div
                            key={postulation.id}
                            className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-start gap-3">
                              {postulation.candidat.photoUrl ? (
                                <img
                                  src={postulation.candidat.photoUrl}
                                  alt="Photo candidat"
                                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 flex items-center justify-center text-purple-600 font-bold">
                                  {postulation.candidat.prenom.charAt(0)}{postulation.candidat.nom.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-bold text-gray-900">
                                  {postulation.candidat.prenom} {postulation.candidat.nom}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center">
                                  <span className="mr-2">📧</span>
                                  {postulation.candidat.email}
                                </p>
                                {postulation.candidat.presentation && (
                                  <p className="mt-2 text-sm text-gray-700 italic bg-gray-50 p-2 rounded-lg">
                                    &quot;{postulation.candidat.presentation}&quot;
                                  </p>
                                )}
                                {postulation.candidat.cvUrl && (
                                  <a
                                    href={postulation.candidat.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center mt-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                                  >
                                    <span className="mr-1">📄</span>
                                    Voir CV
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-gray-500 font-medium">
                          Aucun candidat pour le moment
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
