"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

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

export default function DashboardPro() {
  const router = useRouter();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour accéder au dashboard.");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/offres/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Votre session a expiré, veuillez vous reconnecter.");
            localStorage.removeItem("token");
            router.push("/login");
          } else {
            throw new Error("Erreur serveur");
          }
          return;
        }

        const data = await response.json();
        setOffres(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
        alert("Erreur lors du chargement des offres.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mon Dashboard Pro</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : offres.length === 0 ? (
          <p>Aucune offre pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offres.map((offre) => (
              <div key={offre.id} className="border rounded shadow p-4">
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
            ))}
          </div>
        )}
      </main>
    </>
  );
}
