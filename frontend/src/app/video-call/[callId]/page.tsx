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

        const { roomUrl } = await res.json();

        if (!callFrameRef.current && containerRef.current) {
          const frame = DailyIframe.createFrame(containerRef.current, {
            iframeStyle: {
              width: "100%",
              height: "100%",
              border: "0",
              borderRadius: "0.5rem",
            },
            showLeaveButton: true,
          });

          frame.join({ url: roomUrl });
          frame.on("left-meeting", () => router.push("/dashboard"));

          // Écoute les messages entrants
          frame.on("app-message", (event) => {
            const { data, fromId } = event;
            if (data.type === "chat") {
              setChatMessages((prev) => [
                ...prev,
                {
                  sender: fromId ?? "Autre",
                  text: data.text,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }
          });

          callFrameRef.current = frame;
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

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      type: "chat",
      text: newMessage,
    };

    callFrameRef.current?.sendAppMessage(message);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "Moi",
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
            <div className="w-2/3 h-[70vh] bg-white rounded-lg shadow overflow-hidden" ref={containerRef} />

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
