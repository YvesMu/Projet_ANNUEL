"use client";
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
}

export default function VideoCallPage() {
  const { callId } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  const [loading, setLoading] = useState(true);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Moi");

  // Premier useEffect : Authentification et récupération de l'URL de la room
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

    const fetchRoom = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:32000';
        console.log('🌐 API URL:', apiUrl);
        console.log('📞 Call ID:', callId);
        
        const res = await fetch(`${apiUrl}/video-call/${callId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Impossible de récupérer la room");

        const response = await res.json();
        console.log('📡 API Response:', response);
        setRoomUrl(response.roomUrl);
      } catch (err) {
        console.error("❌ Erreur récupération room :", err);
        alert("Impossible de récupérer la room");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [callId, router]);

  // Deuxième useEffect : Création de l'iframe Daily une fois l'URL récupérée
  useEffect(() => {
    if (roomUrl && containerRef.current && !callFrameRef.current) {
      console.log('📦 Container found, creating Daily frame...');
      console.log('🎥 Room URL:', roomUrl);
      
      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "0.5rem",
        },
        showLeaveButton: true,
      });

      console.log('🚀 Frame created, joining room...');
      frame.join({ url: roomUrl })
        .then(() => {
          console.log('✅ Successfully joined room!');
        })
        .catch((err) => {
          console.error('❌ Error joining room:', err);
        });
      
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

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave();
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl, router]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      type: "chat",
      text: newMessage,
      name: username,
    };

    console.log("📤 Envoi du message :", {
      type: "chat",
      text: newMessage,
      name: username,
    });
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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-400 rounded-full animate-ping"></div>
              </div>
              <p className="mt-6 text-xl font-medium text-gray-700 animate-pulse">
                🎥 Connexion à la visioconférence...
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Préparation de votre espace de discussion
              </p>
            </div>
          ) : (
            <div className="flex gap-6 h-[85vh]">
              {/* Visio */}
              <div className="flex-1 relative">
                <div
                  className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm"
                  ref={containerRef}
                />
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  🔴 En direct
                </div>
              </div>

              {/* Chat moderne */}
              <div className="w-96 flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Header du chat */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Discussion</h2>
                      <p className="text-blue-100 text-sm">Chat en temps réel</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-gray-50/50">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        💭
                      </div>
                      <p className="text-sm font-medium">Aucun message pour le moment</p>
                      <p className="text-xs text-gray-400 mt-1">Soyez le premier à écrire !</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.sender === username ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                            msg.sender === username
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          <div className={`text-xs font-medium mb-1 ${
                            msg.sender === username ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {msg.sender === username ? "Vous" : msg.sender}
                          </div>
                          <div className="text-sm leading-relaxed">
                            {msg.text}
                          </div>
                          <div className={`text-xs mt-1 ${
                            msg.sender === username ? "text-blue-200" : "text-gray-400"
                          }`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Écrire un message..."
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        ⏎
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        🚀
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>💡</span>
                    <span>Appuyez sur Entrée pour envoyer</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}