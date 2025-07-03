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
      setUserDomain(payload.domaine);
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/my-domain`, {
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
      .then((data: Offre[]) => {
        setOffres(data || []);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des offres:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-3xl font-bold">
            Offres en {userDomain}
          </h1>
          <p className="text-gray-600 mt-2">
            Toutes les offres correspondant à votre domaine d&apos;expertise
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : offres.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-8 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Aucune offre dans votre domaine</h3>
              <p>Il n&apos;y a actuellement aucune offre disponible en {userDomain}.</p>
              <p className="mt-2">Revenez plus tard ou consultez toutes les offres.</p>
              <Link 
                href="/offres"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Voir toutes les offres
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                {offres.length} offre{offres.length > 1 ? 's' : ''} trouvée{offres.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offres.map((offre) => (
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
          </>
        )}
      </main>
    </>
  );
}
