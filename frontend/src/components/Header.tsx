"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "professionnel") {
          setIsProfessional(true);
        }
      } catch (error) {
        console.error("Erreur de décodage du token", error);
      }
    }
  }, []);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        ProPlatform
      </Link>
      <nav className="flex gap-4">
        <Link href="/" className="hover:underline">Accueil</Link>
        <Link href="/login" className="hover:underline">Connexion</Link>
        <Link href="/register" className="hover:underline">Inscription</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        {isProfessional && (
          <Link href="/create-offer" className="hover:underline font-semibold">
            Créer une offre
          </Link>
        )}
      </nav>
    </header>
  );
}
