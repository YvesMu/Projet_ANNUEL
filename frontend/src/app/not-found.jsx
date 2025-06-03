'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#1f2937' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#4b5563' }}>Oups ! Cette page n'existe pas.</p>
      <p style={{ marginTop: '1rem', color: '#6b7280' }}>
        Il semble que vous soyez perdu. Pas de souci, on va vous ramener à l'accueil !
      </p>
      <Link
        href="/"
        style={{
          marginTop: '2rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '500',
        }}
      >
        Revenir à l'accueil
      </Link>
    </div>
  );
}
