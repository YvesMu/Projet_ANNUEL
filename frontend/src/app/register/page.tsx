"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function Register() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "particulier", // soit particulier, soit professionnel
    typeOffre: "emploi",
    domaine: "", // L'utilisateur doit choisir son domaine
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("Inscription réussie :", data);
      alert("Inscription réussie ! Vérifie ton mail pour confirmer ton compte.");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Inscription</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-80">
          <input
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Nouveau select pour choisir le rôle */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="particulier">Particulier</option>
            <option value="professionnel">Professionnel</option>
          </select>

          {/* Nouveau select pour choisir le domaine de spécialisation */}
          <select
            name="domaine"
            value={form.domaine}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Sélectionnez votre domaine</option>
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

          {/* Select pour le type d'offre */}
          <select
            name="typeOffre"
            value={form.typeOffre}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="emploi">Emploi</option>
            <option value="stage">Stage</option>
            <option value="freelance">Freelance</option>
            <option value="alternance">Alternance</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            S&apos;inscrire
          </button>
        </form>
      </main>
    </>
  );
}
