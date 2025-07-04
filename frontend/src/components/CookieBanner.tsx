"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Toujours activé
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Délai pour l'animation
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Simulation d'activation des cookies
    console.log('🍪 Tous les cookies acceptés:', allAccepted);
  };

  const handleRejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    localStorage.setItem('cookieConsent', 'essential');
    localStorage.setItem('cookiePreferences', JSON.stringify(essentialOnly));
    setShowBanner(false);
    
    console.log('🍪 Cookies essentiels uniquement:', essentialOnly);
  };

  const handleCustomSave = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowBanner(false);
    
    console.log('🍪 Préférences personnalisées sauvegardées:', preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Ne peut pas être désactivé
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site (connexion, sécurité, navigation)',
      icon: '🔧',
      required: true,
      examples: 'Session utilisateur, préférences de langue, panier d\'achat'
    },
    {
      key: 'analytics' as const,
      title: 'Cookies d\'analyse',
      description: 'Nous aident à comprendre comment vous utilisez notre site pour l\'améliorer',
      icon: '📊',
      required: false,
      examples: 'Google Analytics, temps passé sur les pages, taux de rebond'
    },
    {
      key: 'marketing' as const,
      title: 'Cookies marketing',
      description: 'Utilisés pour vous proposer des publicités personnalisées et pertinentes',
      icon: '🎯',
      required: false,
      examples: 'Publicités ciblées, suivi des conversions, remarketing'
    },
    {
      key: 'personalization' as const,
      title: 'Cookies de personnalisation',
      description: 'Permettent de personnaliser votre expérience selon vos préférences',
      icon: '⚙️',
      required: false,
      examples: 'Thème de couleur, disposition préférée, recommandations'
    }
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto p-6">
            {!showDetails ? (
              /* Bannière simple */
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">🍪</span>
                    <h3 className="text-xl font-bold text-gray-900">
                      Respect de votre vie privée
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme, 
                    analyser notre trafic et personnaliser le contenu. Vous pouvez choisir quels cookies accepter.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    En savoir plus sur notre{" "}
                    <Link href="/rgpd" className="text-blue-600 hover:text-blue-700 underline">
                      politique de confidentialité
                    </Link>
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                  <button
                    onClick={() => setShowDetails(true)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center"
                  >
                    <span className="mr-2">⚙️</span>
                    Personnaliser
                  </button>
                  <button
                    onClick={handleRejectOptional}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center"
                  >
                    <span className="mr-2">❌</span>
                    Refuser optionnels
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <span className="mr-2">✅</span>
                    Tout accepter
                  </button>
                </div>
              </div>
            ) : (
              /* Panneau détaillé */
              <div className="max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">🍪</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Paramètres des cookies
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  >
                    <span className="text-2xl">❌</span>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Nous respectons votre vie privée et vous donnons le contrôle total sur les cookies que nous utilisons. 
                  Choisissez les catégories que vous souhaitez autoriser :
                </p>
                
                <div className="space-y-6 mb-8">
                  {cookieTypes.map((cookie) => (
                    <div
                      key={cookie.key}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className="text-2xl mr-3">{cookie.icon}</span>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {cookie.title}
                            </h4>
                            {cookie.required && (
                              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                Requis
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{cookie.description}</p>
                          <div className="text-sm text-gray-500">
                            <strong>Exemples :</strong> {cookie.examples}
                          </div>
                        </div>
                        
                        <div className="ml-6 flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences[cookie.key]}
                              onChange={() => togglePreference(cookie.key)}
                              disabled={cookie.required}
                              className="sr-only peer"
                            />
                            <div className={`
                              relative w-14 h-7 rounded-full transition-colors duration-300
                              ${preferences[cookie.key] 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                                : 'bg-gray-300'
                              }
                              ${cookie.required ? 'opacity-50' : 'hover:shadow-lg'}
                            `}>
                              <div className={`
                                absolute top-0.5 left-0.5 bg-white rounded-full h-6 w-6 transition-transform duration-300
                                ${preferences[cookie.key] ? 'translate-x-7' : 'translate-x-0'}
                              `} />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleRejectOptional}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Essentiels uniquement
                  </button>
                  <button
                    onClick={handleCustomSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Sauvegarder mes préférences
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    Vous pouvez modifier ces paramètres à tout moment dans votre espace personnel 
                    ou consulter notre{" "}
                    <Link href="/rgpd" className="underline hover:text-blue-900 ml-1">
                      politique RGPD
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(100%); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
