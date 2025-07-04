"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

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
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-xl">
                🔐
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mot de passe oublié
              </h1>
              <p className="text-gray-600">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md pl-12"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                    📧
                  </span>
                </div>
              </div>

              {message && (
                <div className={`${message.includes('Erreur') ? 'bg-red-50/80 border-red-200' : 'bg-green-50/80 border-green-200'} backdrop-blur-sm border-2 rounded-2xl p-4 shadow-lg`}>
                  <div className="flex items-center">
                    <span className={`w-8 h-8 ${message.includes('Erreur') ? 'bg-red-500' : 'bg-green-500'} rounded-lg flex items-center justify-center mr-3 text-white text-sm`}>
                      {message.includes('Erreur') ? '⚠️' : '✅'}
                    </span>
                    <p className={`${message.includes('Erreur') ? 'text-red-700' : 'text-green-700'} font-medium`}>
                      {message}
                    </p>
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
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <span className="mr-3 text-xl">📧</span>
                    Envoyer le lien
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
              Information importante
            </h3>
            <div className="space-y-2 text-blue-800 text-sm">
              <p className="flex items-start">
                <span className="mr-2 mt-1 text-blue-600 font-bold">•</span>
                <span>Vérifiez votre boîte de réception et vos spams</span>
              </p>
              <p className="flex items-start">
                <span className="mr-2 mt-1 text-blue-600 font-bold">•</span>
                <span>Le lien est valide pendant 24 heures</span>
              </p>
              <p className="flex items-start">
                <span className="mr-2 mt-1 text-blue-600 font-bold">•</span>
                <span>Contactez le support si vous ne recevez rien</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
