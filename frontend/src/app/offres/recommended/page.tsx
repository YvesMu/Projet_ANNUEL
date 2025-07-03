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

interface RecommendedOffersResponse {
  recommendedOffers: Offre[];
  otherOffers: Offre[];
}

export default function RecommendedOffersPage() {
  const [recommendedOffers, setRecommendedOffers] = useState<Offre[]>([]);
  const [otherOffers, setOtherOffers] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour voir les offres recommandées");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/recommended`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Cette fonctionnalité est réservée aux particuliers");
          }
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data: RecommendedOffersResponse) => {
        setRecommendedOffers(data.recommendedOffers || []);
        setOtherOffers(data.otherOffers || []);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des offres recommandées:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const OffreCard = ({ offre }: { offre: Offre }) => (
    <Link key={offre.id} href={`/offres/${offre.id}`}>
      <div className="border rounded shadow p-4 hover:bg-gray-100 cursor-pointer">
        <h2 className="text-xl font-semibold">{offre.titre}</h2>
        <p className="mt-2">{offre.description}</p>
        <p className="mt-1 text-sm text-gray-600">
          {offre.domaine} | {offre.typeContrat} | {offre.lieu}
        </p>
        <p className="mt-1 font-bold text-green-600">{offre.salaire}€</p>
        <p className="mt-1 text-sm text-gray-500">
          Publié le : {new Date(offre.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <div className="mb-6">
          <Link 
            href="/offres"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Retour à toutes les offres
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Offres recommandées pour vous</h1>
            <Link 
              href="/offres/my-domain"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              🎯 Mon domaine uniquement
            </Link>
          </div>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Offres recommandées (même domaine) */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold">Recommandées pour vous</h2>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {recommendedOffers.length} offre{recommendedOffers.length > 1 ? 's' : ''}
                </span>
              </div>
              
              {recommendedOffers.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                  Aucune offre trouvée dans votre domaine pour le moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedOffers.map((offre) => (
                    <OffreCard key={offre.id} offre={offre} />
                  ))}
                </div>
              )}
            </section>

            {/* Autres offres */}
            <section>
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Autres offres</h2>
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {otherOffers.length} offre{otherOffers.length > 1 ? 's' : ''}
                </span>
              </div>
              
              {otherOffers.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded">
                  Aucune autre offre disponible.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherOffers.map((offre) => (
                    <OffreCard key={offre.id} offre={offre} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
