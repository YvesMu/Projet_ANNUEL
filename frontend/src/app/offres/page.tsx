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

export default function OffresPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filtered, setFiltered] = useState<Offre[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier le rôle de l'utilisateur
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres`)
      .then(async (res) => {
        if (!res.ok) {
          console.error("Erreur HTTP:", res.status);
          return [];
        }
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Réponse inattendue:", data);
          return [];
        }

        return data;
      })
      .then((data) => {
        setOffres(data);
        setFiltered(data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des offres:", err);
        setOffres([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterOffres(value, selectedDomain);
  };

  const handleDomainFilter = (domain: string) => {
    setSelectedDomain(domain);
    filterOffres(search, domain);
  };

  const filterOffres = (searchTerm: string, domain: string) => {
    let filteredData = offres.filter(
      (offre) =>
        offre.titre.toLowerCase().includes(searchTerm) ||
        offre.domaine.toLowerCase().includes(searchTerm) ||
        offre.typeContrat.toLowerCase().includes(searchTerm) ||
        offre.lieu.toLowerCase().includes(searchTerm)
    );

    if (domain && domain !== "") {
      filteredData = filteredData.filter(
        (offre) => offre.domaine.toLowerCase() === domain.toLowerCase()
      );
    }

    setFiltered(filteredData);
  };

  const domains = [...new Set(offres.map((offre) => offre.domaine))];

  const getDomaineIcon = (domaine: string) => {
    const icons: { [key: string]: string } = {
      informatique: "💻",
      marketing: "📱",
      design: "🎨",
      finance: "💰",
      commercial: "🤝",
      rh: "👥",
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
              💼
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Toutes les offres
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les meilleures opportunités professionnelles et trouvez votre prochain emploi
            </p>
            
            {userRole === 'particulier' && (
              <div className="mt-8">
                <Link 
                  href="/offres/recommended"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <span className="mr-3 text-xl">✨</span>
                  Mes offres recommandées
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-blue-600 text-2xl">🔍</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Rechercher votre emploi idéal</h2>
            </div>
            
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Rechercher par titre, domaine, type de contrat ou lieu..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
            
            {domains.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Filtrer par domaine :</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleDomainFilter("")}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedDomain === ""
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous les domaines
                  </button>
                  {domains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => handleDomainFilter(domain)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
                        selectedDomain === domain
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-2">{getDomaineIcon(domain)}</span>
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💼</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement des offres...</h2>
              <p className="text-gray-600">Recherche des meilleures opportunités pour vous</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">🔍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {search ? 'Aucune offre trouvée' : 'Aucune offre disponible'}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {search 
                  ? 'Essayez avec des mots-clés différents ou supprimez les filtres' 
                  : 'Les nouvelles offres apparaîtront bientôt ici'
                }
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedDomain("");
                    setFiltered(offres);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">🔄</span>
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {filtered.length} offre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
                </h2>
                <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                  {search && `Recherche: "${search}"`}
                  {selectedDomain && ` • ${selectedDomain}`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((offre) => (
                  <Link key={offre.id} href={`/offres/${offre.id}`}>
                    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 p-8 transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                      
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{getDomaineIcon(offre.domaine)}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getContractColor(offre.typeContrat)} shadow-lg`}>
                          {offre.typeContrat}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                        {offre.titre}
                      </h2>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {offre.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-lg border border-blue-200">
                          📍 {offre.lieu}
                        </span>
                        <span className="bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-lg border border-purple-200">
                          🏢 {offre.domaine}
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
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
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
