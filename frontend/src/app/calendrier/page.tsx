"use client";

import Header from "@/components/Header";
import CalendrierInteractif from "@/components/CalendrierInteractif";

export default function CalendrierPage() {
    return (
        <>
            <Header />
            <main className="p-4 max-w-6x1 mx-auto">
                <h1 className="text-3xl font-bold mb-6">📅 Mon Calendrier</h1>
                <CalendrierInteractif />
            </main>
        </>
    );
}