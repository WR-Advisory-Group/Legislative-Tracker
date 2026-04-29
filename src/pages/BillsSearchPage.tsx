import { useCallback, useEffect, useRef, useState } from 'react';
import { getFilterOptions, searchBills } from '../api/client';
import AdvancedFiltersPanel from '../components/search/AdvancedFiltersPanel';
import InlineSearchBar from '../components/search/InlineSearchBar';
import BillsTable from '../components/table/BillsTable';
import Pagination from '../components/ui/Pagination';
import Banner from '../components/layout/Banner';
import type { Bill, FilterOptions, PaginationMeta, SearchFilters } from '../types/bill';
import { DEFAULT_FILTERS } from '../types/bill';

export default function BillsSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [bills, setBills] = useState<Bill[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, per_page: 50, total: 0, total_pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch filter options once on mount
  useEffect(() => {
    getFilterOptions()
      .then(setFilterOptions)
      .catch(console.error);
  }, []);

  // Fetch bills whenever active filters or page changes
  const fetchBills = useCallback(async (f: SearchFilters, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchBills(f, p);
      setBills(result.data);
      setPagination(result.pagination);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBills(filters, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when page changes
  useEffect(() => {
    fetchBills(filters, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounced search: triggers 400ms after pendingFilters.q changes in the inline bar
  const handleInlineChange = (updated: SearchFilters) => {
    setPendingFilters(updated);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters(updated);
      setPage(1);
      fetchBills(updated, 1);
    }, 400);
  };

  // Explicit search button click (no debounce)
  const handleSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilters(pendingFilters);
    setPage(1);
    fetchBills(pendingFilters, 1);
  };

  // Apply from advanced panel
  const handleApplyFilters = () => {
    setFilters(pendingFilters);
    setPage(1);
    fetchBills(pendingFilters, 1);
  };

  // Reset all
  const handleReset = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchBills(DEFAULT_FILTERS, 1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Banner title="Bills" />

      <main className="flex-1 bg-gray-50 px-4 sm:px-6 lg:px-20 py-8">
        <InlineSearchBar
          filters={pendingFilters}
          onChange={handleInlineChange}
          onSearch={handleSearch}
          onAdvancedOpen={() => setPanelOpen(true)}
          filterOptions={filterOptions}
        />

        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <BillsTable bills={bills} loading={loading} error={error} />
        </div>

        {!loading && !error && pagination.total > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </main>

      <AdvancedFiltersPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApplyFilters}
        onReset={handleReset}
        filterOptions={filterOptions}
      />
    </>
  );
}
