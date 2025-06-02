"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function OffreDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [offre, setOffre] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/offres/${id}`)
      .then((res) => res.json())
      .then((data) => setOffre(data))
      .catch(() => alert("Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!offre) return <p>Offre non trouvée</p>;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{offre.titre}</h1>
        <p>{offre.description}</p>
        <p>{offre.domaine} | {offre.typeContrat} | {offre.lieu}</p>
        <p>{offre.salaire}€</p>

        <button
          onClick={() => alert("🚧 Ici on ajoutera la postulation")}
          className="mt-4 bg-green-600 text-white p-2 rounded"
        >
          Postuler
        </button>
      </main>
    </>
  );
}
