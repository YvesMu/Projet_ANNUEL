"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";

export default function VideoCallPage() {
  const { callId } = useParams();
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);
  const [loading, setLoading] = useState(true);

  const [callInfo, setCallInfo] = useState<{
    offre: { titre: string };
    candidat: { prenom: string; nom: string };
    scheduledAt: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const joinCall = async () => {
      try {
        const res = await fetch(`http://localhost:5000/video-call/${callId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Impossible de récupérer la room");

        const data = await res.json();
        setCallInfo({
          offre: data.offre,
          candidat: data.candidat,
          scheduledAt: data.scheduledAt,
        });

        const roomUrl = data.roomUrl;

        if (!callFrameRef.current && containerRef.current && !DailyIframe.getCallInstance()) {
          const callFrame = DailyIframe.createFrame(containerRef.current, {
            iframeStyle: {
              width: "100%",
              height: "100%",
              border: "0",
              borderRadius: "0.75rem",
            },
            showLeaveButton: true,
          });

          await callFrame.join({ url: roomUrl });
          callFrame.on("left-meeting", () => router.push("/dashboard"));

          callFrameRef.current = callFrame;
        }
      } catch (err) {
        console.error("Erreur lors de la connexion à la room :", err);
        alert("Impossible de rejoindre l'appel vidéo.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    joinCall();

    return () => {
      callFrameRef.current?.leave();
      callFrameRef.current?.destroy();
      callFrameRef.current = null;
    };
  }, [callId, router]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-12 text-center max-w-md w-full">
                {/* Animation de chargement */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">📹</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Connexion en cours...
                </h1>
                <p className="text-gray-600 text-lg">
                  Préparation de votre appel vidéo
                </p>
                <div className="mt-6 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informations de l'appel */}
              {callInfo && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                          📹
                        </span>
                        Appel Vidéo en cours
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            🎯
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Offre</p>
                            <p className="font-semibold text-gray-900">{callInfo.offre.titre}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            👤
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Candidat</p>
                            <p className="font-semibold text-gray-900">
                              {callInfo.candidat.prenom} {callInfo.candidat.nom}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            🗓️
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Planifié le</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(callInfo.scheduledAt).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interface vidéo */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
                <div
                  ref={containerRef}
                  className="w-full h-[75vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-inner overflow-hidden relative"
                >
                  {/* Overlay de chargement si nécessaire */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-xl">
                    <div className="text-white/60 text-center">
                      <div className="text-6xl mb-4">📹</div>
                      <p className="text-lg">Interface vidéo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>📞</span>
                  <span>Quitter la visio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
