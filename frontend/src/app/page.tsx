import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Accueil - Plateforme Pro</h1>
        <p className="mt-4 text-gray-500">Bienvenue sur notre site d&lsquo;annonces professionnelles.</p>
      </main>
    </>
  );
}
