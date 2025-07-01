"use client";

import dynamic from "next/dynamic";

const GestionCandidaturesClient = dynamic(() => import("./GestionCandidaturesClient"), {
  ssr: false,
});

export default function GestionCandidaturesWrapper() {
  return <GestionCandidaturesClient />;
} 