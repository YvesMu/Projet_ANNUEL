"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card principale */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8">
            {/* Header de la card */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Inscription
              </h1>
              <p className="text-gray-600 text-lg">
                Rejoignez notre plateforme professionnelle
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Prénom et Nom sur la même ligne */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    name="prenom"
                    placeholder="Votre prénom"
                    value={form.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom</label>
                  <input
                    name="nom"
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Mot de passe sécurisé"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

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

              {/* Bouton d'inscription */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-8"
              >
                Créer mon compte
              </button>
            </form>

            {/* Lien vers la connexion */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {/* Avantages de l'inscription */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  ✨
                </div>
                <span>Gratuit</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  🔒
                </div>
                <span>Sécurisé</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  ⚡
                </div>
                <span>Rapide</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
