"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface UserProfile {
  prenom: string;
  nom: string;
  email: string;
  role: "particulier" | "professionnel";
  domaine: string;
  typeOffre: string;
  photoUrl?: string;
  presentation?: string;
  cvUrl?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    presentation: "",
    cvUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          presentation: data.presentation || "",
          cvUrl: data.cvUrl || "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur lors du chargement du profil");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/user/profile", {
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
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

        <div className="border rounded p-4 mb-8">
          <p><strong>Nom :</strong> {profile?.prenom} {profile?.nom}</p>
          <p><strong>Email :</strong> {profile?.email}</p>
          <p><strong>Rôle :</strong> {profile?.role}</p>
          <p><strong>Domaine :</strong> {profile?.domaine}</p>
          <p><strong>Type Offre :</strong> {profile?.typeOffre}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            name="presentation"
            placeholder="Présentation"
            value={form.presentation}
            onChange={handleChange}
            className="border p-2 rounded"
            rows={4}
          />
          <input
            name="cvUrl"
            placeholder="URL vers ton CV"
            value={form.cvUrl}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Mettre à jour</button>
        </form>
      </main>
    </>
  );
}
