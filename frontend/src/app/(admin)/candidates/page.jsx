import DataTable from '../../../components/admin/DataTable';

const candidates = [
  { id: '1', name: 'Alice Dupont', email: 'alice@example.com', skills: 'React, Node.js' },
  { id: '2', name: 'Bob Martin', email: 'bob@example.com', skills: 'Java, Spring' },
  { id: '3', name: 'Claire Lemoine', email: 'claire@example.com', skills: 'Python, Django' },
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Skills', accessor: 'skills' },
];

export default function CandidatesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Candidates</h1>
      <DataTable columns={columns} data={candidates} />
    </div>
  );
}
