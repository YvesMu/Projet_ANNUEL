import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Banner */}
        <section className="relative px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                Trouvez votre
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}opportunité
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                La plateforme professionnelle qui connecte les talents aux meilleures entreprises. 
                Découvrez des milliers d'opportunités qui correspondent à vos ambitions.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Titre du poste, entreprise ou mot-clé"
                      className="w-full px-6 py-4 text-lg border-none outline-none rounded-xl"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ville, département ou région"
                      className="w-full px-6 py-4 text-lg border-none outline-none rounded-xl"
                    />
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Rechercher
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {["Développeur", "Marketing", "Design", "Commercial", "RH", "Finance"].map((tag) => (
                  <span
                    key={tag}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">25K+</div>
                <div className="text-gray-600">Offres d'emploi</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">15K+</div>
                <div className="text-gray-600">Entreprises</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
                <div className="text-gray-600">Candidats</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-pink-600 mb-2">85%</div>
                <div className="text-gray-600">Taux de réussite</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Explorez par secteur
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { title: "Technologie", jobs: "3,247", icon: "💻", color: "from-blue-500 to-cyan-500" },
                { title: "Design", jobs: "1,832", icon: "🎨", color: "from-purple-500 to-pink-500" },
                { title: "Marketing", jobs: "2,156", icon: "📱", color: "from-green-500 to-emerald-500" },
                { title: "Finance", jobs: "1,643", icon: "💰", color: "from-yellow-500 to-orange-500" },
                { title: "Santé", jobs: "2,891", icon: "🏥", color: "from-red-500 to-rose-500" },
                { title: "Éducation", jobs: "1,234", icon: "📚", color: "from-indigo-500 to-blue-500" },
                { title: "Vente", jobs: "3,567", icon: "🤝", color: "from-teal-500 to-cyan-500" },
                { title: "Logistique", jobs: "987", icon: "🚚", color: "from-gray-500 to-slate-500" },
              ].map((category) => (
                <div
                  key={category.title}
                  className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.jobs} postes</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à décrocher votre prochain emploi ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers de professionnels qui ont trouvé leur opportunité idéale
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg">
                Créer mon CV
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                Parcourir les offres
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
