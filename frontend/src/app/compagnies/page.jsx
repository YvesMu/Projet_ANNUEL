'use client';

import { useState } from 'react';
import CompanyCard from '../../components/company/CompanyCard';
import { useRouter } from 'next/navigation';

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
    description: "Entreprise innovante spécialisée dans le cloud et l’IA.",
    categories: ['Développement', 'R&D', 'Marketing'],
  },
  {
    id: '3',
    name: 'EcoBuild',
    industry: 'Construction',
    location: 'Marseille',
    description: 'Solutions durables pour la construction écologique.',
    categories: ['Architecture', 'Chantiers', 'Finance'],
  },
];

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const router = useRouter();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Liste des entreprises */}
      <div style={{
        width: '40%',
        borderRight: '1px solid #eee',
        overflowY: 'auto',
        padding: '1rem',
        background: '#f9fafb'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Entreprises disponibles</h2>
        {companies.map(company => (
          <div key={company.id} onClick={() => setSelectedCompany(company)}>
            <CompanyCard company={company} selected={selectedCompany?.id === company.id} />
          </div>
        ))}
      </div>

      {/* Profil sélectionné */}
      <div style={{ flex: 1, padding: '2rem' }}>
        {selectedCompany ? (
          <>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedCompany.name}</h1>
            <p style={{ color: '#555' }}>{selectedCompany.industry} · {selectedCompany.location}</p>
            <p style={{ margin: '1rem 0' }}>{selectedCompany.description}</p>

            <h3>Catégories</h3>
            <ul style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
              {selectedCompany.categories.map((cat, i) => (
                <li key={i} style={{
                  background: '#e0e7ff',
                  color: '#1e3a8a',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                }}>
                  {cat}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push(`/companies/${selectedCompany.id}`)}
              style={{
                marginTop: '2rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              En savoir plus
            </button>
          </>
        ) : (
          <p>Sélectionnez une entreprise pour voir son profil.</p>
        )}
      </div>
    </div>
  );
}
