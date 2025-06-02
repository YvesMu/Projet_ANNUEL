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

interface Postulation {
  id: number;
  offre: Offre;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);

      if (payload.role === "professionnel") {
        router.push("/dashboard-pro");
        return;
      }

      // ⚠️ Ici on récupère réellement les candidatures côté candidat :
      fetch("http://localhost:5000/postulations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setPostulations(data))
        .catch((err) => console.error("Erreur lors du chargement des candidatures :", err))
        .finally(() => setLoading(false));

    } catch (err) {
      console.error("Erreur de décodage du token", err);
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          Mon Espace Candidat
        </h1>

        {loading ? (
          <p>Chargement...</p>
        ) : postulations.length === 0 ? (
          <p>Tu n'as pas encore postulé à des offres.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postulations.map((postulation) => (
              <div key={postulation.id} className="border rounded shadow p-4">
                <h2 className="text-xl font-semibold">{postulation.offre.titre}</h2>
                <p>{postulation.offre.description}</p>
                <p className="text-sm text-gray-600">
                  {postulation.offre.domaine} | {postulation.offre.typeContrat} | {postulation.offre.lieu}
                </p>
                <p className="font-bold text-green-600">{postulation.offre.salaire}€</p>
                <p className="text-sm text-gray-500">
                  Postulé le : {new Date(postulation.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
