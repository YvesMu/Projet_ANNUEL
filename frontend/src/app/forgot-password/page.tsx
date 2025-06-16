"use client";

import { useState } from "react";
import Header from "@/components/Header"; // ✅ Assure-toi que le chemin est correct

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage("Un lien de réinitialisation vous a été envoyé par email.");
    } else {
      setMessage("Erreur : adresse introuvable ou serveur indisponible.");
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Mot de passe oublié</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Envoyer le lien
          </button>
          {message && <p>{message}</p>}
        </form>
      </main>
    </>
  );
}
