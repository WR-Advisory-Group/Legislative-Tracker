import type { FilterOptions, SearchFilters } from '../../types/bill';

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onAdvancedOpen: () => void;
  filterOptions: FilterOptions | null;
}

const inputCls =
  'bg-mb-blue-5 border border-mb-border rounded-lg px-4 py-4 h-14 text-mb-text-dark text-base focus:outline-none focus:ring-2 focus:ring-mb-brand w-full';

export default function InlineSearchBar({
  filters,
  onChange,
  onSearch,
  onAdvancedOpen,
  filterOptions,
}: Props) {
  const set = (key: keyof SearchFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Congress select — hidden on mobile */}
        <select
          value={filters.congress}
          onChange={e => set('congress', e.target.value)}
          className={`${inputCls} hidden sm:block sm:w-56`}
        >
          <option value="">All Congresses</option>
          {filterOptions?.congresses.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Type select — hidden on mobile */}
        <select
          value={filters.type}
          onChange={e => set('type', e.target.value)}
          className={`${inputCls} hidden sm:block sm:w-36`}
        >
          <option value="">All Types</option>
          {filterOptions?.types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Search input */}
        <input
          type="text"
          value={filters.q}
          onChange={e => set('q', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by Bill No., Title, Long Title..."
          className={`${inputCls} flex-1`}
        />

        {/* Search button */}
        <button
          onClick={onSearch}
          className="bg-mb-brand hover:bg-mb-brand-dark active:scale-95 text-white font-semibold rounded-lg px-6 py-3 text-base transition-colors whitespace-nowrap"
        >
          🔍 Search
        </button>
      </div>

      {/* Advanced Filters link */}
      <div className="flex justify-end mt-3">
        <button
          onClick={onAdvancedOpen}
          className="text-mb-brand text-sm font-medium hover:bg-mb-blue-10 hover:shadow-sm active:scale-95 px-3 py-1 rounded-lg transition-all flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Advanced Filters
        </button>
      </div>
    </div>
  );
}
