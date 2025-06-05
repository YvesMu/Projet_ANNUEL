"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const { callId } = params;

  const videoRef = useRef<HTMLDivElement>(null);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
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

        const daily = await DailyIframe.createCallObject({
          url: roomUrl,
          showLeaveButton: true,
        });

        setCallObject(daily);

        await daily.join({ url: roomUrl });
        daily.setLocalVideo(true);
        daily.setLocalAudio(true);
        daily.startCamera();

        daily.on("left-meeting", () => {
          router.push("/dashboard");
        });

        if (videoRef.current) {
          daily.setTheme({
            colors: { accent: "#1d4ed8" },
          });

          await daily.startCamera();
          await daily.load();
        }
      } catch (err) {
        console.error("Erreur lors de la connexion à la room :", err);
        alert("Impossible de rejoindre l'appel vidéo.");
      } finally {
        setLoading(false);
      }
    };

    joinCall();

    return () => {
      callObject?.leave();
    };
  }, [callId]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Appel Vidéo</h1>

        {loading ? (
          <p>Connexion à la room...</p>
        ) : (
          <div ref={videoRef} style={{ width: "100%", height: "80vh" }} />
        )}
      </main>
    </>
  );
}
