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
              borderRadius: "0.5rem",
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
      <main className="flex flex-col items-center justify-center px-4 py-8 min-h-screen bg-gray-50">
        {loading ? (
          <div className="text-center mt-16">
            <h1 className="text-2xl font-bold mb-4">Connexion...</h1>
            <p className="text-gray-600">Chargement de la visio en cours...</p>
          </div>
        ) : (
          <>
            {callInfo && (
              <div className="text-center mb-4 bg-white p-4 rounded shadow max-w-2xl w-full">
                <p className="text-lg font-semibold text-gray-800">
                  🎯 <span className="font-bold">Offre :</span> {callInfo.offre.titre}
                </p>
                <p className="text-gray-700">
                  👤 <span className="font-bold">Candidat :</span>{" "}
                  {callInfo.candidat.prenom} {callInfo.candidat.nom}
                </p>
                <p className="text-gray-700">
                  🗓️ <span className="font-bold">Prévu le :</span>{" "}
                  {new Date(callInfo.scheduledAt).toLocaleString()}
                </p>
              </div>
            )}

            <h1 className="text-2xl font-semibold mb-4">Appel Vidéo</h1>

            <div
              ref={containerRef}
              className="w-full max-w-5xl h-[70vh] bg-white rounded-lg shadow border overflow-hidden"
            />

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
            >
              Quitter la visio
            </button>
          </>
        )}
      </main>
    </>
  );
}
