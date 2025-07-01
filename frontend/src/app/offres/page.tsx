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
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("");

  useEffect(() => {
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
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Toutes les offres
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez {offres.length} opportunités professionnelles qui
              correspondent à vos ambitions
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Rechercher par titre, domaine, lieu..."
                  className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm pl-12"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </span>
              </div>
            </div>

            {/* Domain Filters */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDomainFilter("")}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedDomain === ""
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                }`}
              >
                Tous les domaines
              </button>
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleDomainFilter(domain)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedDomain === domain
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                  }`}
                >
                  <span>{getDomaineIcon(domain)}</span>
                  <span>{domain}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💼</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chargement des offres...
              </h2>
              <p className="text-gray-600">
                Recherche des meilleures opportunités pour vous
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold text-blue-600">
                    {filtered.length}
                  </span>{" "}
                  offre{filtered.length > 1 ? "s" : ""} trouvée
                  {filtered.length > 1 ? "s" : ""}
                  {search && <span> pour "{search}"</span>}
                  {selectedDomain && (
                    <span> dans le domaine "{selectedDomain}"</span>
                  )}
                </p>
              </div>

              {/* Offres Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((offre) => (
                  <Link key={offre.id} href={`/offres/${offre.id}`}>
                    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                            {offre.titre}
                          </h2>
                        </div>
                        <div className="ml-3">
                          <span className="text-2xl">
                            {getDomaineIcon(offre.domaine)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {offre.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 bg-gradient-to-r ${getContractColor(
                              offre.typeContrat
                            )} text-white text-sm font-medium rounded-full`}
                          >
                            {offre.typeContrat}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            📍 {offre.lieu}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {offre.domaine}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {offre.salaire}€
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          📅{" "}
                          {new Date(offre.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                          Voir détails →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {filtered.length === 0 && !loading && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-6">🔍</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Aucune offre trouvée
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Essayez de modifier vos critères de recherche ou explorez
                    d'autres domaines
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedDomain("");
                      setFiltered(offres);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Réinitialiser les filtres
                  </button>
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
