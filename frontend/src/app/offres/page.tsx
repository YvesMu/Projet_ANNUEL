"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
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
    const filteredData = offres.filter(
      (offre) =>
        offre.titre.toLowerCase().includes(value) ||
        offre.domaine.toLowerCase().includes(value) ||
        offre.typeContrat.toLowerCase().includes(value) ||
        offre.lieu.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Toutes les offres</h1>
          
          {/* Bouton pour les offres recommandées (seulement pour les particuliers) */}
          {userRole === 'particulier' && (
            <Link 
              href="/offres/recommended"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              📌 Mes offres recommandées
            </Link>
          )}
        </div>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Rechercher par titre, domaine, type de contrat ou lieu..."
          className="border p-3 mb-6 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {search ? 'Aucune offre ne correspond à votre recherche.' : 'Aucune offre disponible pour le moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((offre) => (
              <Link key={offre.id} href={`/offres/${offre.id}`}>
                <div className="border rounded-lg shadow-md p-6 hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{offre.titre}</h2>
                  <p className="text-gray-600 mb-3 line-clamp-3">{offre.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {offre.domaine}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {offre.typeContrat}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {offre.lieu}
                    </span>
                  </div>
                  <p className="font-bold text-green-600 text-lg mb-2">{offre.salaire}€</p>
                  <p className="text-sm text-gray-500">
                    Publié le : {new Date(offre.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
