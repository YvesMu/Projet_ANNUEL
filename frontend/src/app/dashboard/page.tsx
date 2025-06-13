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
  status: "EN_ATTENTE" | "ENTRETIEN" | "RETENUE" | "REFUSE" | "ACCEPTE";
}

export default function Dashboard() {
  const router = useRouter();
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [, setRole] = useState<string | null>(null);
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

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/postulations/my`, {
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
        <h1 className="text-3xl font-bold mb-4">Mon Espace Candidat</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : postulations.length === 0 ? (
          <p>Tu n&lsquo;as pas encore postulé à des offres.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postulations.map((postulation) => (
              <div key={postulation.id} className="border rounded shadow p-4 bg-white">
                <h2 className="text-xl font-semibold mb-2">{postulation.offre.titre}</h2>
                <p>{postulation.offre.description}</p>
                <p className="text-sm text-gray-600 mb-1">
                  {postulation.offre.domaine} | {postulation.offre.typeContrat} | {postulation.offre.lieu}
                </p>
                <p className="font-bold text-green-600 mb-1">{postulation.offre.salaire}€</p>
                <p className="text-sm text-gray-500 mb-3">
                  Postulé le : {new Date(postulation.createdAt).toLocaleDateString()}
                </p>

                {/* Affichage du statut avec badge coloré */}
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      postulation.status === "ACCEPTE"
                        ? "bg-green-500"
                        : postulation.status === "REFUSE"
                        ? "bg-red-500"
                        : postulation.status === "RETENUE"
                        ? "bg-yellow-400"
                        : postulation.status === "ENTRETIEN"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {postulation.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
