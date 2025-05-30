'use client';

import { useState, useEffect } from 'react';

const mockJobs = [
  {
    id: 1,
    title: "Développeur Frontend React",
    company: "TechCorp",
    location: "Paris",
    description: "Nous cherchons un développeur React passionné qui aime relever des défis techniques et créer des interfaces élégantes.",
  },
  {
    id: 2,
    title: "Alternant Marketing Digital",
    company: "MarketPlus",
    location: "Lyon",
    description: "Rejoignez notre équipe marketing en pleine croissance pour apprendre les meilleures stratégies digitales et développer vos compétences.",
  },
  {
    id: 3,
    title: "Data Analyst Junior",
    company: "DataInsights",
    location: "Remote",
    description: "Analyser les données clients et produire des rapports clairs pour guider les décisions stratégiques de l'entreprise.",
  },
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  // Quand selectedJob change, lance l'animation fade-in sur la colonne de détails
  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => setFadeIn(true), 10); // léger délai pour reset animation
    return () => clearTimeout(timeout);
  }, [selectedJob]);

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 60px)',
        backgroundColor: '#f9faff',
        boxShadow: '0 2px 15px rgba(0,0,0,0.07)',
        borderRadius: 16,
        overflow: 'hidden',
        margin: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Colonne gauche - TAILLE FIXE */}
      <div
        style={{
          width: '400px', // Largeur fixe au lieu de 40%
          minWidth: '400px', // Largeur minimale
          maxWidth: '400px', // Largeur maximale
          borderRight: '1.5px solid #dde3f0',
          backgroundColor: '#fff',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            padding: '25px 30px',
            borderBottom: '1px solid #dde3f0',
            fontWeight: '700',
            fontSize: 22,
            color: '#333',
            userSelect: 'none',
          }}
        >
          Offres d&apos;alternance
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {mockJobs.map((job) => (
            <li
              key={job.id}
              onClick={() => setSelectedJob(job)}
              style={{
                height: '110px', // Hauteur fixe
                minHeight: '110px', // Hauteur minimale
                maxHeight: '110px', // Hauteur maximale
                padding: '18px 30px',
                cursor: 'pointer',
                backgroundColor: selectedJob?.id === job.id ? '#4f7fff' : 'transparent',
                color: selectedJob?.id === job.id ? 'white' : '#344055',
                borderBottom: '1px solid #f0f3ff',
                borderRadius: '0 20px 20px 0', // Toujours le même radius
                transition: 'background-color 0.3s ease, color 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box', // Important pour inclure padding/border dans la taille
              }}
              onMouseEnter={(e) => {
                if (selectedJob?.id !== job.id)
                  e.currentTarget.style.backgroundColor = '#f0f5ff';
              }}
              onMouseLeave={(e) => {
                if (selectedJob?.id !== job.id)
                  e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <strong style={{ fontSize: 16 }}>{job.title}</strong>
              <div
                style={{
                  fontSize: 14,
                  color: selectedJob?.id === job.id ? '#d0d9ff' : '#64748b',
                  marginTop: 4,
                  fontWeight: '500',
                }}
              >
                {job.company} — {job.location}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Colonne droite - TAILLE FLEXIBLE MAIS STABLE */}
      <div
        style={{
          flex: '1', // Prend le reste de l'espace disponible
          minWidth: '0', // Permet la flexibilité
          padding: '40px 50px',
          backgroundColor: '#fff',
          overflowY: 'auto',
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(15px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          borderRadius: '0 16px 16px 0',
          boxShadow: 'inset 0 0 10px #f0f5ff',
          height: '100%',
          boxSizing: 'border-box', // Important pour inclure padding dans la taille
        }}
      >
        {!selectedJob ? (
          <div
            style={{
              color: '#a0a7b7',
              fontSize: 20,
              textAlign: 'center',
              marginTop: 120,
              fontStyle: 'italic',
              userSelect: 'none',
            }}
          >
            Cliquez sur une offre à gauche pour voir les détails
          </div>
        ) : (
          <>
            <h1
              style={{
                marginBottom: 12,
                fontSize: 28,
                color: '#2a2a86',
                fontWeight: '700',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {selectedJob.title}
            </h1>
            <h3
              style={{
                marginTop: 0,
                color: '#4f7fff',
                fontWeight: '600',
                fontSize: 18,
                marginBottom: 20,
              }}
            >
              {selectedJob.company} — {selectedJob.location}
            </h3>
            <p
              style={{
                marginTop: 10,
                lineHeight: 1.7,
                fontSize: 16,
                color: '#444',
                whiteSpace: 'pre-line',
              }}
            >
              {selectedJob.description}
            </p>
            <button
              onClick={() => alert(`Postuler pour l'offre: ${selectedJob.title}`)}
              style={{
                marginTop: 35,
                backgroundColor: '#4f7fff',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 30,
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: 16,
                boxShadow: '0 6px 12px rgba(79, 127, 255, 0.5)',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3560d8';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(53, 96, 216, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4f7fff';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(79, 127, 255, 0.5)';
              }}
            >
              Postuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}