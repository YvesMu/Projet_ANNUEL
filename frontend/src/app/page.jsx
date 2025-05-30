'use client';

import { useState } from 'react';

const mockJobs = [
  { id: 1, title: 'Développeur React Junior', company: 'TechCorp', location: 'Paris', type: 'Alternance' },
  { id: 2, title: 'Assistant Marketing', company: 'MarketPlus', location: 'Lyon', type: 'Stage' },
  { id: 3, title: 'Chargé de Communication', company: 'ComAgency', location: 'Remote', type: 'Alternance' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Alternance');

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterType === 'Tous' || job.type === filterType)
  );

  return (
    <main style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, color: '#0070f3' }}>AlternancePro</h1>
        <nav style={{ display: 'flex', gap: 15 }}>
          <a href="/login" style={{ textDecoration: 'none', color: '#0070f3' }}>
            Connexion
          </a>
          <a href="/register" style={{ textDecoration: 'none', color: '#0070f3' }}>
            Inscription
          </a>
        </nav>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2>Recherchez votre alternance</h2>
        <input
          type="text"
          placeholder="Mot-clé (ex : développeur, marketing...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, width: '100%', marginBottom: 10, fontSize: 16 }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        >
          <option value="Tous">Tous types</option>
          <option value="Alternance">Alternance</option>
          <option value="Stage">Stage</option>
          <option value="CDI">CDI</option>
        </select>
      </section>

      <section style={{ marginBottom: 60 }}>
        <h2>Offres d'alternance récentes</h2>
        {filteredJobs.length === 0 && <p>Aucune offre trouvée.</p>}
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {filteredJobs.map((job) => (
            <li
              key={job.id}
              style={{
                border: '1px solid #ddd',
                padding: 15,
                borderRadius: 6,
                marginBottom: 15,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onClick={() => alert(`Voir détails pour l’offre: ${job.title}`)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <h3 style={{ margin: 0, color: '#0070f3' }}>{job.title}</h3>
              <p style={{ margin: '5px 0' }}>
                {job.company} — {job.location}
              </p>
              <small style={{ color: '#666' }}>{job.type}</small>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 80 }}>
        <div style={{ maxWidth: 400 }}>
          <h3>Candidats</h3>
          <p>
            Trouvez les meilleures offres d’alternance adaptées à votre profil et discutez directement
            avec les employeurs.
          </p>
          <a
            href="/candidates"
            style={{
              display: 'inline-block',
              marginTop: 10,
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: '#fff',
              borderRadius: 5,
              textDecoration: 'none',
            }}
          >
            Espace candidats
          </a>
        </div>

        <div style={{ maxWidth: 400 }}>
          <h3>Employeurs</h3>
          <p>
            Publiez vos offres, trouvez vos futurs talents en alternance et discutez en direct avec eux
            via notre chat intégré.
          </p>
          <a
            href="/employers"
            style={{
              display: 'inline-block',
              marginTop: 10,
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: '#fff',
              borderRadius: 5,
              textDecoration: 'none',
            }}
          >
            Espace employeurs
          </a>
        </div>
      </section>

      <section style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2>Chat & Visio intégrés</h2>
        <p>
          Discutez instantanément avec vos interlocuteurs et lancez une visio sans quitter la plateforme.
          Bientôt disponible !
        </p>
        <button
          disabled
          style={{
            padding: '10px 30px',
            fontSize: 18,
            backgroundColor: '#ccc',
            border: 'none',
            borderRadius: 6,
            cursor: 'not-allowed',
          }}
        >
          Fonctionnalité en développement
        </button>
      </section>

      <footer style={{ borderTop: '1px solid #eee', padding: 20, textAlign: 'center', color: '#666' }}>
        &copy; 2025 AlternancePro - Projet perso
      </footer>
    </main>
  );
}
