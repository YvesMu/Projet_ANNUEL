"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  cvUrl?: string;
  photoUrl?: string;
  presentation?: string;
}

interface Postulation {
  id: number;
  candidat: Candidat;
}

interface Offre {
  id: number;
  titre: string;
  postulations: Postulation[];
}

export default function GestionCandidaturesClient() {
  const router = useRouter();
  const params = useParams();
  const { offreId } = params;

  const [offre, setOffre] = useState<Offre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/offres/${offreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setOffre(data);
      } catch (err) {
        console.error("Erreur chargement offre :", err);
        alert("Erreur lors du chargement de l'offre.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, offreId]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Gestion des candidatures</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : !offre ? (
          <p>Offre non trouvée</p>
        ) : (
          <>
            <h2 className="text-xl mb-2 font-semibold">{offre.titre}</h2>
            <h3 className="font-semibold mb-4">
              Nombre de candidatures : {offre.postulations?.length ?? 0}
            </h3>

            {offre.postulations?.length > 0 ? (
              <ul className="space-y-4">
                {offre.postulations.map((postulation) => (
                  <li key={postulation.id} className="border p-4 rounded bg-white shadow flex items-center gap-4">
                    {postulation.candidat.photoUrl ? (
                      <img
                        src={postulation.candidat.photoUrl}
                        alt="Photo du candidat"
                        className="w-20 h-20 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        Pas de photo
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg">
                        {postulation.candidat.prenom} {postulation.candidat.nom}
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
                        <p className="italic mt-2">{postulation.candidat.presentation}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune candidature pour cette offre.</p>
            )}
          </>
        )}
      </main>
    </>
  );
}
