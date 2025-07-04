"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  const isSuccess = message.includes("succès") || message.includes("confirmé") || message.includes("activé");
  const isError = message.includes("Erreur") || message.includes("invalide") || message.includes("expiré");
  const isLoading = message.includes("cours");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
            
            <div className="mb-8">
              {isLoading && (
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">⏳</span>
                  </div>
                </div>
              )}
              
              {isSuccess && (
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-2xl animate-bounce">
                  ✅
                </div>
              )}
              
              {isError && (
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-2xl">
                  ❌
                </div>
              )}
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Confirmation de compte
            </h1>

            <div className={`mb-8 p-6 rounded-2xl ${
              isSuccess ? 'bg-green-50 border border-green-200' :
              isError ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-xl font-semibold ${
                isSuccess ? 'text-green-800' :
                isError ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {message}
              </p>
            </div>

            {isSuccess && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-3">
                    🎉 Félicitations !
                  </h3>
                  <p className="text-green-700">
                    Votre compte a été confirmé avec succès. Vous pouvez maintenant vous connecter et profiter de toutes les fonctionnalités.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/login"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <span className="mr-2">🚀</span>
                    Se connecter
                  </a>
                  
                  <a 
                    href="/"
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-200 flex items-center justify-center"
                  >
                    <span className="mr-2">🏠</span>
                    Accueil
                  </a>
                </div>
              </div>
            )}

            {isError && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-red-800 mb-3">
                    ⚠️ Problème de confirmation
                  </h3>
                  <p className="text-red-700 mb-4">
                    Il semble y avoir un problème avec votre lien de confirmation.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/login"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <span className="mr-2">🔑</span>
                    Essayer de se connecter
                  </a>
                  
                  <a 
                    href="/register"
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-200 flex items-center justify-center"
                  >
                    <span className="mr-2">📝</span>
                    Créer un compte
                  </a>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">
                    ⚡ Vérification en cours...
                  </h3>
                  <p className="text-blue-700">
                    Nous vérifions votre lien de confirmation. Cela ne devrait prendre que quelques secondes.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                💡 Besoin d&apos;aide ?
              </h4>
              <p className="text-gray-600 mb-4">
                Si vous rencontrez des difficultés, n&apos;hésitez pas à nous contacter.
              </p>
              <a 
                href="mailto:support@proplatform.com"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">📧</span>
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
