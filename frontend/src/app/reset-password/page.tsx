"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage("Mot de passe mis à jour avec succès ! Vous pouvez maintenant vous connecter.");
      } else {
        setError("Erreur lors de la mise à jour du mot de passe. Le lien a peut-être expiré.");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-xl">
              🔒
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600">
              Choisissez un mot de passe sécurisé pour votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12"
                  required
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔑
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12"
                  required
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  ✅
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3 text-white text-sm">
                    ⚠️
                  </span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="bg-green-50/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 text-white text-sm">
                    ✅
                  </span>
                  <p className="text-green-700 font-medium">{message}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Mise à jour en cours...
                </>
              ) : (
                <>
                  <span className="mr-3 text-xl">🔒</span>
                  Réinitialiser le mot de passe
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Vous vous souvenez de votre mot de passe ?{" "}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <span className="mr-2 text-xl">💡</span>
            Conseils pour un mot de passe sécurisé
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-600 font-bold">•</span>
              <span>Au moins 8 caractères</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-600 font-bold">•</span>
              <span>Mélange de lettres majuscules et minuscules</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-600 font-bold">•</span>
              <span>Au moins un chiffre et un caractère spécial</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Chargement...</p>
          </div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </>
  );
}
