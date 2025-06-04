"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

interface Postulation {
  id: number;
  candidat: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
  };
  offre: {
    id: number;
    titre: string;
  };
  statut: "EN_ATTENTE" | "EN_COURS" | "ACCEPTE" | "REFUSE" | "ACCEPTE";
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

  const handleStatutChange = async (id: number, newStatut: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/postulations/${id}/statut`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: newStatut }),
      });
      if (!res.ok) throw new Error("Erreur serveur");

      setPostulations((prev) =>
        prev.map((p) => (p.id === id ? { ...p, statut: newStatut as Postulation["statut"] } : p))
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
              <div key={p.id} className="border p-4 rounded shadow bg-white">
                <p><b>Candidat :</b> {p.candidat.prenom} {p.candidat.nom} ({p.candidat.email})</p>
                <p><b>Offre :</b> {p.offre.titre}</p>
                <p><b>Statut :</b></p>
                <select
                  value={p.statut}
                  onChange={(e) => handleStatutChange(p.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="EN_ATTENTE">EN_ATTENTE</option>
                  <option value="ENTRETIEN">ENTRETIEN</option>
                  <option value="RETENUE">RETENUE</option>
                  <option value="REFUSE">REFUSE</option>
                  <option value="ACCEPTE">ACCEPTE</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
