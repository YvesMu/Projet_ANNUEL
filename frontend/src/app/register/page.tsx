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
    domaine: "informatique",
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
