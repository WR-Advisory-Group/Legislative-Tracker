import { useCallback, useEffect, useRef, useState } from 'react';
import { searchCommittees } from '../api/client';
import Banner from '../components/layout/Banner';
import CommitteesInlineSearchBar from '../components/search/CommitteesInlineSearchBar';
import CommitteesTable from '../components/table/CommitteesTable';
import type { Committee, CommitteeFilters } from '../types/committee';
import { DEFAULT_FILTERS } from '../types/committee';

export default function CommitteesPage() {
  const [filters, setFilters] = useState<CommitteeFilters>(DEFAULT_FILTERS);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCommittees = useCallback(async (f: CommitteeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchCommittees(f);
      setCommittees(result.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load committees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommittees(DEFAULT_FILTERS);
  }, [fetchCommittees]);

  const handleInlineChange = (updated: CommitteeFilters) => {
    setFilters(updated);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCommittees(updated);
    }, 400);
  };

  const handleSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchCommittees(filters);
  };

  return (
    <>
      <Banner title="Committees" />

      <main className="flex-1 bg-gray-50 px-4 sm:px-6 lg:px-20 py-8">
        <CommitteesInlineSearchBar
          filters={filters}
          onChange={handleInlineChange}
          onSearch={handleSearch}
        />

        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CommitteesTable committees={committees} loading={loading} error={error} />
        </div>
      </main>
    </>
  );
}
