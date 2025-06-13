"use client";

import dynamic from "next/dynamic";

const OffreDetailClient = dynamic(() => import("./OffreDetailClient"), {
  ssr: false,
});

export default function OffreDetailWrapper() {
  return <OffreDetailClient />;
} 