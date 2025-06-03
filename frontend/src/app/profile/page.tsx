"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";

interface UserProfile {
  id: number;
  email: string;
  prenom?: string;
  nom?: string;
  role: string;
  photoUrl?: string;
  cvUrl?: string;
  presentation?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [presentation, setPresentation] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setPresentation(data.presentation || "");
      })
      .catch((err) => console.error("Erreur profil:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePresentationUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch("http://localhost:5000/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ presentation }),
    });

    alert("Présentation mise à jour !");
  };

  const handleFileUpload = async (
    file: File,
    type: "photo" | "cv"
  ) => {
    if (!file) return;

    if (type === "photo" && !file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide.");
      return;
    }
    if (type === "cv" && file.type !== "application/pdf") {
      alert("Veuillez sélectionner un fichier PDF pour le CV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    if (!token) return;

    setUploading(true);

    try {
      await fetch(`http://localhost:5000/user/upload/${type}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      alert(`${type === "photo" ? "Photo" : "CV"} mis à jour !`);
      window.location.reload();
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Profil non trouvé</p>;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Mon Profil</h1>

        <div className="flex justify-center mb-8">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="Photo de profil" className="w-40 h-40 rounded-full object-cover border-4 border-blue-500" />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xl border-2 border-gray-400">
              Aucune photo
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => photoInputRef.current?.click()}
          >
            Changer la photo
          </button>
          <input
            type="file"
            ref={photoInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "photo")}
            className="hidden"
          />
        </div>

        <div className="mb-8">
          <label className="font-semibold block mb-2">Ma présentation :</label>
          <textarea
            className="border p-3 w-full rounded resize-none"
            rows={4}
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 mt-3 rounded hover:bg-green-700"
            onClick={handlePresentationUpdate}
            disabled={uploading}
          >
            {uploading ? "Sauvegarde..." : "Mettre à jour"}
          </button>
        </div>

        <div className="mb-8">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => cvInputRef.current?.click()}
          >
            Mettre à jour mon CV
          </button>
          <input
            type="file"
            ref={cvInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "cv")}
            className="hidden"
          />
        </div>

        {profile.cvUrl && (
          <div className="text-center">
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline"
            >
              Consulter mon CV
            </a>
          </div>
        )}

        {uploading && (
          <p className="mt-6 text-yellow-600 font-semibold text-center">Upload en cours...</p>
        )}
      </main>
    </>
  );
}
