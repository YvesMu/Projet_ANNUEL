import Header from "@/components/Header";

export default function Login() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <form className="flex flex-col gap-4 mt-6 w-80">
          <input type="email" placeholder="Email" className="border p-2 rounded" />
          <input type="password" placeholder="Mot de passe" className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Se connecter
          </button>
        </form>
      </main>
    </>
  );
}
