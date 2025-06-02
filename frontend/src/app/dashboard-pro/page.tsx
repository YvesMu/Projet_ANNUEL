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
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setTokenReady(true);

    fetch("http://localhost:5000/offres/my", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => setOffres(data))
      .catch((err) => {
        console.error(err);
        alert("Erreur lors du chargement des offres.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Confirmer la suppression de l'offre ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/offres/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur serveur");
      setOffres(offres.filter((offre) => offre.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/edit-offre/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/offres/${id}`);
  };

  if (!tokenReady) return null;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mon Dashboard Pro</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : offres.length === 0 ? (
          <p>Aucune offre publiée pour l'instant.</p>
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

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-600 text-white py-1 px-3 rounded"
                    onClick={() => handleView(offre.id)}
                  >
                    Voir
                  </button>
                  <button
                    className="bg-yellow-500 text-white py-1 px-3 rounded"
                    onClick={() => handleEdit(offre.id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(offre.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
