/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Désactiver TypeScript errors pendant le build (optionnel)
  typescript: {
    ignoreBuildErrors: false, // Gardez false si vous voulez vérifier TypeScript
  },
  
  // Configuration pour Docker
  output: 'standalone',
  
  // Configuration des images
  images: {
    domains: ['localhost', 'proplatform.com'],
    unoptimized: true, // Pour éviter les problèmes d'optimisation d'images
  },
  
  // Désactiver la télémétrie
  experimental: {
    telemetry: false,
  },
}

module.exports = nextConfig