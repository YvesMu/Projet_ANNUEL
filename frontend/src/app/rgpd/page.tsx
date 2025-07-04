"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function RGPDPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const rgpdSections = [
    {
      id: "collecte",
      title: "📊 Collecte des données",
      content: `Nous collectons les données personnelles suivantes :
      
      **Données d'identification :**
      • Nom, prénom, adresse e-mail
      • Date de naissance (si fournie)
      • Numéro de téléphone (optionnel)
      
      **Données professionnelles :**
      • CV et documents joints
      • Expériences professionnelles
      • Compétences et formations
      • Préférences d'emploi
      
      **Données de navigation :**
      • Adresse IP
      • Cookies et traceurs
      • Historique de navigation sur notre site
      • Données de géolocalisation (avec votre accord)`
    },
    {
      id: "finalites",
      title: "🎯 Finalités du traitement",
      content: `Vos données sont traitées pour les finalités suivantes :
      
      **Gestion de votre compte :**
      • Création et gestion de votre profil
      • Authentification et sécurité
      • Support client
      
      **Services de recrutement :**
      • Mise en relation avec les employeurs
      • Recommandations d'offres personnalisées
      • Organisation d'entretiens vidéo
      
      **Communication :**
      • Envoi d'alertes emploi
      • Newsletters et actualités
      • Notifications importantes
      
      **Amélioration de nos services :**
      • Analyses statistiques anonymisées
      • Amélioration de l'expérience utilisateur
      • Développement de nouvelles fonctionnalités`
    },
    {
      id: "bases-legales",
      title: "⚖️ Bases légales",
      content: `Nos traitements de données reposent sur :
      
      **Consentement (Art. 6.1.a RGPD) :**
      • Envoi de newsletters
      • Cookies non-essentiels
      • Géolocalisation
      
      **Exécution d'un contrat (Art. 6.1.b RGPD) :**
      • Création et gestion de votre compte
      • Services de mise en relation
      • Support technique
      
      **Intérêt légitime (Art. 6.1.f RGPD) :**
      • Sécurité de la plateforme
      • Prévention de la fraude
      • Amélioration de nos services
      
      **Obligation légale (Art. 6.1.c RGPD) :**
      • Conservation de certaines données comptables
      • Respect des obligations fiscales`
    },
    {
      id: "duree",
      title: "⏰ Durée de conservation",
      content: `Nous conservons vos données pour les durées suivantes :
      
      **Données de compte actif :** 3 ans après la dernière connexion
      **CV et candidatures :** 2 ans après dépôt (recrutement)
      **Données de facturation :** 10 ans (obligation légale)
      **Cookies :** 13 mois maximum
      **Logs de sécurité :** 1 an
      
      **Suppression automatique :**
      Vos données sont automatiquement supprimées à l'expiration de ces délais, sauf demande de suppression anticipée de votre part.`
    },
    {
      id: "destinataires",
      title: "👥 Destinataires des données",
      content: `Vos données peuvent être partagées avec :
      
      **En interne :**
      • Équipes techniques et support
      • Service commercial (avec votre accord)
      • Direction (données anonymisées)
      
      **Partenaires externes :**
      • Employeurs (uniquement les données de votre CV public)
      • Prestataires techniques (hébergement, maintenance)
      • Services de paiement (données strictement nécessaires)
      
      **Autorités :**
      • Sur demande légale uniquement
      • Dans le respect de la réglementation
      
      **Garanties :**
      Tous nos partenaires sont soumis à des obligations contractuelles strictes de protection des données.`
    },
    {
      id: "droits",
      title: "🛡️ Vos droits",
      content: `Conformément au RGPD, vous disposez des droits suivants :
      
      **Droit d'accès :** Connaître les données que nous détenons sur vous
      **Droit de rectification :** Corriger vos données inexactes
      **Droit à l'effacement :** Demander la suppression de vos données
      **Droit à la limitation :** Restreindre certains traitements
      **Droit à la portabilité :** Récupérer vos données dans un format structuré
      **Droit d'opposition :** Vous opposer à certains traitements
      **Droit de retrait du consentement :** Retirer votre accord à tout moment
      
      **Comment exercer vos droits :**
      • Via votre espace personnel
      • Par email à : rgpd@plateforme-emploi.fr
      • Par courrier postal avec justificatif d'identité
      
      **Délai de réponse :** 1 mois maximum`
    },
    {
      id: "cookies",
      title: "🍪 Politique des cookies",
      content: `Notre site utilise différents types de cookies pour améliorer votre expérience :
      
      **Cookies essentiels (toujours actifs) :**
      • Authentification et gestion de session
      • Sécurité et prévention de la fraude
      • Fonctionnement de base du site
      • Préférences de langue et région
      • État du panier d'achat
      
      **Cookies de performance et d'analyse :**
      • Mesure d'audience anonyme (Google Analytics)
      • Amélioration de l'expérience utilisateur
      • Tests A/B pour optimiser l'interface
      • Statistiques de navigation et temps de visite
      • Identification des pages les plus populaires
      
      **Cookies marketing et publicitaires (avec votre accord) :**
      • Publicités personnalisées selon vos intérêts
      • Suivi des conversions et efficacité publicitaire
      • Remarketing pour vous proposer du contenu pertinent
      • Intégration des réseaux sociaux
      • Mesure de l'efficacité des campagnes
      
      **Cookies de personnalisation :**
      • Sauvegarde de vos préférences d'affichage
      • Recommandations personnalisées d'offres d'emploi
      • Thème de couleur et disposition préférée
      • Historique de recherche pour suggestions
      • Alertes emploi personnalisées
      
      **Gestion et contrôle :**
      • Vous pouvez gérer vos préférences via la bannière cookies
      • Modifications possibles à tout moment dans votre profil
      • Suppression des cookies via les paramètres de votre navigateur
      • Désactivation sélective par catégorie
      
      **Durée de conservation :**
      • Cookies de session : supprimés à la fermeture du navigateur
      • Cookies persistants : maximum 13 mois
      • Cookies analytiques : 2 ans maximum
      • Préférences utilisateur : jusqu'à modification
      
      **Cookies tiers :**
      Nous utilisons des services tiers qui peuvent déposer leurs propres cookies :
      • Google Analytics (analyse d'audience)
      • Services de paiement sécurisé
      • Outils de chat en ligne
      • Réseaux sociaux (si vous partagez du contenu)
      
      **Vos droits :**
      • Accepter ou refuser les cookies non-essentiels
      • Modifier vos préférences à tout moment
      • Être informé des cookies utilisés
      • Accéder aux données collectées via cookies`
    },
    {
      id: "securite",
      title: "🔒 Sécurité des données",
      content: `Nous mettons en œuvre des mesures de sécurité avancées :
      
      **Mesures techniques :**
      • Chiffrement SSL/TLS pour tous les échanges
      • Chiffrement des données sensibles en base
      • Authentification à deux facteurs
      • Surveillance 24/7 des accès
      
      **Mesures organisationnelles :**
      • Formation du personnel à la protection des données
      • Politique de sécurité stricte
      • Accès aux données sur principe du besoin d'en connaître
      • Audits de sécurité réguliers
      
      **Hébergement :**
      • Serveurs situés dans l'Union Européenne
      • Centres de données certifiés ISO 27001
      • Sauvegardes chiffrées quotidiennes
      
      **En cas d'incident :**
      Nous nous engageons à vous informer dans les 72h en cas de violation de données vous concernant.`
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-blue-600 font-semibold mb-8 shadow-lg">
              <span className="mr-3">🛡️</span>
              Protection des données personnelles
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-8">
              Politique
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}RGPD
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Nous respectons votre vie privée et nous engageons à protéger vos données personnelles. 
              Découvrez comment nous collectons, utilisons et protégeons vos informations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-sm">
                <span className="mr-2">📅</span>
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-sm">
                <span className="mr-2">⚖️</span>
                Conforme RGPD
              </div>
              <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-sm">
                <span className="mr-2">🇪🇺</span>
                Union Européenne
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">⚡</span>
                Accès rapide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => window.open('mailto:rgpd@plateforme-emploi.fr')}
                  className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-300 text-left"
                >
                  <span className="text-2xl mr-4">📧</span>
                  <div>
                    <div className="font-semibold text-gray-900">Exercer vos droits</div>
                    <div className="text-sm text-gray-600">rgpd@plateforme-emploi.fr</div>
                  </div>
                </button>
                
                <button
                  onClick={() => toggleSection('droits')}
                  className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-300 text-left"
                >
                  <span className="text-2xl mr-4">🛡️</span>
                  <div>
                    <div className="font-semibold text-gray-900">Vos droits RGPD</div>
                    <div className="text-sm text-gray-600">Accès, rectification, suppression...</div>
                  </div>
                </button>
                
                <button
                  onClick={() => toggleSection('cookies')}
                  className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors duration-300 text-left"
                >
                  <span className="text-2xl mr-4">🍪</span>
                  <div>
                    <div className="font-semibold text-gray-900">Gestion des cookies</div>
                    <div className="text-sm text-gray-600">Préférences et paramètres</div>
                  </div>
                </button>
                
                <button
                  onClick={() => window.open('/profile#cookies', '_blank')}
                  className="flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors duration-300 text-left"
                >
                  <span className="text-2xl mr-4">⚙️</span>
                  <div>
                    <div className="font-semibold text-gray-900">Paramètres cookies</div>
                    <div className="text-sm text-gray-600">Modifier vos préférences</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RGPD Sections */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Informations détaillées
            </h2>
            
            <div className="space-y-6">
              {rgpdSections.map((section, index) => (
                <div
                  key={section.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-300"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      {section.title}
                    </h3>
                    <div className={`transform transition-transform duration-300 text-2xl ${
                      activeSection === section.id ? 'rotate-180' : ''
                    }`}>
                      ⬇️
                    </div>
                  </button>
                  
                  {activeSection === section.id && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-6 text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Une question sur vos données ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Notre équipe dédiée à la protection des données est là pour vous aider
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div className="text-3xl mb-4">📧</div>
                <div className="font-semibold mb-2">Email</div>
                <div className="text-blue-100">rgpd@plateforme-emploi.fr</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div className="text-3xl mb-4">⏱️</div>
                <div className="font-semibold mb-2">Délai de réponse</div>
                <div className="text-blue-100">Maximum 1 mois</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div className="text-3xl mb-4">🇫🇷</div>
                <div className="font-semibold mb-2">Support</div>
                <div className="text-blue-100">En français</div>
              </div>
            </div>
            
            <div className="text-blue-100 text-sm">
              Vous pouvez également contacter la CNIL en cas de réclamation : 
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors duration-300 ml-1">
                www.cnil.fr
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
