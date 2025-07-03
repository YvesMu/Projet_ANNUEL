"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EditOfferPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params?.id;

  const [form, setForm] = useState({
    titre: "",
    description: "",
    domaine: "",
    typeContrat: "",
    lieu: "",
    salaire: "",
  });

  useEffect(() => {
    if (!offerId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/${offerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          titre: data.titre,
          description: data.description,
          domaine: data.domaine,
          typeContrat: data.typeContrat,
          lieu: data.lieu,
          salaire: data.salaire,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur lors du chargement de l'offre");
        router.push("/dashboard-pro");
      });
  }, [offerId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/${offerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      alert("Offre modifiée avec succès !");
      router.push("/dashboard-pro");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-600 rounded-full animate-pulse opacity-20"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl">
                ✏️
              </div>
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent mb-6 leading-tight">
              Modifier l&apos;offre
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Mettez à jour les informations de votre offre d&apos;emploi pour attirer les meilleurs candidats
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-100/50 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-500"></div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-orange-700 font-bold text-lg">📝</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Informations de l&apos;offre</h2>
                    <p className="text-gray-600 mt-1">Modifiez les détails de votre offre d&apos;emploi</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Titre du poste *
                  </label>
                  <input
                    name="titre"
                    type="text"
                    placeholder="Ex: Développeur Full Stack Senior"
                    value={form.titre}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Description du poste *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Décrivez les missions, responsabilités et ce que vous recherchez chez le candidat idéal..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-purple-700 font-bold text-lg">⚙️</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Détails du poste</h2>
                    <p className="text-gray-600 mt-1">Spécifiez les caractéristiques du poste</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Domaine *
                    </label>
                    <select
                      name="domaine"
                      value={form.domaine}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
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

                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Type de contrat *
                    </label>
                    <select
                      name="typeContrat"
                      value={form.typeContrat}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
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
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Lieu de travail *
                    </label>
                    <input
                      name="lieu"
                      type="text"
                      placeholder="Ex: Paris, Lyon, Remote..."
                      value={form.lieu}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
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
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>
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
                  className="flex-1 px-10 py-5 bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600 text-white font-bold rounded-2xl hover:from-orange-700 hover:via-yellow-700 hover:to-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
                >
                  <span className="mr-3 text-xl">💾</span>
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 border-2 border-orange-100/50 shadow-xl">
            <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl">💡</span>
              Conseils pour optimiser votre offre
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4 text-orange-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Mettez à jour le salaire selon le marché actuel</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Ajustez les compétences selon vos besoins</span>
                </li>
              </ul>
              <ul className="space-y-4 text-orange-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Précisez les évolutions possibles du poste</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-green-600 font-bold">✓</span>
                  <span className="font-medium">Mentionnez les nouveaux avantages</span>
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
