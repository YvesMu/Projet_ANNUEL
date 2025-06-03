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
  postulations: Postulation[];
}

interface Postulation {
  id: number;
  candidat: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    cvUrl?: string;
    photoUrl?: string;
    presentation?: string;
  };
}

export default function DashboardPro() {
  const router = useRouter();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    type JwtPayload = { role: string; [key: string]: unknown };
    let payload: JwtPayload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
      router.push("/login");
      return;
    }

    if (payload.role !== "professionnel") {
      router.push("/dashboard");
      return;
    }

    // ✅ ici on appelle le backend seulement si le token est bien décodé et le rôle correct
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/offres/my", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Backend Error :", res.status);
          throw new Error("Erreur serveur");
        }

        const data = await res.json();
        setOffres(data);
      } catch (err) {
        console.error("Erreur lors du chargement des offres :", err);
        alert("Erreur lors du chargement des offres.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mon Dashboard Pro</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : offres.length === 0 ? (
          <p>Aucune offre publiée pour l&lsquo;instant.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offres.map((offre) => (
              <div
                key={offre.id}
                className="border rounded shadow p-4 bg-white"
              >
                <h2 className="text-xl font-semibold mb-2">{offre.titre}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {offre.domaine} | {offre.typeContrat} | {offre.lieu}
                </p>
                <p className="font-bold text-green-600 mb-2">{offre.salaire}€</p>

                <div className="flex gap-2 mb-2">
                  <button
                    className="bg-yellow-400 text-white py-1 px-3 rounded"
                    onClick={() => alert("Bientôt : modification")}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(offre.id)}
                  >
                    Supprimer
                  </button>
                </div>

                <div className="mt-3">
                  <h3 className="font-semibold mb-1">
                    Candidatures : {offre.postulations?.length ?? 0}
                  </h3>

                  {offre.postulations?.length > 0 ? (
                    <ul className="space-y-2">
                      {offre.postulations.map((postulation) => (
                        <li
                          key={postulation.id}
                          className="border p-2 rounded bg-gray-50"
                        >
                          <p className="font-bold">
                            {postulation.candidat.prenom}{" "}
                            {postulation.candidat.nom}
                          </p>
                          <p>Email : {postulation.candidat.email}</p>
                          {postulation.candidat.cvUrl && (
                            <a
                              href={postulation.candidat.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Voir CV
                            </a>
                          )}
                          {postulation.candidat.presentation && (
                            <p className="mt-1 italic text-sm">
                              {postulation.candidat.presentation}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Aucun candidat pour le moment.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
