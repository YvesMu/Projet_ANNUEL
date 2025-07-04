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

              {/* Rôle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type de profil</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none bg-no-repeat bg-right-3 bg-[length:16px] cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                  }}
                >
                  <option value="particulier">🧑‍💼 Particulier - Recherche d'emploi</option>
                  <option value="professionnel">🏢 Professionnel - Recruteur</option>
                </select>
              </div>

              {/* Domaine et Type d'offre côte à côte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Domaine de spécialisation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Domaine d'expertise</label>
                  <select
                    name="domaine"
                    value={form.domaine}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none bg-no-repeat bg-right-3 bg-[length:16px] cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                    }}
                    required
                  >
                    <option value="">Sélectionnez votre domaine</option>
                    <option value="Développement">💻 Développement / Informatique</option>
                    <option value="Design">🎨 Design / Graphisme</option>
                    <option value="Marketing">📱 Marketing / Communication</option>
                    <option value="Ressources Humaines">👥 Ressources Humaines</option>
                    <option value="Finance">💰 Finance / Comptabilité</option>
                    <option value="Commercial">🤝 Commercial / Ventes</option>
                    <option value="Juridique">⚖️ Juridique</option>
                    <option value="Santé">🏥 Santé / Médical</option>
                    <option value="Éducation">📚 Éducation / Formation</option>
                    <option value="Ingénierie">⚙️ Ingénierie</option>
                    <option value="Production">🚚 Production / Logistique</option>
                    <option value="Autre">🔧 Autre</option>
                  </select>
                </div>

                {/* Type d'offre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type recherché</label>
                  <select
                    name="typeOffre"
                    value={form.typeOffre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none bg-no-repeat bg-right-3 bg-[length:16px] cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                    }}
                  >
                    <option value="emploi">💼 Emploi</option>
                    <option value="stage">🎓 Stage</option>
                    <option value="freelance">💡 Freelance</option>
                    <option value="alternance">🔄 Alternance</option>
                  </select>
                </div>
              </div>

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
          <div className="mt-8">
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-6">
              Pourquoi nous rejoindre ?
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="group text-center transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">✨</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">100% Gratuit</h4>
                <p className="text-xs text-gray-600">Inscription et utilisation gratuites</p>
              </div>
              
              <div className="group text-center transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Sécurisé</h4>
                <p className="text-xs text-gray-600">Vos données sont protégées</p>
              </div>
              
              <div className="group text-center transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Instantané</h4>
                <p className="text-xs text-gray-600">Accès immédiat après inscription</p>
              </div>
            </div>
            
            {/* Statistiques supplémentaires */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">25K+</div>
                  <div className="text-xs text-gray-600">Offres disponibles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">15K+</div>
                  <div className="text-xs text-gray-600">Entreprises partenaires</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                  <div className="text-xs text-gray-600">Taux de réussite</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
