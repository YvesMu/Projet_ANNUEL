"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface UserProfile {
  id: number;
  email: string;
  prenom?: string;
  nom?: string;
  role: string;
  domaine: string;
  typeOffre: string;
  photoUrl?: string;
  cvUrl?: string;
  presentation?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [presentation, setPresentation] = useState("");
  const [domaine, setDomaine] = useState("");
  const [typeOffre, setTypeOffre] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setPresentation(data.presentation || "");
        setDomaine(data.domaine || "");
        setTypeOffre(data.typeOffre || "");
      })
      .catch((err) => console.error("Erreur profil:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePresentationUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ presentation }),
    });

    alert("Présentation mise à jour !");
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!domaine) {
      alert("Veuillez sélectionner un domaine");
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domaine, typeOffre }),
      });

      alert("Profil mis à jour !");
      window.location.reload();
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      alert("Erreur lors de la mise à jour du profil.");
    }
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/upload/${type}`, {
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👤</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement du profil...</h2>
            <p className="text-gray-600">Récupération de vos informations</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="text-8xl mb-8">😕</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Profil non trouvé</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Impossible de récupérer vos informations de profil.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
              👤
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Mon Profil
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gérez vos informations personnelles et préférences professionnelles
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8 sticky top-8">
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    {profile.photoUrl ? (
                      <img 
                        src={profile.photoUrl} 
                        alt="Photo de profil" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-xl" 
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-4xl border-4 border-indigo-200 shadow-xl">
                        👤
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
                         onClick={() => photoInputRef.current?.click()}>
                      📷
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile.prenom} {profile.nom}
                  </h2>
                  <p className="text-indigo-600 font-medium mb-1">{profile.email}</p>
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-bold">
                    {profile.role === 'particulier' ? '👤 Particulier' : '🏢 Professionnel'}
                  </span>
                </div>

                <div className="space-y-4">
                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <span className="mr-2 text-lg">📷</span>
                    Changer la photo
                  </button>

                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <span className="mr-2 text-lg">📄</span>
                    {profile.cvUrl ? 'Mettre à jour CV' : 'Ajouter un CV'}
                  </button>

                  {profile.cvUrl && (
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                    >
                      <span className="mr-2 text-lg">👀</span>
                      Consulter mon CV
                    </a>
                  )}
                </div>

                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "photo")}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "cv")}
                  className="hidden"
                />
              </div>
            </div>


            <div className="lg:col-span-2 space-y-8">

              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-blue-600 text-2xl">ℹ️</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Informations personnelles</h3>
                    <p className="text-gray-600 mt-1">Vos données de profil</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white text-sm">
                          👤
                        </span>
                        <span className="font-bold text-blue-900">Prénom</span>
                      </div>
                      <p className="text-blue-800 font-medium">{profile.prenom || "Non renseigné"}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 text-white text-sm">
                          📧
                        </span>
                        <span className="font-bold text-green-900">Email</span>
                      </div>
                      <p className="text-green-800 font-medium">{profile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3 text-white text-sm">
                          👤
                        </span>
                        <span className="font-bold text-purple-900">Nom</span>
                      </div>
                      <p className="text-purple-800 font-medium">{profile.nom || "Non renseigné"}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3 text-white text-sm">
                          🏢
                        </span>
                        <span className="font-bold text-orange-900">Rôle</span>
                      </div>
                      <p className="text-orange-800 font-medium">
                        {profile.role === 'particulier' ? 'Particulier' : 'Professionnel'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-indigo-600 text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Préférences professionnelles</h3>
                    <p className="text-gray-600 mt-1">Configurez vos préférences de recherche</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Domaine d&apos;activité
                    </label>
                    <select
                      value={domaine}
                      onChange={(e) => setDomaine(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
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
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Type d&apos;offre recherché
                    </label>
                    <select
                      value={typeOffre}
                      onChange={(e) => setTypeOffre(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
                      required
                    >
                      <option value="emploi">💼 Emploi</option>
                      <option value="stage">🎓 Stage</option>
                      <option value="freelance">💡 Freelance</option>
                      <option value="alternance">🔄 Alternance</option>
                    </select>
                  </div>
                </div>

                <button
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center text-lg"
                  onClick={handleProfileUpdate}
                  disabled={uploading}
                >
                  <span className="mr-3 text-xl">💾</span>
                  Mettre à jour mes préférences
                </button>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-green-600 text-2xl">✍️</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Ma présentation</h3>
                    <p className="text-gray-600 mt-1">Décrivez-vous en quelques mots</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <textarea
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm resize-none shadow-sm hover:shadow-md"
                    rows={6}
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    placeholder="Parlez-nous de vous, de vos compétences, de vos aspirations professionnelles..."
                  />

                  <button
                    className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center text-lg"
                    onClick={handlePresentationUpdate}
                    disabled={uploading}
                  >
                    <span className="mr-3 text-xl">💾</span>
                    {uploading ? "Sauvegarde en cours..." : "Mettre à jour ma présentation"}
                  </button>
                </div>
              </div>

              {uploading && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200 shadow-xl">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-yellow-600 border-t-transparent rounded-full animate-spin mr-4"></div>
                    <p className="text-yellow-800 font-bold text-lg">Upload en cours...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-indigo-100/50 shadow-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl">💡</span>
              Conseils pour optimiser votre profil
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4 text-indigo-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-600 font-bold">✓</span>
                  <span className="font-medium">Ajoutez une photo professionnelle</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-600 font-bold">✓</span>
                  <span className="font-medium">Rédigez une présentation attractive</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-600 font-bold">✓</span>
                  <span className="font-medium">Mettez à jour votre CV régulièrement</span>
                </li>
              </ul>
              <ul className="space-y-4 text-indigo-800">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-600 font-bold">✓</span>
                  <span className="font-medium">Précisez vos préférences de recherche</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-600 font-bold">✓</span>
                  <span className="font-medium">Gardez vos informations à jour</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-indigo-600 font-bold">✓</span>
                  <span className="font-medium">Soyez authentique dans votre présentation</span>
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
