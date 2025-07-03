"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Modifier l&lsquo;offre</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" rows={4} />
          
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
          
          <input name="lieu" placeholder="Lieu" value={form.lieu} onChange={handleChange} className="border p-2 rounded" />
          <input name="salaire" placeholder="Salaire" value={form.salaire} onChange={handleChange} className="border p-2 rounded" />

          {/* Nouveaux champs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Expérience requise</label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Sélectionnez l&apos;expérience</option>
                <option value="Débutant accepté">Débutant accepté</option>
                <option value="1-2 ans">1-2 ans</option>
                <option value="3-5 ans">3-5 ans</option>
                <option value="5-10 ans">5-10 ans</option>
                <option value="10+ ans">10+ ans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Niveau d&apos;étude</label>
              <select
                name="niveauEtude"
                value={form.niveauEtude}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Sélectionnez le niveau</option>
                <option value="Bac">Bac</option>
                <option value="Bac+2">Bac+2</option>
                <option value="Bac+3">Bac+3</option>
                <option value="Bac+5">Bac+5</option>
                <option value="Bac+8">Bac+8</option>
                <option value="Pas de diplôme requis">Pas de diplôme requis</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Horaires</label>
            <input 
              name="horaires" 
              placeholder="Ex: 35h/semaine, 9h-17h" 
              value={form.horaires} 
              onChange={handleChange} 
              className="border p-2 rounded w-full" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Date de début</label>
            <input 
              name="dateDebut" 
              type="date"
              value={form.dateDebut} 
              onChange={handleChange} 
              className="border p-2 rounded w-full" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Avantages</label>
            <textarea
              placeholder="Séparez par des virgules (ex: Tickets restaurant, Télétravail, Mutuelle)"
              value={form.avantages.join(', ')}
              onChange={(e) => handleArrayChange('avantages', e.target.value)}
              className="border p-2 rounded w-full"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Compétences requises</label>
            <textarea
              placeholder="Séparez par des virgules (ex: JavaScript, React, Node.js)"
              value={form.competences.join(', ')}
              onChange={(e) => handleArrayChange('competences', e.target.value)}
              className="border p-2 rounded w-full"
              rows={2}
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white py-2 rounded">
            Enregistrer
          </button>
        </form>
      </main>
    </>
  );
}
