"use client";

import { Suspense } from "react";
import ConfirmAccountContent from "./ConfirmAccountContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ConfirmAccountContent />
    </Suspense>
  );
}
