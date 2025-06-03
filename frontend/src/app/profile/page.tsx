"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  domaine: string;
  photoUrl: string;
  cvUrl: string;
  presentation: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur lors du chargement du profil.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      alert("Profil mis à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="prenom" placeholder="Prénom" value={form.prenom || ""} onChange={handleChange} className="border p-2 rounded" />
          <input name="nom" placeholder="Nom" value={form.nom || ""} onChange={handleChange} className="border p-2 rounded" />
          <input name="photoUrl" placeholder="Photo (URL)" value={form.photoUrl || ""} onChange={handleChange} className="border p-2 rounded" />
          <input name="cvUrl" placeholder="CV (URL)" value={form.cvUrl || ""} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="presentation" placeholder="Présentation" value={form.presentation || ""} onChange={handleChange} className="border p-2 rounded" rows={4} />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">Enregistrer</button>
        </form>
      </main>
    </>
  );
}
