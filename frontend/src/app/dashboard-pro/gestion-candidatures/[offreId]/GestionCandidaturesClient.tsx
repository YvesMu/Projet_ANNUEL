"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  cvUrl?: string;
  photoUrl?: string;
  presentation?: string;
}

interface Postulation {
  id: number;
  candidat: Candidat;
}

interface Offre {
  id: number;
  titre: string;
  postulations: Postulation[];
}

export default function GestionCandidaturesClient() {
  const router = useRouter();
  const params = useParams();
  const { offreId } = params;

  const [offre, setOffre] = useState<Offre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/${offreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setOffre(data);
      } catch (err) {
        console.error("Erreur chargement offre :", err);
        alert("Erreur lors du chargement de l'offre.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, offreId]);

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
              Gestion des candidatures
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez et évaluez les candidats qui ont postulé à votre offre
            </p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement des candidatures...</h2>
              <p className="text-gray-600">Récupération des données de l&apos;offre</p>
            </div>
          ) : !offre ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">❌</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Offre non trouvée
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Cette offre n&apos;existe pas ou vous n&apos;avez pas l&apos;autorisation de la consulter
              </p>
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">←</span>
                Retour
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{offre.titre}</h2>
                    <p className="text-gray-600 text-lg">Gérez les candidatures reçues pour cette offre</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">
                      {offre.postulations?.length ?? 0}
                    </div>
                    <div className="text-gray-600 font-medium">
                      candidature{(offre.postulations?.length ?? 0) > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((offre.postulations?.length ?? 0) / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {offre.postulations?.length ?? 0} / 10+ candidatures reçues
                </p>
              </div>

              {offre.postulations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offre.postulations.map((postulation) => (
                    <div 
                      key={postulation.id} 
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center mb-4">
                        {postulation.candidat.photoUrl ? (
                          <img
                            src={postulation.candidat.photoUrl}
                            alt="Photo du candidat"
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 flex items-center justify-center text-purple-600 text-2xl font-bold shadow-lg">
                            {postulation.candidat.prenom.charAt(0)}{postulation.candidat.nom.charAt(0)}
                          </div>
                        )}
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                            {postulation.candidat.prenom} {postulation.candidat.nom}
                          </h3>
                          <p className="text-gray-600 flex items-center">
                            <span className="mr-2">📧</span>
                            {postulation.candidat.email}
                          </p>
                        </div>
                      </div>

                      {postulation.candidat.presentation && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-gray-700 italic leading-relaxed line-clamp-3">
                            &quot;{postulation.candidat.presentation}&quot;
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {postulation.candidat.cvUrl && (
                          <a
                            href={postulation.candidat.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                          >
                            <span className="mr-2">📄</span>
                            Voir CV
                          </a>
                        )}
                        
                        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                          <span className="mr-2">💬</span>
                          Contact
                        </button>
                      </div>

                      <div className="mt-4 flex justify-center space-x-2">
                        <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-300 font-medium">
                          ✅ Accepter
                        </button>
                        <button className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-300 font-medium">
                          🎯 Entretien
                        </button>
                        <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300 font-medium">
                          ❌ Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-8xl mb-8">📭</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Aucune candidature pour le moment
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Les candidatures apparaîtront ici dès qu&apos;un candidat postulera à cette offre
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => router.push('/dashboard-pro')}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="mr-2">📊</span>
                      Tableau de bord
                    </button>
                    <button 
                      onClick={() => router.push('/dashboard-pro/mes-offres')}
                      className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-200"
                    >
                      <span className="mr-2">📋</span>
                      Mes offres
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
