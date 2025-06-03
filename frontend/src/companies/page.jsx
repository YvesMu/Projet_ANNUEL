import Link from 'next/link';

const companiesData = [
  { id: '1', name: 'Charlie et la Chocolaterie', industry: 'Agroalimentaire' },
  { id: '2', name: 'TechCorp', industry: 'Technologie' },
];

export default function CompaniesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Nos entreprises</h1>
      <ul>
        {companiesData.map(c => (
          <li key={c.id}>
            <Link href={`/companies/${c.id}`}>
              {c.name} — {c.industry}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
