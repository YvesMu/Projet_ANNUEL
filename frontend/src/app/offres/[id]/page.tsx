"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

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

export default function OffreDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [offre, setOffre] = useState<Offre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/offres/${id}`)
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
      const res = await fetch("http://localhost:5000/postulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offreId: parseInt(id as string, 10) }), // ✅ conversion id en nombre
      });

      if (!res.ok) throw new Error("Erreur serveur");
      alert("Candidature envoyée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la postulation.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!offre) return <p>Offre introuvable.</p>;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{offre.titre}</h1>
        <p>{offre.description}</p>
        <p className="mt-2">{offre.domaine} | {offre.typeContrat} | {offre.lieu}</p>
        <p className="mt-2 font-bold text-green-600">{offre.salaire}€</p>
        <p className="mt-2 text-sm text-gray-500">Publié le : {new Date(offre.createdAt).toLocaleDateString()}</p>

        <button
          onClick={handlePostuler}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Postuler à cette offre
        </button>
      </main>
    </>
  );
}
