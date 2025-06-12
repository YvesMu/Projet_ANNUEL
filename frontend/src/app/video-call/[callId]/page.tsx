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

export default function VideoCallPage() {
  const { callId } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<DailyCall | null>(null);

  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Moi");

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

        const { roomUrl } = await res.json();

        // 💡 Toujours détruire toute instance précédente (par sécurité)
        if (callFrameRef.current) {
          callFrameRef.current.leave();
          callFrameRef.current.destroy();
          callFrameRef.current = null;
        }

        if (containerRef.current) {
          const frame = DailyIframe.createFrame(containerRef.current, {
            iframeStyle: {
              width: "100%",
              height: "100%",
              border: "0",
              borderRadius: "0.5rem",
            },
            showLeaveButton: true,
          });

          await frame.join({ url: roomUrl });
          frame.on("left-meeting", () => router.push("/dashboard"));

          frame.on("app-message", (event) => {
            console.log("📥 Message reçu complet :", JSON.stringify(event, null, 2)); // ✅ pour debug

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
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        {loading ? (
          <p>Connexion à la visio...</p>
        ) : (
          <div className="flex w-full max-w-7xl gap-4">
            {/* Visio */}
            <div
              className="w-2/3 h-[70vh] bg-white rounded-lg shadow overflow-hidden"
              ref={containerRef}
            />

            {/* Chat */}
            <div className="w-1/3 h-[70vh] flex flex-col bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">💬 Chat</h2>
              <div className="flex-1 overflow-y-auto mb-2 border p-2 rounded text-sm">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="mb-1">
                    <span className="font-semibold">{msg.sender}:</span>{" "}
                    <span>{msg.text}</span>
                    <div className="text-xs text-gray-400">{msg.timestamp}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  placeholder="Écrire un message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
