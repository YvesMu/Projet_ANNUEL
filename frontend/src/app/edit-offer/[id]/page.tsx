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
  });

  useEffect(() => {
    if (!offerId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5000/offres/${offerId}`, {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/offres/${offerId}`, {
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
          <input name="domaine" placeholder="Domaine" value={form.domaine} onChange={handleChange} className="border p-2 rounded" />
          <input name="typeContrat" placeholder="Type de contrat" value={form.typeContrat} onChange={handleChange} className="border p-2 rounded" />
          <input name="lieu" placeholder="Lieu" value={form.lieu} onChange={handleChange} className="border p-2 rounded" />
          <input name="salaire" placeholder="Salaire" value={form.salaire} onChange={handleChange} className="border p-2 rounded" />

          <button type="submit" className="bg-blue-600 text-white py-2 rounded">
            Enregistrer
          </button>
        </form>
      </main>
    </>
  );
}
