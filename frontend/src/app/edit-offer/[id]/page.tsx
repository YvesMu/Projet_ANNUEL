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
    experience: "",
    niveauEtude: "",
    horaires: "",
    avantages: [] as string[],
    competences: [] as string[],
    dateDebut: "",
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
          experience: data.experience || "",
          niveauEtude: data.niveauEtude || "",
          horaires: data.horaires || "",
          avantages: data.avantages || [],
          competences: data.competences || [],
          dateDebut: data.dateDebut || "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur lors du chargement de l'offre");
        router.push("/dashboard-pro");
      });
  }, [offerId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (fieldName: 'avantages' | 'competences', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setForm({ ...form, [fieldName]: array });
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
              ✏️
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Modifier l&apos;offre
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mettez à jour les informations de votre offre d&apos;emploi pour attirer les meilleurs candidats
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Informations de base */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-blue-600 text-xl">📋</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Informations générales</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Titre du poste</label>
                    <input 
                      name="titre" 
                      placeholder="Ex: Développeur Full Stack Senior" 
                      value={form.titre} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm" 
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description du poste</label>
                    <textarea 
                      name="description" 
                      placeholder="Décrivez en détail les missions et responsabilités du poste..." 
                      value={form.description} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm resize-none" 
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Domaine d&apos;activité</label>
                    <select
                      name="domaine"
                      value={form.domaine}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 shadow-sm bg-white"
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
                      <option value="Autre">📋 Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type de contrat</label>
                    <select
                      name="typeContrat"
                      value={form.typeContrat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 shadow-sm bg-white"
                      required
                    >
                      <option value="">Type de contrat</option>
                      <option value="CDI">📋 CDI</option>
                      <option value="CDD">📄 CDD</option>
                      <option value="Stage">🎓 Stage</option>
                      <option value="Alternance">🔄 Alternance</option>
                      <option value="Freelance">💼 Freelance</option>
                      <option value="Temps partiel">⏰ Temps partiel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu de travail</label>
                    <input 
                      name="lieu" 
                      placeholder="Ex: Paris, Remote, Hybride..." 
                      value={form.lieu} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Salaire proposé</label>
                    <input 
                      name="salaire" 
                      placeholder="Ex: 45000, 35-40k, À négocier..." 
                      value={form.salaire} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm" 
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Exigences du poste */}
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-purple-600 text-xl">🎯</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Exigences et qualifications</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expérience requise</label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 shadow-sm bg-white"
                    >
                      <option value="">Sélectionnez l&apos;expérience</option>
                      <option value="Débutant accepté">🌱 Débutant accepté</option>
                      <option value="1-2 ans">📈 1-2 ans</option>
                      <option value="3-5 ans">💼 3-5 ans</option>
                      <option value="5-10 ans">🚀 5-10 ans</option>
                      <option value="10+ ans">⭐ 10+ ans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau d&apos;étude</label>
                    <select
                      name="niveauEtude"
                      value={form.niveauEtude}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 shadow-sm bg-white"
                    >
                      <option value="">Sélectionnez le niveau</option>
                      <option value="Bac">🎓 Bac</option>
                      <option value="Bac+2">📚 Bac+2</option>
                      <option value="Bac+3">🎓 Bac+3</option>
                      <option value="Bac+5">🏆 Bac+5</option>
                      <option value="Bac+8">👨‍🎓 Bac+8</option>
                      <option value="Pas de diplôme requis">✨ Pas de diplôme requis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Horaires de travail</label>
                    <input 
                      name="horaires" 
                      placeholder="Ex: 35h/semaine, 9h-17h, Horaires flexibles..." 
                      value={form.horaires} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début souhaitée</label>
                    <input 
                      name="dateDebut" 
                      type="date"
                      value={form.dateDebut} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 shadow-sm bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Avantages offerts</label>
                    <textarea
                      placeholder="Tickets restaurant, Télétravail partiel, Mutuelle d'entreprise, Formation continue..."
                      value={form.avantages.join(', ')}
                      onChange={(e) => handleArrayChange('avantages', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">Séparez chaque avantage par une virgule</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Compétences techniques requises</label>
                    <textarea
                      placeholder="JavaScript, React, Node.js, PostgreSQL, Git, Docker..."
                      value={form.competences.join(', ')}
                      onChange={(e) => handleArrayChange('competences', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">Séparez chaque compétence par une virgule</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    type="button"
                    onClick={() => router.push("/dashboard-pro")}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <span className="mr-2 text-xl">💾</span>
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
