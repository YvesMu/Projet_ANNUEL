"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Offre {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  typeContrat: string;
  lieu: string;
  salaire: string;
  createdAt: string;
}

export default function Home() {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [offres, setOffres] = useState<Offre[]>([]);
  const [stats, setStats] = useState({
    totalOffres: 0,
    totalEntreprises: 0,
    totalCandidats: 0,
    tauxReussite: 85
  });
  const router = useRouter();

  useEffect(() => {
    // Charger les offres pour les stats réelles
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/offres`)
      .then(res => res.json())
      .then((data: Offre[]) => {
        if (Array.isArray(data)) {
          setOffres(data);
          setStats(prev => ({
            ...prev,
            totalOffres: data.length,
            totalEntreprises: new Set(data.map(o => o.domaine)).size * 150, // Estimation
            totalCandidats: data.length * 45 // Estimation
          }));
        }
      })
      .catch(err => console.error("Erreur stats:", err));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTitle) params.append('search', searchTitle);
    if (searchLocation) params.append('location', searchLocation);
    router.push(`/offres?${params.toString()}`);
  };

  const handleQuickFilter = (filter: string) => {
    router.push(`/offres?search=${encodeURIComponent(filter)}`);
  };
  return (
    <>
      <Header />
      {/* Hero Section */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Banner */}
        <section className="relative px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="text-center">
              {/* Badge animé */}
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-blue-600 font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-ping"></span>
                ✨ Nouvelle plateforme améliorée
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                Trouvez votre
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  {" "}opportunité
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                La plateforme professionnelle qui connecte les talents aux meilleures entreprises. 
                Découvrez des milliers d'opportunités qui correspondent à vos ambitions.
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 scale-105"></div>
                  <div className="relative flex flex-col sm:flex-row gap-4 p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300">
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <input
                        type="text"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Titre du poste, entreprise ou mot-clé"
                        className="w-full pl-14 pr-6 py-4 text-lg border-none outline-none rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-2xl">📍</span>
                      </div>
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Ville, département ou région"
                        className="w-full pl-14 pr-6 py-4 text-lg border-none outline-none rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      <span className="relative flex items-center">
                        <span className="mr-2">🚀</span>
                        Rechercher
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {[
                  { name: "Développeur", icon: "💻", color: "hover:bg-blue-50 hover:border-blue-300" },
                  { name: "Marketing", icon: "📱", color: "hover:bg-green-50 hover:border-green-300" },
                  { name: "Design", icon: "🎨", color: "hover:bg-purple-50 hover:border-purple-300" },
                  { name: "Commercial", icon: "🤝", color: "hover:bg-orange-50 hover:border-orange-300" },
                  { name: "RH", icon: "👥", color: "hover:bg-pink-50 hover:border-pink-300" },
                  { name: "Finance", icon: "💰", color: "hover:bg-yellow-50 hover:border-yellow-300" },
                ].map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleQuickFilter(tag.name)}
                    className={`px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 ${tag.color} cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md flex items-center font-medium`}
                  >
                    <span className="mr-2">{tag.icon}</span>
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-16 bg-white/60 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Des chiffres qui parlent
              </h2>
              <p className="text-gray-600">Notre plateforme en quelques statistiques impressionnantes</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group p-6 bg-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                  💼
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2 counter" data-target={stats.totalOffres}>
                  {stats.totalOffres.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Offres d'emploi</div>
              </div>
              <div className="group p-6 bg-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                  🏢
                </div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {Math.floor(stats.totalEntreprises/1000)}K+
                </div>
                <div className="text-gray-600 font-medium">Entreprises partenaires</div>
              </div>
              <div className="group p-6 bg-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                  👨‍💼
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.floor(stats.totalCandidats/1000)}K+
                </div>
                <div className="text-gray-600 font-medium">Candidats actifs</div>
              </div>
              <div className="group p-6 bg-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                  ⭐
                </div>
                <div className="text-4xl font-bold text-pink-600 mb-2">{stats.tauxReussite}%</div>
                <div className="text-gray-600 font-medium">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Categories */}
        <section className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Explorez par secteur
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez les opportunités dans votre domaine d'expertise et explorez de nouveaux horizons professionnels
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Technologie", jobs: "3,247", icon: "💻", color: "from-blue-500 to-cyan-500", bg: "hover:bg-blue-50" },
                { title: "Design", jobs: "1,832", icon: "🎨", color: "from-purple-500 to-pink-500", bg: "hover:bg-purple-50" },
                { title: "Marketing", jobs: "2,156", icon: "📱", color: "from-green-500 to-emerald-500", bg: "hover:bg-green-50" },
                { title: "Finance", jobs: "1,643", icon: "💰", color: "from-yellow-500 to-orange-500", bg: "hover:bg-yellow-50" },
                { title: "Santé", jobs: "2,891", icon: "🏥", color: "from-red-500 to-rose-500", bg: "hover:bg-red-50" },
                { title: "Éducation", jobs: "1,234", icon: "📚", color: "from-indigo-500 to-blue-500", bg: "hover:bg-indigo-50" },
                { title: "Vente", jobs: "3,567", icon: "🤝", color: "from-teal-500 to-cyan-500", bg: "hover:bg-teal-50" },
                { title: "Logistique", jobs: "987", icon: "🚚", color: "from-gray-500 to-slate-500", bg: "hover:bg-gray-50" },
              ].map((category, index) => (
                <div
                  key={category.title}
                  onClick={() => handleQuickFilter(category.title)}
                  className={`group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 transform hover:scale-105 ${category.bg}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300">{category.title}</h3>
                  <p className="text-gray-600 mb-3">{category.jobs} postes disponibles</p>
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="mr-2">👀</span>
                    Voir les offres
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-semibold mb-8 shadow-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              🎯 Rejoignez notre communauté
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à décrocher votre prochain emploi ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Rejoignez des milliers de professionnels qui ont trouvé leur opportunité idéale grâce à notre plateforme innovante
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => router.push('/register')}
                className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="relative flex items-center">
                  <span className="mr-2">📝</span>
                  Créer mon profil
                </span>
              </button>
              <button 
                onClick={() => router.push('/offres')}
                className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="relative flex items-center">
                  <span className="mr-2">🔍</span>
                  Parcourir les offres
                </span>
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⭐</span>
                <span>4.9/5 satisfaction</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Données sécurisées</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⚡</span>
                <span>Matching instantané</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </section>

        {/* New Testimonials Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ce que disent nos utilisateurs
              </h2>
              <p className="text-xl text-gray-600">Découvrez les témoignages de ceux qui ont trouvé leur emploi idéal</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Marie Dubois",
                  role: "Développeuse Full Stack",
                  company: "TechCorp",
                  avatar: "👩‍💻",
                  text: "Grâce à cette plateforme, j'ai trouvé le poste de mes rêves en moins de 2 semaines ! Le processus est fluide et les recommandations sont parfaites.",
                  rating: 5
                },
                {
                  name: "Thomas Martin",
                  role: "Designer UX/UI",
                  company: "CreativeStudio",
                  avatar: "👨‍🎨",
                  text: "Interface intuitive, offres de qualité et suivi personnalisé. Je recommande vivement cette plateforme à tous les professionnels en recherche.",
                  rating: 5
                },
                {
                  name: "Sophie Leroux",
                  role: "Chef de Projet Marketing",
                  company: "MarketingPro",
                  avatar: "👩‍💼",
                  text: "Excellent service ! Les outils de matching m'ont permis de cibler exactement les opportunités qui correspondaient à mes attentes.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role} chez {testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom CSS for animations */}
        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          
          .hover\\:shadow-3xl:hover {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
          
          .counter {
            animation: countUp 2s ease-out;
          }
          
          @keyframes countUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
