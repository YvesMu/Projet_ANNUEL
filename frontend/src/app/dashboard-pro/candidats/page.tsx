"use client";

import { useEffect, useState } from "react";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  cvUrl?: string;
  presentation?: string;
  offreTitre: string;
}

export default function CandidatsList() {
  const [candidats, setCandidats] = useState<Candidat[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/offres/candidats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setCandidats);
  }, []);

  return (
    <div>
      <h1>Liste des Candidats</h1>
      <ul>
        {candidats.map(c => (
          <li key={c.id}>
            {c.prenom} {c.nom} - {c.email} (Postulé sur {c.offreTitre})
          </li>
        ))}
      </ul>
    </div>
  );
}
