"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

  const [loading, setLoading] = useState(true);

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
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        setForm({
          titre: data.titre || "",
          description: data.description || "",
          domaine: data.domaine || "",
          typeContrat: data.typeContrat || "",
          lieu: data.lieu || "",
          salaire: data.salaire || "",
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
      })
      .finally(() => setLoading(false));
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-xl mx-auto p-4">
          <p>Chargement...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Modifier l&apos;offre</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Domaine</label>
              <select
                name="domaine"
                value={form.domaine}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Sélectionner</option>
                <option value="informatique">Informatique</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type de contrat</label>
              <select
                name="typeContrat"
                value={form.typeContrat}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Sélectionner</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lieu</label>
              <input
                type="text"
                name="lieu"
                value={form.lieu}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salaire</label>
              <input
                type="text"
                name="salaire"
                value={form.salaire}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compétences (séparées par des virgules)</label>
            <input
              type="text"
              value={form.competences.join(', ')}
              onChange={(e) => handleArrayChange('competences', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ex: JavaScript, React, Node.js"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avantages (séparés par des virgules)</label>
            <input
              type="text"
              value={form.avantages.join(', ')}
              onChange={(e) => handleArrayChange('avantages', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ex: Télétravail, Tickets restaurant, Mutuelle"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Modifier l&apos;offre
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard-pro")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
