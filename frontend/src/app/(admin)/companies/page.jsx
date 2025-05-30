import DataTable from '../../../components/admin/DataTable';

const companies = [
  { id: '1', name: 'TechCorp', industry: 'Technology', location: 'Paris' },
  { id: '2', name: 'HealthPlus', industry: 'Healthcare', location: 'Lyon' },
  { id: '3', name: 'EcoBuild', industry: 'Construction', location: 'Marseille' },
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Industry', accessor: 'industry' },
  { header: 'Location', accessor: 'location' },
];

export default function CompaniesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Companies</h1>
      <DataTable columns={columns} data={companies} />
    </div>
  );
}
