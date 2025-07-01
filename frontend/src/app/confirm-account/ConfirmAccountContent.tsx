"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

export default function ConfirmAccount() {
  const [message, setMessage] = useState("Confirmation en cours...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token invalide.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirm-account?token=${token}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erreur lors de la confirmation.");
      });
  }, [token]);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Confirmation de compte</h1>
        <p className="mt-4">{message}</p>
      </main>
    </>
  );
}
