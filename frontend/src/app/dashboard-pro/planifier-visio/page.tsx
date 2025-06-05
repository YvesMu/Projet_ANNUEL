"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
}

interface Offre {
  id: number;
  titre: string;
}

export default function PlanifierVisio() {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [candidatId, setCandidatId] = useState<number | null>(null);
  const [offreId, setOffreId] = useState<number | null>(null);
  const [scheduledAt, setScheduledAt] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 🟢 Récupérer tous les candidats
    const fetchCandidats = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/candidats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCandidats(data);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des candidats.");
      }
    };

    // 🟢 Récupérer mes offres (en tant que professionnel)
    const fetchOffres = async () => {
      try {
        const res = await fetch("http://localhost:5000/offres/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOffres(data);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des offres.");
      }
    };

    fetchCandidats();
    fetchOffres();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !candidatId || !offreId || !scheduledAt) {
      alert("Tous les champs sont requis.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/video-call/schedule", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidatId,
          offreId,
          scheduledAt,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      alert("Appel vidéo planifié avec succès !");
      // Reset du formulaire
      setCandidatId(null);
      setOffreId(null);
      setScheduledAt("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la planification.");
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Planifier un appel vidéo</h1>

        <div className="space-y-4">

          {/* Sélection Candidat */}
          <div>
            <label className="block mb-1 font-semibold">Sélectionner un candidat :</label>
            <select
              className="border rounded p-2 w-full"
              value={candidatId ?? ""}
              onChange={(e) => setCandidatId(Number(e.target.value))}
            >
              <option value="">-- Choisir un candidat --</option>
              {candidats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.prenom} {c.nom} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Sélection Offre */}
          <div>
            <label className="block mb-1 font-semibold">Sélectionner une offre :</label>
            <select
              className="border rounded p-2 w-full"
              value={offreId ?? ""}
              onChange={(e) => setOffreId(Number(e.target.value))}
            >
              <option value="">-- Choisir une offre --</option>
              {offres.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titre}
                </option>
              ))}
            </select>
          </div>

          {/* Date et heure */}
          <div>
            <label className="block mb-1 font-semibold">Date et heure :</label>
            <input
              type="datetime-local"
              className="border rounded p-2 w-full"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          {/* Bouton submit */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            onClick={handleSubmit}
          >
            Planifier l&lsquo;appel vidéo
          </button>
        </div>
      </main>
    </>
  );
}
