"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const { callId } = params;

  const callFrameRef = useRef<DailyCall | null>(null);
  const [loading, setLoading] = useState(true);

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
        const roomUrl = data.roomUrl;

        const callFrame = DailyIframe.createFrame({
          iframeStyle: {
            position: "fixed",
            top: "80px",
            left: "0px",
            width: "100%",
            height: "90%",
            border: "0",
          },
        });

        callFrame.join({ url: roomUrl });
        callFrameRef.current = callFrame;

        callFrame.on("left-meeting", () => {
          router.push("/dashboard");
        });
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
    };
  }, [callId, router]);

  return (
    <>
      <Header />
      {loading && (
        <main className="max-w-5xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Connexion...</h1>
          <p>Chargement de la visio...</p>
        </main>
      )}
      <div id="daily-video-container" />
    </>
  );
}
