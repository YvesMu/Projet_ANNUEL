"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isProfessional, setIsProfessional] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsProfessional(false);
    router.push("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">ProPlatform</Link>

      <nav className="flex gap-4">
        <Link href="/" className="hover:underline">Accueil</Link>
        <Link href="/offres" className="hover:underline">Offres</Link>

        {isAuthenticated && (
          <>
            <Link href="/profile" className="hover:underline">Mon Profil</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/mes-visios" className="hover:underline">Mes Visios</Link>
            {isProfessional && (
              <>
              <Link href="/create-offer" className="hover:underline font-semibold">
                Créer une offre
              </Link>
              
              <Link href="/planifier-visio" className="hover:underline font-semibold">
                Planifier un appel
              </Link>
              <Link href="/mes-visios" className="hover:underline">Mes Visios</Link>
              </>
            )}
            <button onClick={handleLogout} className="hover:underline">Déconnexion</button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link href="/login" className="hover:underline">Connexion</Link>
            <Link href="/register" className="hover:underline">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}
