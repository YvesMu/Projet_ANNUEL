"use client";
export const dynamic = "force-dynamic";

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

export default function MyDomainOffersPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDomain, setUserDomain] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour voir cette page");
      setLoading(false);
      return;
    }

    // Décoder le token pour récupérer le domaine de l'utilisateur
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Payload décodé:", payload); // Debug
      
      // Vérifier le rôle utilisateur
      if (payload.role !== 'particulier') {
        setError("Cette fonctionnalité est réservée aux utilisateurs particuliers. Les professionnels peuvent gérer leurs offres via la section 'Mes offres'.");
        setLoading(false);
        return;
      }
      
      setUserDomain(payload.domaine || "");
      
      // Vérifier si l'utilisateur a un domaine
      if (!payload.domaine) {
        setError("Votre profil ne contient pas d'information sur votre domaine d'expertise. Veuillez compléter votre profil.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      setError("Session invalide - Veuillez vous reconnecter");
      setLoading(false);
      return;
    }

    console.log("Appel API vers:", `${process.env.NEXT_PUBLIC_API_URL}/offres/my-domain`); // Debug
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/my-domain`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        console.log("Réponse API:", res.status, res.statusText); // Debug
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Erreur API détaillée:", errorText); // Debug
          
          if (res.status === 403) {
            throw new Error("Cette fonctionnalité est réservée aux particuliers");
          }
          if (res.status === 400) {
            throw new Error("Requête invalide - Vérifiez vos informations de profil");
          }
          if (res.status === 401) {
            throw new Error("Session expirée - Veuillez vous reconnecter");
          }
          throw new Error(`Erreur HTTP: ${res.status} - ${errorText}`);
        }
        return res.json();
      })
      .then((data: Offre[]) => {
        setOffres(data || []);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des offres:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDomaineIcon = (domaine: string) => {
    if (!domaine) return "💼";
    
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
    if (!typeContrat) return "from-gray-500 to-slate-500";
    
    const colors: { [key: string]: string } = {
      CDI: "from-green-500 to-emerald-500",
      CDD: "from-blue-500 to-cyan-500",
      Stage: "from-purple-500 to-pink-500",
      Freelance: "from-orange-500 to-yellow-500",
      Alternance: "from-indigo-500 to-blue-500",
    };
    return colors[typeContrat] || "from-gray-500 to-slate-500";
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12">
            <Link 
              href="/offres"
              className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-purple-600 hover:text-purple-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 border border-purple-100"
            >
              <span className="mr-2 text-xl">←</span>
              Retour à toutes les offres
            </Link>
            
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
                {getDomaineIcon(userDomain)}
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Offres en {userDomain}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez toutes les opportunités spécialement sélectionnées dans votre domaine d&apos;expertise
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🎯</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recherche d&apos;offres personnalisées...</h2>
              <p className="text-gray-600">Analyse des opportunités dans votre domaine</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    ⚠️
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-red-800 text-center mb-4">Erreur</h3>
                <p className="text-red-700 text-center text-lg">{error}</p>
                <div className="text-center mt-6">
                  <Link 
                    href="/offres"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-2">🔄</span>
                    Voir toutes les offres
                  </Link>
                </div>
              </div>
            </div>
          ) : offres.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Aucune offre dans votre domaine
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                Il n&apos;y a actuellement aucune offre disponible en <span className="font-bold text-purple-600">{userDomain}</span>.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                Revenez plus tard ou consultez toutes les offres disponibles.
              </p>
              <Link 
                href="/offres"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span className="mr-3 text-xl">🔍</span>
                Voir toutes les offres
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Offres recommandées pour vous
                </h2>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-3 rounded-2xl border border-purple-200 shadow-lg">
                  <span className="text-purple-800 font-bold text-lg">
                    🎯 {offres.length} offre{offres.length > 1 ? 's' : ''} trouvée{offres.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offres.map((offre) => (
                  <Link key={offre.id} href={`/offres/${offre.id}`}>
                    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 p-8 transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold">⭐</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{getDomaineIcon(offre.domaine)}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getContractColor(offre.typeContrat)} shadow-lg`}>
                          {offre.typeContrat}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                        {offre.titre}
                      </h2>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {offre.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-lg border border-purple-200">
                          🏢 {offre.domaine}
                        </span>
                        <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-lg border border-blue-200">
                          📍 {offre.lieu}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-green-600 mb-1">
                            {offre.salaire}€
                          </p>
                          <p className="text-sm text-gray-500">
                            📅 {new Date(offre.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border-2 border-purple-100/50 shadow-xl">
                <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
                  <span className="mr-3 text-3xl">💡</span>
                  Pourquoi ces offres vous correspondent ?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3 shadow-md">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <span className="font-bold text-purple-900">Domaine ciblé</span>
                    <span className="text-sm text-purple-700 mt-1 text-center">Correspond à votre expertise en {userDomain}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-3 shadow-md">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <span className="font-bold text-purple-900">Sélection smart</span>
                    <span className="text-sm text-purple-700 mt-1 text-center">Algorithme de matching avancé</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3 shadow-md">
                      <span className="text-2xl">📈</span>
                    </div>
                    <span className="font-bold text-purple-900">Opportunités</span>
                    <span className="text-sm text-purple-700 mt-1 text-center">Maximise vos chances de succès</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
