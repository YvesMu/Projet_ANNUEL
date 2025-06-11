"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface VideoCall {
  id: number;
  offre: { id: number; titre: string };
  candidat: { id: number; prenom: string; nom: string };
  professionnel: { id: number; prenom: string; nom: string };
  scheduledAt: string;
  roomUrl: string;
}

export default function MesVisios() {
  const [calls, setCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCalls = async () => {
      try {
        const res = await fetch("http://localhost:5000/video-call/my-calls", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setCalls(data);
      } catch (err) {
        console.error(err);
        alert("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [router]);

  const handleJoin = (callId: number) => {
    router.push(`/video-call/${callId}`);
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mes Visios Planifiées</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : calls.length === 0 ? (
          <p>Aucune visio planifiée pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {calls.map((call) => (
              <div key={call.id} className="border p-4 rounded bg-white shadow flex justify-between items-center">
                <div>
                  <p><b>Offre :</b> {call.offre.titre}</p>
                  <p><b>Date :</b> {new Date(call.scheduledAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleJoin(call.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Rejoindre
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
