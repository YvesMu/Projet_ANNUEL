"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function Dashboard() {
  const router = useRouter();
  const [offres, setOffres] = useState<Offre[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/offres/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOffres(data))
      .catch((err) => console.error(err));
  }, [router]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mes offres publiées</h1>

        {offres.length === 0 ? (
          <p>Aucune offre publiée pour l&lsquo;instant.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offres.map((offre) => (
              <div key={offre.id} className="border rounded shadow p-4">
                <h2 className="text-xl font-semibold">{offre.titre}</h2>
                <p>{offre.description}</p>
                <p className="text-sm text-gray-600">
                  {offre.domaine} | {offre.typeContrat} | {offre.lieu}
                </p>
                <p className="font-bold text-green-600">{offre.salaire}€</p>
                <p className="text-sm text-gray-500">
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
