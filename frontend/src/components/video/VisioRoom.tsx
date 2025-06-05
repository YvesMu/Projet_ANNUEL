"use client";

import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";

export default function VisioRoom() {
  const params = useParams();
  const router = useRouter();
  const { callId } = params;

  const callFrameRef = useRef<DailyCall | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/video-call/${callId}`, {
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

  useEffect(() => {
    if (roomUrl) {
      const callFrame = DailyIframe.createFrame(
        document.getElementById("daily-container") as HTMLElement,
        {
          iframeStyle: {
            position: "fixed",
            top: "70px",
            left: "0",
            width: "100%",
            height: "90%",
            border: "0",
          },
        }
      );

      callFrame.join({ url: roomUrl });

      callFrameRef.current = callFrame;
    }

    return () => {
      callFrameRef.current?.leave();
    };
  }, [roomUrl]);

  return (
    <>
      <Header />
      {loading ? (
        <p className="p-8 text-center">Chargement de la visio...</p>
      ) : (
        <div id="daily-container" />
      )}
    </>
  );
}
