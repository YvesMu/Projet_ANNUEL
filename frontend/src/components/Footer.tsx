import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all duration-300 mb-4 block">
              ProPlatform
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La plateforme professionnelle qui connecte les talents aux meilleures entreprises. 
              Trouvez votre opportunité idéale dès aujourd'hui.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors duration-300">
                🐦
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                💼
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300">
                📧
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  🏠 Accueil
                </Link>
              </li>
              <li>
                <Link href="/offres" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  💼 Offres d'emploi
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link href="/mes-visios" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  📹 Mes Visios
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/create-offer" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  ✨ Créer une offre
                </Link>
              </li>
              <li>
                <Link href="/planifier-visio" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  📅 Planifier un appel
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  🎯 Conseils carrière
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  📈 Formation
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  ❓ Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  📞 Nous contacter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  🔒 Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  📋 Conditions d'utilisation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
            <p className="text-gray-300 mb-6">
              Recevez les dernières offres d'emploi et conseils carrière directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} ProPlatform. Tous droits réservés.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Mentions légales
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Cookies
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Plan du site
                </a>
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <span>🇫🇷 France</span>
              <span className="mx-2">•</span>
              <span>Français</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}