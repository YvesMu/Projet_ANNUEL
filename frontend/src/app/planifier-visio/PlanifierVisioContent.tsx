"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    const urldate = searchParams.get("date");
    return urldate ? urldate :"";
  });

  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [selectedCandidat, setSelectedCandidat] = useState<number | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Récupérer les candidats
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/candidats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCandidats(data))
      .catch((err) => console.error(err));

    // Récupérer les offres du professionnel
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOffres(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedCandidat || !selectedOffre || !scheduledAt) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-call/planifier`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidatId: selectedCandidat,
          offreId: selectedOffre,
          scheduledAt, // On envoie la date choisie
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création de la visio");
      alert("Visio planifiée !");
      router.push("/dashboard-pro");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Planifier une visio</h1>

        <div className="space-y-4">

          <div>
            <label className="font-semibold">Candidat :</label>
            <select
              className="border rounded p-2 w-full"
              value={selectedCandidat ?? ""}
              onChange={(e) => setSelectedCandidat(Number(e.target.value))}
            >
              <option value="">Sélectionner un candidat</option>
              {candidats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.prenom} {c.nom} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Offre :</label>
            <select
              className="border rounded p-2 w-full"
              value={selectedOffre ?? ""}
              onChange={(e) => setSelectedOffre(Number(e.target.value))}
            >
              <option value="">Sélectionner une offre</option>
              {offres.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Date & Heure :</label>
            <input
              type="datetime-local"
              className="border rounded p-2 w-full"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Planifier l'appel"}
          </button>
        </div>
      </main>
    </>
  );
}
