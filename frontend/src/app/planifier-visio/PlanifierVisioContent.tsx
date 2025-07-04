"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
}

interface Offre {
  id: number;
  titre: string;
}

export default function PlanifierVisio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    const urldate = searchParams.get("date");
    return urldate ? urldate :"";
  });

  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [selectedCandidat, setSelectedCandidat] = useState<number | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/candidats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCandidats(data))
      .catch((err) => console.error(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offres/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOffres(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedCandidat || !selectedOffre || !scheduledAt) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-call/planifier`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidatId: selectedCandidat,
          offreId: selectedOffre,
          scheduledAt,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création de la visio");
      alert("Visio planifiée !");
      router.push("/dashboard-pro");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
            📅
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Planifier une visio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organisez un entretien vidéo avec vos candidats en quelques clics
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8 max-w-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-3xl"></div>
          
          <div className="space-y-8 mt-4">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Candidat
              </label>
              <div className="relative">
                <select
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12 appearance-none"
                  value={selectedCandidat ?? ""}
                  onChange={(e) => setSelectedCandidat(Number(e.target.value))}
                >
                  <option value="">Sélectionner un candidat</option>
                  {candidats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.prenom} {c.nom} ({c.email})
                    </option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  👤
                </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Offre d&apos;emploi
              </label>
              <div className="relative">
                <select
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12 appearance-none"
                  value={selectedOffre ?? ""}
                  onChange={(e) => setSelectedOffre(Number(e.target.value))}
                >
                  <option value="">Sélectionner une offre</option>
                  {offres.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.titre}
                    </option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  💼
                </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Date et heure
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🕒
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Enregistrement en cours...
                </>
              ) : (
                <>
                  <span className="mr-3 text-xl">🎥</span>
                  Planifier l&apos;entretien vidéo
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100/50 shadow-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">💡</span>
            Conseils pour votre entretien vidéo
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                <span className="font-medium">Testez votre connexion internet</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                <span className="font-medium">Vérifiez votre caméra et micro</span>
              </li>
            </ul>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                <span className="font-medium">Préparez vos questions à l&apos;avance</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-blue-600 font-bold">✓</span>
                <span className="font-medium">Choisissez un environnement calme</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
