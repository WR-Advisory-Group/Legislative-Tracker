import type { FilterOptions, SearchFilters } from '../../types/bill';

interface Props {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onApply: () => void;
  onReset: () => void;
  filterOptions: FilterOptions | null;
}

const labelCls = 'block text-mb-text-dark text-sm font-semibold mb-1';
const inputCls =
  'w-full bg-white border-[1.6px] border-mb-border rounded-lg px-4 py-2.5 h-12 text-mb-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-mb-brand';

const SORT_OPTIONS = [
  { value: 'dateFiled', label: 'Date Filed' },
  { value: 'no', label: 'Bill Number' },
  { value: 'title', label: 'Title' },
  { value: 'legislativeStatusDate', label: 'Status Date' },
];

export default function AdvancedFiltersPanel({
  open,
  onClose,
  filters,
  onChange,
  onApply,
  onReset,
  filterOptions,
}: Props) {
  const set = (key: keyof SearchFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 left-0 h-full w-2/3 max-w-lg z-50 overflow-y-auto shadow-2xl
          bg-gradient-to-b from-slate-50 to-slate-100
          transform transition-transform duration-300 ease-out`}
        style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* Header */}
        <div className="bg-mb-brand px-6 py-4 flex justify-between items-center">
          <span className="text-white font-bold text-lg">Filters</span>
          <button
            onClick={onClose}
            className="text-white p-2 rounded-lg hover:bg-mb-brand-dark transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase text-slate-900" style={{ letterSpacing: '0.35px' }}>
            Document Filters
          </h3>

          {/* 1. Bill No / Title */}
          <div>
            <label className={labelCls}>Bill No. / Title</label>
            <input
              type="text"
              value={filters.q}
              onChange={e => set('q', e.target.value)}
              placeholder="Search..."
              className={inputCls}
            />
          </div>

          {/* 2. Congress */}
          <div>
            <label className={labelCls}>Congress</label>
            <select value={filters.congress} onChange={e => set('congress', e.target.value)} className={inputCls}>
              <option value="">All Congresses</option>
              {filterOptions?.congresses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 3. Type */}
          <div>
            <label className={labelCls}>Type</label>
            <select value={filters.type} onChange={e => set('type', e.target.value)} className={inputCls}>
              <option value="">All Types</option>
              {filterOptions?.types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* 4. Author / Sponsor */}
          <div>
            <label className={labelCls}>Author / Sponsor</label>
            <select value={filters.author} onChange={e => set('author', e.target.value)} className={inputCls}>
              <option value="">All Authors</option>
              {filterOptions?.authors.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* 5. Primary Committee */}
          <div>
            <label className={labelCls}>Primary Committee</label>
            <select value={filters.primary_committee} onChange={e => set('primary_committee', e.target.value)} className={inputCls}>
              <option value="">All Committees</option>
              {filterOptions?.primary_committees.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 6. Legislative Status */}
          <div>
            <label className={labelCls}>Legislative Status</label>
            <select value={filters.legislative_status} onChange={e => set('legislative_status', e.target.value)} className={inputCls}>
              <option value="">All Statuses</option>
              {filterOptions?.legislative_statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* 7. Sort By */}
          <div>
            <label className={labelCls}>Sort By</label>
            <select value={filters.sort_by} onChange={e => set('sort_by', e.target.value)} className={inputCls}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* 8. Sort Order — toggle button */}
          <div>
            <label className={labelCls}>Sort Order</label>
            <button
              onClick={() => set('sort_order', filters.sort_order === 'ASC' ? 'DESC' : 'ASC')}
              className={`${inputCls} flex items-center justify-between cursor-pointer`}
            >
              <span>{filters.sort_order === 'ASC' ? 'Ascending' : 'Descending'}</span>
              <span className="text-mb-brand">{filters.sort_order === 'ASC' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-6 flex flex-col gap-3">
          <button
            onClick={() => { onApply(); onClose(); }}
            className="w-full bg-mb-brand hover:bg-mb-brand-dark text-white rounded-lg py-3 px-4 font-semibold transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={() => { onReset(); onClose(); }}
            className="w-full bg-white border-2 border-slate-300 text-slate-700 rounded-lg py-3 px-4 font-semibold hover:bg-slate-50 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </>
  );
}
