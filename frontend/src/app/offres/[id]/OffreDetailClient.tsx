"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

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

export default function OffreDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const [offre, setOffre] = useState<Offre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/${id}`)
      .then((res) => res.json())
      .then((data) => setOffre(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostuler = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour postuler.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/postulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offreId: parseInt(id as string, 10) }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      alert("Candidature envoyée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la postulation.");
    }
  };

  const getDomaineIcon = (domaine: string) => {
    const icons: { [key: string]: string } = {
      informatique: "💻",
      développement: "💻",
      marketing: "📱",
      design: "🎨",
      finance: "💰",
      commercial: "🤝",
      rh: "👥",
      "ressources humaines": "👥",
      ingénierie: "⚙️",
      santé: "🏥",
      éducation: "📚",
      logistique: "🚚",
    };
    return icons[domaine.toLowerCase()] || "💼";
  };

  const getContractColor = (typeContrat: string) => {
    const colors: { [key: string]: string } = {
      CDI: "from-green-500 to-emerald-500",
      CDD: "from-blue-500 to-cyan-500",
      Stage: "from-purple-500 to-pink-500",
      Freelance: "from-orange-500 to-yellow-500",
      Alternance: "from-indigo-500 to-blue-500",
    };
    return colors[typeContrat] || "from-gray-500 to-slate-500";
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💼</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement de l&apos;offre...</h2>
            <p className="text-gray-600">Récupération des détails</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!offre) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="text-8xl mb-8">😕</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Offre introuvable</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Cette offre n&apos;existe pas ou a été supprimée.
            </p>
            <Link 
              href="/offres"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span className="mr-3 text-xl">🔍</span>
              Voir toutes les offres
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12">
            <Link 
              href="/offres"
              className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-blue-600 hover:text-blue-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 border border-blue-100"
            >
              <span className="mr-2 text-xl">←</span>
              Retour aux offres
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contenu principal */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <span className="text-3xl">{getDomaineIcon(offre.domaine)}</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{offre.titre}</h1>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-white font-bold bg-gradient-to-r ${getContractColor(offre.typeContrat)} shadow-lg`}>
                          {offre.typeContrat}
                        </span>
                        <span className="text-gray-600 font-medium">
                          📅 Publié le {new Date(offre.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        📋
                      </span>
                      Description du poste
                    </h2>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-lg">{offre.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-3">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white">
                          🏢
                        </span>
                        <h3 className="font-bold text-blue-900">Domaine</h3>
                      </div>
                      <p className="text-blue-800 font-medium">{offre.domaine}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center mb-3">
                        <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 text-white">
                          📍
                        </span>
                        <h3 className="font-bold text-green-900">Lieu</h3>
                      </div>
                      <p className="text-green-800 font-medium">{offre.lieu}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center mb-3">
                        <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3 text-white">
                          💰
                        </span>
                        <h3 className="font-bold text-purple-900">Salaire</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-800">{offre.salaire}€</p>
                      <p className="text-purple-600 text-sm">par an</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8 sticky top-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
                    🚀
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Postuler maintenant</h3>
                  <p className="text-gray-600">Ne laissez pas passer cette opportunité !</p>
                </div>

                <button
                  onClick={handlePostuler}
                  className="w-full py-5 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg mb-6"
                >
                  <span className="mr-3 text-xl">✨</span>
                  Postuler à cette offre
                </button>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">⏱️</span>
                      Processus rapide
                    </h4>
                    <p className="text-gray-600 text-sm">Candidature en 1 clic, réponse sous 48h</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">🔒</span>
                      Données sécurisées
                    </h4>
                    <p className="text-gray-600 text-sm">Vos informations sont protégées et confidentielles</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">📞</span>
                      Support disponible
                    </h4>
                    <p className="text-gray-600 text-sm">Notre équipe vous accompagne dans votre candidature</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Partager cette offre</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-xl transition-colors duration-300 font-medium">
                      📧 Email
                    </button>
                    <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl transition-colors duration-300 font-medium">
                      💬 WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section conseils */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100/50 shadow-xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl">💡</span>
              Conseils pour votre candidature
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                  <span className="font-medium">Personnalisez votre lettre de motivation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                  <span className="font-medium">Mettez en avant vos compétences pertinentes</span>
                </li>
              </ul>
              <ul className="space-y-4 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                  <span className="font-medium">Relisez votre CV avant l&apos;envoi</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                  <span className="font-medium">Préparez-vous aux questions d&apos;entretien</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
