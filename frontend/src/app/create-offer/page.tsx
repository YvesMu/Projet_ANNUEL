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
    experience: "",
    niveauEtude: "",
    horaires: "",
    avantages: [],
    competences: [],
    dateDebut: "",
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

  const handleListInput = (field: 'avantages' | 'competences', value: string) => {
    if (!value.trim()) return;
    
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setForm({ ...form, [field]: items });
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
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full animate-pulse opacity-20"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl">
                ✨
              </div>
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 leading-tight">
              Créer une offre d&apos;emploi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Attirez les meilleurs talents en créant une offre d&apos;emploi détaillée et attractive
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100/50 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-green-700 font-bold text-lg">📝</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Informations générales</h2>
                    <p className="text-gray-600 mt-1">Décrivez votre offre d&apos;emploi en détail</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Titre du poste *
                  </label>
                  <input
                    name="titre"
                    placeholder="Ex: Développeur Full Stack Senior"
                    value={form.titre}
                    onChange={handleChange}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Description du poste *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Décrivez les missions, responsabilités et ce que vous recherchez chez le candidat idéal..."
                    value={form.description}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none shadow-sm hover:shadow-md"
                    required
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-blue-700 font-bold text-lg">⚙️</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Détails du poste</h2>
                    <p className="text-gray-600 mt-1">Spécifiez les caractéristiques techniques</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Domaine *
                    </label>
                    <select
                      name="domaine"
                      value={form.domaine}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      required
                    >
                      <option value="">Sélectionnez un domaine</option>
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
                      <option value="Autre">🔄 Autre</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Type de contrat *
                    </label>
                    <select
                      name="typeContrat"
                      value={form.typeContrat}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      required
                    >
                      <option value="">Type de contrat</option>
                      <option value="CDI">CDI - Contrat à Durée Indéterminée</option>
                      <option value="CDD">CDD - Contrat à Durée Déterminée</option>
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Temps partiel">Temps partiel</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Lieu de travail *
                    </label>
                    <input
                      name="lieu"
                      placeholder="Ex: Paris, Lyon, Remote..."
                      value={form.lieu}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      Salaire (en K€/an) *
                    </label>
                    <input
                      name="salaire"
                      placeholder="Ex: 45"
                      value={form.salaire}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Expérience requise
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    >
                      <option value="">Sélectionnez l&apos;expérience</option>
                      <option value="Débutant">🌱 Débutant (0-1 ans)</option>
                      <option value="Junior">🚀 Junior (1-3 ans)</option>
                      <option value="Confirmé">⭐ Confirmé (3-5 ans)</option>
                      <option value="Senior">🏆 Senior (5+ ans)</option>
                      <option value="Expert">👑 Expert (10+ ans)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Niveau d&apos;étude
                    </label>
                    <select
                      name="niveauEtude"
                      value={form.niveauEtude}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    >
                      <option value="">Niveau d&apos;étude requis</option>
                      <option value="Sans diplôme">Sans diplôme</option>
                      <option value="CAP/BEP">CAP/BEP</option>
                      <option value="Bac">🎓 Bac</option>
                      <option value="Bac+2">📘 Bac+2 (BTS/DUT)</option>
                      <option value="Bac+3">📗 Bac+3 (Licence)</option>
                      <option value="Bac+5">📕 Bac+5 (Master)</option>
                      <option value="Bac+8">🎖️ Bac+8 (Doctorat)</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Horaires de travail
                    </label>
                    <input
                      name="horaires"
                      placeholder="Ex: 35h/semaine, 9h-17h"
                      value={form.horaires}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                      Date de début
                    </label>
                    <input
                      name="dateDebut"
                      type="date"
                      value={form.dateDebut}
                      onChange={handleChange}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-purple-700 font-bold text-lg">⭐</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Avantages et compétences</h2>
                    <p className="text-gray-600 mt-1">Attirez les meilleurs candidats</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Avantages proposés (séparés par des virgules)
                  </label>
                  <input
                    placeholder="Ex: Télétravail, Tickets restaurant, Mutuelle, 13ème mois"
                    onChange={(e) => handleListInput('avantages', e.target.value)}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                  {form.avantages.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                      <p className="text-green-800 font-bold mb-2">✨ Avantages ajoutés :</p>
                      <div className="flex flex-wrap gap-2">
                        {form.avantages.map((avantage, index) => (
                          <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                            {avantage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Compétences requises (séparées par des virgules)
                  </label>
                  <input
                    placeholder="Ex: JavaScript, React, Node.js, TypeScript"
                    onChange={(e) => handleListInput('competences', e.target.value)}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                  {form.competences.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <p className="text-blue-800 font-bold mb-2">🎯 Compétences requises :</p>
                      <div className="flex flex-wrap gap-2">
                        {form.competences.map((competence, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                            {competence}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-10 py-5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200 shadow-lg hover:shadow-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
                >
                  <span className="mr-3 text-xl">🚀</span>
                  Publier l&apos;offre
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-100/50 shadow-xl">
            <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl">💡</span>
              Conseils pour une offre attractive
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4 text-green-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Décrivez clairement les missions quotidiennes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Mentionnez les perspectives d&apos;évolution</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Indiquez la culture d&apos;entreprise</span>
                </li>
              </ul>
              <ul className="space-y-4 text-green-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Soyez transparent sur le salaire</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Listez tous les avantages proposés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Précisez les outils et technologies utilisés</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
