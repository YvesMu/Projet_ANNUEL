"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  photoUrl?: string;
}

interface Offre {
  id: number;
  titre: string;
}

type Status = "EN_ATTENTE" | "ENTRETIEN" | "RETENUE" | "REFUSE" | "ACCEPTE";

interface Postulation {
  id: number;
  candidat: Candidat;
  offre: Offre;
  status: Status;
}

export default function GestionCandidats() {
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchPostulations = async () => {
      try {
        const res = await fetch("http://localhost:5000/postulations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setPostulations(data);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des candidatures.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulations();
  }, []);

  const handleStatutChange = async (id: number, newStatut: Status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/postulations/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatut }),
      });
      if (!res.ok) throw new Error("Erreur serveur");

      setPostulations((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatut } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Gestion des Candidatures</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            {postulations.map((p) => (
              <div key={p.id} className="border p-4 rounded shadow bg-white flex gap-4 items-center">
                {p.candidat.photoUrl && (
                  <img
                    src={p.candidat.photoUrl}
                    alt="photo"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                )}
                <div className="flex-1">
                  <p><b>Candidat :</b> {p.candidat?.prenom} {p.candidat?.nom} ({p.candidat?.email})</p>
                  <p><b>Offre :</b> {p.offre?.titre}</p>
                  <p><b>Statut :</b></p>
                  <select
                    value={p.status}
                    onChange={(e) => handleStatutChange(p.id, e.target.value as Status)}
                    className="border rounded p-1"
                  >
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="ENTRETIEN">Entretien</option>
                    <option value="RETENUE">Retenue</option>
                    <option value="REFUSE">Refusé</option>
                    <option value="ACCEPTE">Accepté</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
