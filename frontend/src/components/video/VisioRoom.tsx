"use client";

import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";

export default function VisioRoom() {
  const { callId } = useParams();
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupère l'URL de la visio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-call/${callId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setRoomUrl(data.roomUrl);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer la room");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [callId, router]);

  // Initialise la visio une fois l'URL reçue
  useEffect(() => {
    if (roomUrl && containerRef.current && !callFrameRef.current) {
      const callFrame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "0.5rem",
        },
        showLeaveButton: true,
      });

      callFrame.join({ url: roomUrl });
      callFrame.on("left-meeting", () => router.push("/dashboard"));
      callFrameRef.current = callFrame;
    }

    return () => {
      callFrameRef.current?.leave();
      callFrameRef.current?.destroy();
      callFrameRef.current = null;
    };
  }, [roomUrl, router]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-3xl">🎥</span>
              </div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion en cours...</h2>
              <p className="text-gray-600 text-lg">Préparation de votre salle de visioconférence</p>
              <div className="mt-4 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6">
            {/* Header de la salle */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎥</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Salle de visioconférence
                  </h1>
                  <p className="text-gray-600 text-sm">Entretien professionnel en direct</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Container de la vidéo */}
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Barre supérieure décorative */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2"></div>
                
                {/* Zone vidéo */}
                <div className="p-6">
                  <div
                    ref={containerRef}
                    className="w-full h-[75vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-inner overflow-hidden relative"
                  />
                </div>

                {/* Barre d'actions */}
                <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    {/* Info de la session */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Session active</p>
                        <p className="text-xs text-gray-600">Entretien en cours</p>
                      </div>
                    </div>

                    {/* Conseils rapides */}
                    <div className="hidden md:flex items-center gap-6 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">🎤</span>
                        <span>Gardez votre micro activé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">👁️</span>
                        <span>Regardez la caméra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">😊</span>
                        <span>Restez professionnel</span>
                      </div>
                    </div>

                    {/* Bouton quitter */}
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="text-lg">🚪</span>
                      Quitter la visio
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Note informative */}
            <div className="max-w-7xl mx-auto mt-6">
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-sm">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Conseils pour un entretien réussi</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Vérifiez votre connexion internet et l'éclairage de votre visage</li>
                      <li>• Choisissez un arrière-plan neutre et professionnel</li>
                      <li>• Préparez vos questions et ayez votre CV à portée de main</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
