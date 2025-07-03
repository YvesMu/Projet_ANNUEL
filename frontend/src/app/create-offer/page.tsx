"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type OffreForm = {
  titre: string;
  description: string;
  domaine: string;
  typeContrat: string;
  lieu: string;
  salaire: string;
  experience: string;
  niveauEtude: string;
  horaires: string;
  avantages: string[];
  competences: string[];
  dateDebut: string;
};

export default function CreateOffer() {
  const router = useRouter();

  const [form, setForm] = useState<OffreForm>({
    titre: "",
    description: "",
    domaine: "",
    typeContrat: "",
    lieu: "",
    salaire: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offres`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        console.log("Erreur backend :", errData);
        throw new Error("Erreur serveur");
      }

      if (!response.ok) throw new Error("Erreur serveur");

      alert("Offre créée avec succès !");
      router.push("/");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création de l'offre.");
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Créer une offre</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
          <input
            name="titre"
            placeholder="Titre"
            value={form.titre}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
            rows={4}
          />

          {/* Sélecteur de domaine */}
          <select
            name="domaine"
            value={form.domaine}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Sélectionnez un domaine</option>
            <option value="Développement">Développement / Informatique</option>
            <option value="Design">Design / Graphisme</option>
            <option value="Marketing">Marketing / Communication</option>
            <option value="Ressources Humaines">Ressources Humaines</option>
            <option value="Finance">Finance / Comptabilité</option>
            <option value="Commercial">Commercial / Ventes</option>
            <option value="Juridique">Juridique</option>
            <option value="Santé">Santé / Médical</option>
            <option value="Éducation">Éducation / Formation</option>
            <option value="Ingénierie">Ingénierie</option>
            <option value="Production">Production / Logistique</option>
            <option value="Autre">Autre</option>
          </select>

          {/* Sélecteur de type de contrat */}
          <select
            name="typeContrat"
            value={form.typeContrat}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Type de contrat</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Alternance">Alternance</option>
            <option value="Freelance">Freelance</option>
            <option value="Temps partiel">Temps partiel</option>
          </select>

          <input
            name="lieu"
            placeholder="Lieu"
            value={form.lieu}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="salaire"
            placeholder="Salaire"
            value={form.salaire}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Publier l&apos;offre
          </button>
        </form>
      </main>
    </>
  );
}
