import type { Committee } from '../../types/committee';
import CommitteesTableRow from './CommitteesTableRow';

interface Props {
  committees: Committee[];
  loading: boolean;
  error: string | null;
}

export default function CommitteesTable({ committees, loading, error }: Props) {
  return (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full table-auto border-collapse divide-y divide-mb-border">
        <thead className="bg-mb-brand">
          <tr>
            {['Code', 'Committee', 'Action'].map(col => (
              <th
                key={col}
                className={`px-4 py-3 text-left text-white font-bold uppercase text-base ${col === 'Action' ? 'min-w-[180px]' : ''}`}
                style={{ letterSpacing: '0.8px' }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={3} className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-4 border-mb-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 mt-3 text-sm">Loading committees...</p>
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={3} className="py-16 text-center text-red-600 text-sm">
                Error: {error}
              </td>
            </tr>
          )}

          {!loading && !error && committees.length === 0 && (
            <tr>
              <td colSpan={3} className="py-16 text-center text-gray-500 text-sm">
                No committees found matching your search criteria.
              </td>
            </tr>
          )}

          {!loading && !error && committees.map((committee, i) => (
            <CommitteesTableRow key={committee.code} committee={committee} isEven={i % 2 === 0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
