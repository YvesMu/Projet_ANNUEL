"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type OffreForm = {
  titre: string;
  description: string;
  domaine: string;
  typeContrat: string;
  lieu: string;
  salaire: string;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.log("Erreur backend :", errData);
        throw new Error("Erreur serveur");
      }

      alert("Offre créée avec succès !");
      router.push("/dashboard-pro");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création de l'offre.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 py-16">
          {/* Header Section Enhanced */}
          <div className="text-center mb-16">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-40 animate-ping"></div>
              <div className="relative w-28 h-28 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl">
                ✨
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 leading-tight">
              Créer une nouvelle offre
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Partagez votre opportunité avec des candidats qualifiés et trouvez le talent idéal pour votre équipe
            </p>
            <div className="flex justify-center">
              <div className="w-32 h-2 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* Form Section Enhanced */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100/50 p-10 md:p-16 relative overflow-hidden">
            {/* Top Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="space-y-12 relative">
              {/* Section 1: Informations générales */}
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-5 shadow-lg border border-green-200">
                    <span className="text-green-700 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Informations générales</h2>
                    <p className="text-gray-600 mt-2 text-lg">Décrivez le poste et ses missions principales</p>
                  </div>
                </div>

                {/* Titre */}
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-4"></span>
                    Titre du poste *
                  </label>
                  <input
                    name="titre"
                    type="text"
                    placeholder="Ex: Développeur Full Stack Senior"
                    value={form.titre}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-4"></span>
                    Description du poste *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Décrivez les missions, responsabilités et ce que vous recherchez chez le candidat idéal..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white/90 backdrop-blur-sm resize-none shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>

              {/* Section 2: Détails du poste */}
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mr-5 shadow-lg border border-purple-200">
                    <span className="text-purple-700 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Détails du poste</h2>
                    <p className="text-gray-600 mt-2 text-lg">Spécifiez les caractéristiques du poste</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Domaine */}
                  <div className="space-y-4">
                    <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-4"></span>
                      Domaine *
                    </label>
                    <select
                      name="domaine"
                      value={form.domaine}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                    >
                      <option value="">Sélectionner un domaine</option>
                      <option value="Informatique">💻 Informatique</option>
                      <option value="Marketing">📱 Marketing</option>
                      <option value="Design">🎨 Design</option>
                      <option value="Finance">💰 Finance</option>
                      <option value="Commercial">🤝 Commercial</option>
                      <option value="RH">👥 Ressources Humaines</option>
                      <option value="Ingénierie">⚙️ Ingénierie</option>
                      <option value="Santé">🏥 Santé</option>
                      <option value="Éducation">📚 Éducation</option>
                      <option value="Logistique">🚚 Logistique</option>
                    </select>
                  </div>

                  {/* Type de contrat */}
                  <div className="space-y-4">
                    <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-4"></span>
                      Type de contrat *
                    </label>
                    <select
                      name="typeContrat"
                      value={form.typeContrat}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="CDI">CDI - Contrat à Durée Indéterminée</option>
                      <option value="CDD">CDD - Contrat à Durée Déterminée</option>
                      <option value="Stage">Stage</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Alternance">Alternance</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Lieu */}
                  <div className="space-y-4">
                    <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                      Lieu de travail *
                    </label>
                    <input
                      name="lieu"
                      type="text"
                      placeholder="Ex: Paris, Lyon, Remote..."
                      value={form.lieu}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                    />
                  </div>

                  {/* Salaire */}
                  <div className="space-y-4">
                    <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-4"></span>
                      Salaire (en K€/an) *
                    </label>
                    <input
                      name="salaire"
                      type="number"
                      placeholder="Ex: 45"
                      value={form.salaire}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Enhanced */}
              <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t-2 border-gradient-to-r from-gray-200 to-gray-300">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-10 py-6 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border-2 border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-10 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center text-lg"
                >
                  <span className="mr-3 text-2xl">✨</span>
                  Publier l&apos;offre
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section Enhanced */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-10 border-2 border-blue-200/50 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-blue-900 mb-8 flex items-center">
                <span className="mr-4 text-4xl">💡</span>
                Conseils pour une offre attractive
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start p-4 bg-white/60 rounded-2xl backdrop-blur-sm shadow-lg">
                    <span className="mr-4 mt-1 text-green-600 font-bold text-xl">✓</span>
                    <span className="font-semibold text-blue-900 text-lg">Soyez précis sur les missions et responsabilités</span>
                  </div>
                  <div className="flex items-start p-4 bg-white/60 rounded-2xl backdrop-blur-sm shadow-lg">
                    <span className="mr-4 mt-1 text-green-600 font-bold text-xl">✓</span>
                    <span className="font-semibold text-blue-900 text-lg">Mentionnez les compétences techniques requises</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start p-4 bg-white/60 rounded-2xl backdrop-blur-sm shadow-lg">
                    <span className="mr-4 mt-1 text-green-600 font-bold text-xl">✓</span>
                    <span className="font-semibold text-blue-900 text-lg">Indiquez les avantages et la culture d&apos;entreprise</span>
                  </div>
                  <div className="flex items-start p-4 bg-white/60 rounded-2xl backdrop-blur-sm shadow-lg">
                    <span className="mr-4 mt-1 text-green-600 font-bold text-xl">✓</span>
                    <span className="font-semibold text-blue-900 text-lg">Utilisez un langage inclusif et motivant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
