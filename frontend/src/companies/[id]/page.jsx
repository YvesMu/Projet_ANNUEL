'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const companies = [
  {
    id: '1',
    name: 'Charlie et la Chocolaterie',
    industry: 'Agroalimentaire',
    location: 'Paris',
    description: 'Fabricant mondial de douceurs et confiseries magiques.',
    categories: ['UX/UI', 'Commerce', 'Production'],
  },
  {
    id: '2',
    name: 'TechCorp',
    industry: 'Technologie',
    location: 'Lyon',
    description: 'Entreprise innovante spécialisée dans le cloud et l’IA.',
    categories: ['Développement', 'R&D', 'Marketing'],
  },
];

export default function CompanyProfilePage() {
  const { id } = useParams();
  const company = companies.find(c => c.id === id);

  if (!company) {
    return <div>Entreprise introuvable.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{company.name}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>{company.industry} · {company.location}</p>
      </header>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2>À propos</h2>
        <p>{company.description}</p>
      </section>

      <section>
        <h2>Catégories</h2>
        <ul style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
          {company.categories.map((cat, idx) => (
            <li key={idx} style={{
              background: '#f0f0f0',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
            }}>
              {cat}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
