import type { CommitteeFilters } from '../../types/committee';

interface Props {
  filters: CommitteeFilters;
  onChange: (filters: CommitteeFilters) => void;
  onSearch: () => void;
}

const inputCls =
  'bg-mb-blue-5 border border-mb-border rounded-lg px-4 py-4 h-14 text-mb-text-dark text-base focus:outline-none focus:ring-2 focus:ring-mb-brand w-full';

export default function CommitteesInlineSearchBar({ filters, onChange, onSearch }: Props) {
  const set = (key: keyof CommitteeFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filters.monitor}
          onChange={e => set('monitor', e.target.value)}
          className={`${inputCls} sm:w-48`}
        >
          <option value="">All Committees</option>
          <option value="1">Monitored</option>
          <option value="0">Not Monitored</option>
        </select>

        <input
          type="text"
          value={filters.q}
          onChange={e => set('q', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by code, committee name, or bill no (e.g. SBN-2052)..."
          className={`${inputCls} flex-1`}
        />

        <button
          onClick={onSearch}
          className="bg-mb-brand hover:bg-mb-brand-dark active:scale-95 text-white font-semibold rounded-lg px-6 py-3 text-base transition-colors whitespace-nowrap"
        >
          🔍 Search
        </button>
      </div>
    </div>
  );
}
