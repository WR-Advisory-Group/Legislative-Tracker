import type { Bill } from '../../types/bill';
import BillsTableRow from './BillsTableRow';

interface Props {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  committeeNames: string[];
}

export default function BillsTable({ bills, loading, error, committeeNames }: Props) {
  return (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full table-auto border-collapse divide-y divide-mb-border">
        <thead className="bg-mb-brand">
          <tr>
            {['Bill No.', 'Title / Subject (Status)', 'Status Date', 'Committee', 'Date Filed', 'Author', 'Action'].map(col => (
              <th
                key={col}
                className={`px-4 py-3 text-left text-white font-bold uppercase text-xs ${col === 'Action' ? 'w-[120px]' : ''}`}
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
              <td colSpan={7} className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-4 border-mb-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 mt-3 text-sm">Loading bills...</p>
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} className="py-16 text-center text-red-600 text-sm">
                Error: {error}
              </td>
            </tr>
          )}

          {!loading && !error && bills.length === 0 && (
            <tr>
              <td colSpan={7} className="py-16 text-center text-gray-500 text-sm">
                No bills found matching your search criteria.
              </td>
            </tr>
          )}

          {!loading && !error && bills.map((bill, i) => (
            <BillsTableRow key={bill.id} bill={bill} isEven={i % 2 === 0} committeeNames={committeeNames} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
