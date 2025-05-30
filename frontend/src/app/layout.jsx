'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="fr">
      <head>
        <title>AlternancePro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: '#f9f9f9',
        }}
      >
        <header
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#0070f3',
            color: '#fff',
            padding: '10px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 'bold',
              fontSize: 24,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            AlternancePro
          </Link>

          <nav
            style={{
              display: 'flex',
              gap: 20,
              alignItems: 'center',
            }}
            className={menuOpen ? 'nav-open' : ''}
          >
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Accueil
            </Link>
            <Link href="/jobs" style={{ color: 'white', textDecoration: 'none' }}>
              Offres
            </Link>
            <Link href="/candidates" style={{ color: 'white', textDecoration: 'none' }}>
              Candidats
            </Link>
            <Link href="/employers" style={{ color: 'white', textDecoration: 'none' }}>
              Employeurs
            </Link>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Connexion
            </Link>
            <Link
              href="/register"
              style={{
                color: '#0070f3',
                backgroundColor: 'white',
                padding: '6px 12px',
                borderRadius: 4,
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Inscription
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: 28,
              cursor: 'pointer',
              display: 'none',
            }}
            id="burger-button"
          >
            ☰
          </button>
        </header>

        <main
          style={{
            minHeight: 'calc(100vh - 60px)', // assuming header height ~60px
            padding: 30,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>

        <style jsx>{`
          header nav a:hover {
            text-decoration: underline;
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            nav {
              position: fixed;
              top: 60px;
              right: 0;
              background: #0070f3;
              flex-direction: column;
              width: 200px;
              height: calc(100% - 60px);
              padding-top: 20px;
              transform: translateX(100%);
              transition: transform 0.3s ease-in-out;
              z-index: 999;
            }
            nav.nav-open {
              transform: translateX(0);
            }
            nav a {
              padding: 12px 20px;
              display: block;
            }
            #burger-button {
              display: block;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
