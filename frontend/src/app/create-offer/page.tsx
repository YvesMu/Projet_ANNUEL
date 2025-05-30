"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CreateOffer() {
  const router = useRouter();

  const [form, setForm] = useState({
    titre: "",
    description: "",
    domaine: "",
    typeContrat: "",
    lieu: "",
    salaire: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/offres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erreur serveur");

      alert("Offre créée avec succès !");
      router.push("/"); // Redirection après succès
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
          <input name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" rows={4} />
          <input name="domaine" placeholder="Domaine" value={form.domaine} onChange={handleChange} className="border p-2 rounded" />
          <input name="typeContrat" placeholder="Type de contrat" value={form.typeContrat} onChange={handleChange} className="border p-2 rounded" />
          <input name="lieu" placeholder="Lieu" value={form.lieu} onChange={handleChange} className="border p-2 rounded" />
          <input name="salaire" placeholder="Salaire" value={form.salaire} onChange={handleChange} className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Publier l&lsquo;offre
          </button>
        </form>
      </main>
    </>
  );
}
