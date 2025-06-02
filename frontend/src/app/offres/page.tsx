"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

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

export default function OffresPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filtered, setFiltered] = useState<Offre[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/offres")
      .then((res) => res.json())
      .then((data) => {
        setOffres(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Erreur lors de la récupération des offres:", err));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = offres.filter(
      (offre) =>
        offre.titre.toLowerCase().includes(value) ||
        offre.domaine.toLowerCase().includes(value) ||
        offre.typeContrat.toLowerCase().includes(value) ||
        offre.lieu.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Toutes les offres</h1>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Rechercher une offre..."
          className="border p-2 mb-4 w-full rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((offre) => (
            <Link key={offre.id} href={`/offres/${offre.id}`}>
              <div className="border rounded shadow p-4 hover:bg-gray-100 cursor-pointer">
                <h2 className="text-xl font-semibold">{offre.titre}</h2>
                <p className="mt-2">{offre.description}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {offre.domaine} | {offre.typeContrat} | {offre.lieu}
                </p>
                <p className="mt-1 font-bold text-green-600">{offre.salaire}€</p>
                <p className="mt-1 text-sm text-gray-500">
                  Publié le : {new Date(offre.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
