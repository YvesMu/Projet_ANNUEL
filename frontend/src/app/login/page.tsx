"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      console.log("Connexion réussie :", data);

      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Erreur lors de la connexion :", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        
        <div className="w-full max-w-lg relative z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
                🔐
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Connexion
              </h1>
              <p className="text-gray-600 text-xl">
                Accédez à votre espace professionnel
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-5">
                  <div className="flex items-center">
                    <span className="text-red-500 text-2xl mr-3">⚠️</span>
                    <p className="text-red-700 font-bold text-lg">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 mt-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-xl">🚀</span>
                    Se connecter
                  </div>
                )}
              </button>
            </form>

            <div className="text-center mt-10 pt-8 border-t-2 border-gray-100">
              <p className="text-gray-600 text-lg">
                Vous n&apos;avez pas encore de compte ?{" "}
                <Link 
                  href="/register" 
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-300 underline decoration-2 underline-offset-4"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            <div className="text-center mt-6">
              <Link 
                href="/forgot-password" 
                className="text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pourquoi se connecter ?</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="font-bold text-gray-900">Accès rapide</span>
                <span className="text-sm text-gray-600 mt-1">Dashboard personnalisé</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <span className="text-2xl">💼</span>
                </div>
                <span className="font-bold text-gray-900">Mes offres</span>
                <span className="text-sm text-gray-600 mt-1">Gestion complète</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="font-bold text-gray-900">Statistiques</span>
                <span className="text-sm text-gray-600 mt-1">Suivi des candidatures</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
