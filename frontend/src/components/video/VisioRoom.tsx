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
      <main className="flex flex-col items-center justify-center px-4 py-8 min-h-screen bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-600 text-lg mt-20">Chargement de la visio...</p>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4">Salle de visio</h1>
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
