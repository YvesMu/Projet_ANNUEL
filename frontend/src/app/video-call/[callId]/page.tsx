"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
}

interface CallInfo {
  offre: {
    titre: string;
  };
  candidat: {
    prenom: string;
    nom: string;
  };
  scheduledAt: string;
}

export default function VideoCallPage() {
  const { callId } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Moi");
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload JWT:", payload);
      if (payload?.prenom && payload?.nom) {
        setUsername(`${payload.prenom} ${payload.nom}`);
      } else if (payload?.prenom) {
        setUsername(payload.prenom);
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token JWT :", err);
    }

    const joinCall = async () => {
      try {
        const res = await fetch(`http://localhost:5000/video-call/${callId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Impossible de récupérer la room");

        const data = await res.json();
        
        // Extraire les informations de l'appel
        setCallInfo({
          offre: data.offre || { titre: "Entretien" },
          candidat: data.candidat || { prenom: "Candidat", nom: "Inconnu" },
          scheduledAt: data.scheduledAt || new Date().toISOString(),
        });

        const roomUrl = data.roomUrl;

        // Toujours détruire toute instance précédente
        if (callFrameRef.current) {
          callFrameRef.current.leave();
          callFrameRef.current.destroy();
          callFrameRef.current = null;
        }

        if (containerRef.current && !DailyIframe.getCallInstance()) {
          const frame = DailyIframe.createFrame(containerRef.current, {
            iframeStyle: {
              width: "100%",
              height: "100%",
              border: "0",
              borderRadius: "0.75rem",
            },
            showLeaveButton: true,
          });

          await frame.join({ url: roomUrl });
          frame.on("left-meeting", () => router.push("/dashboard"));

          frame.on("app-message", (event) => {
            console.log("📥 Message reçu complet :", JSON.stringify(event, null, 2));

            const { data } = event;
            if (data.type === "chat") {
              console.log("📥 Chat avec nom :", data.name);

              setChatMessages((prev) => [
                ...prev,
                {
                  sender: data.name || "Autre",
                  text: data.text,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }
          });

          callFrameRef.current = frame;
        }
      } catch (err) {
        console.error("❌ Erreur join visio :", err);
        alert("Impossible de rejoindre l'appel vidéo.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    joinCall();

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave();
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [callId, router]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      type: "chat",
      text: newMessage,
      name: username,
    };

    console.log("📤 Envoi du message :", message);
    callFrameRef.current?.sendAppMessage(message);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: username,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setNewMessage("");
  };

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

              {/* Layout principal avec vidéo et chat */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Interface vidéo */}
                <div className="lg:col-span-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
                    <div
                      ref={containerRef}
                      className="w-full h-[70vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-inner overflow-hidden relative"
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
                </div>

                {/* Chat */}
                <div className="lg:col-span-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6 h-[70vh] flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        💬
                      </span>
                      Chat
                    </h3>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-xl ${
                            msg.sender === username
                              ? "bg-blue-500 text-white ml-4"
                              : "bg-gray-100 text-gray-900 mr-4"
                          }`}
                        >
                          <div className="font-medium text-sm">{msg.sender}</div>
                          <div className="text-sm">{msg.text}</div>
                          <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Input message */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Tapez votre message..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <button
                        onClick={sendMessage}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Envoyer
                      </button>
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
