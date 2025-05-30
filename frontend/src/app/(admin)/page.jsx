import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <nav style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <Link
          href="/(admin)/candidates"
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Candidates
        </Link>
        <Link
          href="/(admin)/companies"
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Companies
        </Link>
        <Link
          href="/(admin)/jobs"
          style={{
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Jobs
        </Link>
      </nav>
    </div>
  );
}
