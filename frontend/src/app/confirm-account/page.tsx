"use client";

import { Suspense } from "react";
import ConfirmAccountContent from "./ConfirmAccountContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Chargement...
            </h2>
            <p className="text-gray-600">
              Préparation de la page de confirmation
            </p>
          </div>
        </div>
      }
    >
      <ConfirmAccountContent />
    </Suspense>
  );
}
