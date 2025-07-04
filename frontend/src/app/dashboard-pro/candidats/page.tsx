"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  cvUrl?: string;
  presentation?: string;
  offreTitre: string;
}

export default function CandidatsList() {
  const [candidats, setCandidats] = useState<Candidat[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/candidats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setCandidats);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👥
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Liste des Candidats
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les candidats qui ont postulé à vos offres d&apos;emploi
            </p>
          </div>

          {candidats.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">👤</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Aucun candidat pour le moment
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Les candidats apparaîtront ici dès qu&apos;ils postuleront à vos offres
              </p>
              <a 
                href="/dashboard-pro"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">📊</span>
                Tableau de bord
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Tous les candidats</h2>
                <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                  {candidats.length} candidat{candidats.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidats.map(c => (
                  <div
                    key={c.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-lg mr-4">
                        {c.prenom.charAt(0)}{c.nom.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {c.prenom} {c.nom}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <span className="mr-2">📧</span>
                          {c.email}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                      <p className="text-blue-800 font-medium flex items-center">
                        <span className="mr-2">💼</span>
                        Postulé sur : <span className="ml-2 font-bold">{c.offreTitre}</span>
                      </p>
                    </div>

                    {c.presentation && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-700 italic leading-relaxed line-clamp-3">
                          &quot;{c.presentation}&quot;
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {c.cvUrl && (
                        <a
                          href={c.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                        >
                          <span className="mr-2">📄</span>
                          Voir CV
                        </a>
                      )}
                      
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                        <span className="mr-2">💬</span>
                        Contact
                      </button>
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
