import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        ProPlatform
      </Link>
      <nav className="flex gap-4">
        <Link href="/" className="hover:underline">Accueil</Link>
        <Link href="/login" className="hover:underline">Connexion</Link>
        <Link href="/register" className="hover:underline">Inscription</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      </nav>
    </header>
  );
}
