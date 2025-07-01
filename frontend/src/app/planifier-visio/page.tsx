"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import PlanifierVisioContent from "./PlanifierVisioContent";

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Chargement...</div>}>
        <PlanifierVisioContent />
      </Suspense>
    </>
  );
}
