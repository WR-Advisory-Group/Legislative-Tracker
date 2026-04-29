import type { PaginationMeta } from '../../types/bill';

interface Props {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
  const { page, total_pages, total, per_page } = pagination;
  const start = (page - 1) * per_page + 1;
  const end = Math.min(page * per_page, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 px-1">
      <p className="text-gray-500 text-sm">
        Showing <span className="font-semibold text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-semibold text-gray-700">{total.toLocaleString()}</span> bills
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="bg-mb-brand text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mb-brand-dark transition-colors"
        >
          ← Prev
        </button>

        <span className="text-gray-700 text-sm font-medium px-2">
          Page {page} of {total_pages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          className="bg-mb-brand text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mb-brand-dark transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
