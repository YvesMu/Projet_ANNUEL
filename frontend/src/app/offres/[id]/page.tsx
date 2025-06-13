// Pas de "use client" ici !
import dynamic from "next/dynamic";

// ➕ Le composant client dynamique (sans SSR)
const OffreDetail = dynamic(() => import("./OffreDetailClient"), {
  ssr: false,
});

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  return <OffreDetail />;
}
