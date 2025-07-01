"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isProfessional, setIsProfessional] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
            ProPlatform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105">
              Accueil
            </Link>
            <Link href="/offres" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105">
              Offres
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105">
                  Mon Profil
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105">
                  Dashboard
                </Link>
                <Link href="/mes-visios" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105">
                  Mes Visios
                </Link>
                
                {isProfessional && (
                  <>
                    <Link href="/create-offer" className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                      Créer une offre
                    </Link>
                    <Link href="/planifier-visio" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                      Planifier un appel
                    </Link>
                    <Link href="/calendrier" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105">
                      Mon Calendrier
                    </Link>
                  </>
                )}

                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                  Connexion
                </Link>
                <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Inscription
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">
              Accueil
            </Link>
            <Link href="/offres" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">
              Offres
            </Link>

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <Link href="/profile" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">
                    Mon Profil
                  </Link>
                  <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">
                    Dashboard
                  </Link>
                  <Link href="/mes-visios" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">
                    Mes Visios
                  </Link>
                </div>
                
                {isProfessional && (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <Link href="/create-offer" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                      Créer une offre
                    </Link>
                    <Link href="/planifier-visio" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                      Planifier un appel
                    </Link>
                    <Link href="/calendrier" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300">
                      Mon Calendrier
                    </Link>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-center px-4 py-2 text-gray-700 hover:text-red-600 font-medium border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link href="/login" className="block w-full text-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                  Connexion
                </Link>
                <Link href="/register" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg">
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
