"use client";

import { useState, useEffect } from "react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function CookieSettings() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });
  const [hasConsent, setHasConsent] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Charger les préférences existantes
    const consent = localStorage.getItem('cookieConsent');
    const savedPreferences = localStorage.getItem('cookiePreferences');
    
    if (consent && savedPreferences) {
      setHasConsent(true);
      setPreferences(JSON.parse(savedPreferences));
      
      // Simuler une date de dernière modification
      const lastUpdate = localStorage.getItem('cookieLastUpdated') || new Date().toISOString();
      setLastUpdated(new Date(lastUpdate).toLocaleDateString('fr-FR'));
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
    localStorage.setItem('cookieLastUpdated', new Date().toISOString());
    localStorage.setItem('cookieConsent', 'custom');
    setLastUpdated(new Date().toLocaleDateString('fr-FR'));
    
    console.log('🍪 Préférences mises à jour:', newPreferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return;
    
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    updatePreferences(newPreferences);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    updatePreferences(allAccepted);
  };

  const rejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    updatePreferences(essentialOnly);
  };

  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookiePreferences');
    localStorage.removeItem('cookieLastUpdated');
    setHasConsent(false);
    setPreferences({
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });
    
    alert('⚠️ Vos préférences de cookies ont été supprimées. La bannière réapparaîtra lors de votre prochaine visite.');
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site',
      icon: '🔧',
      required: true,
      purpose: 'Authentification, sécurité, navigation de base'
    },
    {
      key: 'analytics' as const,
      title: 'Cookies d\'analyse',
      description: 'Nous aident à améliorer notre site',
      icon: '📊',
      required: false,
      purpose: 'Mesure d\'audience, statistiques de visite, optimisation UX'
    },
    {
      key: 'marketing' as const,
      title: 'Cookies marketing',
      description: 'Pour des publicités personnalisées',
      icon: '🎯',
      required: false,
      purpose: 'Publicités ciblées, remarketing, suivi des conversions'
    },
    {
      key: 'personalization' as const,
      title: 'Cookies de personnalisation',
      description: 'Pour personnaliser votre expérience',
      icon: '⚙️',
      required: false,
      purpose: 'Préférences d\'affichage, recommandations, thèmes'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-4">🍪</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des cookies</h2>
          <p className="text-gray-600">Contrôlez vos préférences de confidentialité</p>
        </div>
      </div>

      {hasConsent ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center text-green-800">
            <span className="mr-2">✅</span>
            <div>
              <p className="font-semibold">Préférences enregistrées</p>
              <p className="text-sm">Dernière modification : {lastUpdated}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center text-yellow-800">
            <span className="mr-2">⚠️</span>
            <div>
              <p className="font-semibold">Aucune préférence enregistrée</p>
              <p className="text-sm">Vous n'avez pas encore configuré vos cookies</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {cookieTypes.map((cookie) => (
          <div
            key={cookie.key}
            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{cookie.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cookie.title}
                  </h3>
                  {cookie.required && (
                    <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Obligatoire
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{cookie.description}</p>
                <p className="text-sm text-gray-500">
                  <strong>Utilisation :</strong> {cookie.purpose}
                </p>
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
                    ${cookie.required ? 'opacity-50' : 'hover:shadow-lg cursor-pointer'}
                  `}>
                    <div className={`
                      absolute top-0.5 left-0.5 bg-white rounded-full h-6 w-6 transition-transform duration-300 shadow-md
                      ${preferences[cookie.key] ? 'translate-x-7' : 'translate-x-0'}
                    `} />
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={acceptAll}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Tout accepter
        </button>
        <button
          onClick={rejectOptional}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
        >
          Essentiels uniquement
        </button>
        <button
          onClick={clearConsent}
          className="px-6 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-300"
        >
          Réinitialiser
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Informations techniques</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h5 className="font-semibold text-gray-800 mb-2">📊 Cookies actifs</h5>
            <p className="text-gray-600">
              {Object.entries(preferences).filter(([_, enabled]) => enabled).length} sur {Object.keys(preferences).length} catégories
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h5 className="font-semibold text-gray-800 mb-2">🔒 Sécurité</h5>
            <p className="text-gray-600">
              Toutes les données sont stockées localement
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h5 className="font-semibold text-gray-800 mb-2">⏱️ Durée</h5>
            <p className="text-gray-600">
              Les cookies expirent après 13 mois maximum
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h5 className="font-semibold text-gray-800 mb-2">🌍 Portée</h5>
            <p className="text-gray-600">
              Uniquement ce site web
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
