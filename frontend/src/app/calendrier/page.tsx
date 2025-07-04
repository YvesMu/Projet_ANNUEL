"use client";

import Header from "@/components/Header";
import CalendrierInteractif from "@/components/CalendrierInteractif";

export default function CalendrierPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Hero Section - Style identique à la page principale */}
                <section className="relative px-6 py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center">
                            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                                Gérez vos
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {" "}visioconférences
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Planifiez, organisez et suivez tous vos entretiens vidéo en un seul endroit. 
                                Une interface intuitive pour une gestion optimale de votre temps.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Calendar Section */}
                <section className="pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <CalendrierInteractif />
                    </div>
                </section>
            </main>
        </>
    );
}