"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import CalendrierVisio from "@/components/Calendrier";

interface VideoCall {
  id: number;
  offre: { id: number; titre: string };
  candidat: { id: number; prenom: string; nom: string };
  professionnel: { id: number; prenom: string; nom: string };
  scheduledAt: string;
  roomUrl: string;
}

export default function MesVisios() {
  const [calls, setCalls] = useState<VideoCall[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCalls = async () => {
      try {
        const res = await fetch("http://localhost:5000/video-call/my-calls", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setCalls(data);
        setFilteredCalls(data);
      } catch (err) {
        console.error(err);
        alert("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [router]);

  useEffect(() => {
    const now = new Date();
    const result = calls.filter((call) => {
      const matchSearch =
        call.offre.titre.toLowerCase().includes(search.toLowerCase()) ||
        call.candidat.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        call.candidat.nom?.toLowerCase().includes(search.toLowerCase()) ||
        call.professionnel.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        call.professionnel.nom?.toLowerCase().includes(search.toLowerCase());

      const scheduledDate = new Date(call.scheduledAt);

      const matchFilter =
        filter === "all" ||
        (filter === "upcoming" && scheduledDate > now) ||
        (filter === "past" && scheduledDate <= now);

      return matchSearch && matchFilter;
    });

    setFilteredCalls(result);
    setCurrentPage(1);
  }, [search, filter, calls]);

  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleJoin = (callId: number) => {
    router.push(`/video-call/${callId}`);
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mes Visios Planifiées</h1>
        <CalendrierVisio />
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="🔍 Rechercher (offre, nom...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full md:w-64"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "upcoming" | "past")}
            className="border px-3 py-1 rounded w-full md:w-48"
          >
            <option value="all">📅 Toutes</option>
            <option value="upcoming">⏳ À venir</option>
            <option value="past">✅ Terminées</option>
          </select>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : filteredCalls.length === 0 ? (
          <p>Aucune visio correspondante.</p>
        ) : (
          <div className="space-y-4">
            {paginatedCalls.map((call) => (
              <div
                key={call.id}
                className="border p-4 rounded bg-white shadow flex justify-between items-center"
              >
                <div>
                  <p><b>Offre :</b> {call.offre.titre}</p>
                  <p><b>Date :</b> {new Date(call.scheduledAt).toLocaleString()}</p>
                  <p><b>Avec :</b> {call.professionnel.prenom} {call.professionnel.nom}</p>
                </div>
                <button
                  onClick={() => handleJoin(call.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Rejoindre
                </button>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ◀ Précédent
              </button>
              <span>
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Suivant ▶
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
