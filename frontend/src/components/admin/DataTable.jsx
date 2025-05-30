// src/components/admin/DataTable.jsx
export default function DataTable({ columns, data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.accessor}
              style={{ borderBottom: '2px solid #ddd', padding: 8, textAlign: 'left' }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} style={{ padding: 10, textAlign: 'center' }}>
              No data available.
            </td>
          </tr>
        )}
        {data.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
            {columns.map((col) => (
              <td key={col.accessor} style={{ padding: 8 }}>
                {row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
