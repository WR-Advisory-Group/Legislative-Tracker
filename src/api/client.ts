import axios from 'axios';
import type { BillsSearchResponse, FilterOptions, SearchFilters } from '../types/bill';
import type { KeywordRow, KeywordsResponse, ReplaceKeywordsResponse } from '../types/keyword';

const api = axios.create({
  baseURL: '/api',  // Vite proxy handles /api -> http://localhost:4568
});

export async function searchBills(
  filters: SearchFilters,
  page: number,
  perPage = 50,
): Promise<BillsSearchResponse> {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (filters.q) params.q = filters.q;
  if (filters.congress) params.congress = filters.congress;
  if (filters.type) params.type = filters.type;
  if (filters.monitor) params.monitor = filters.monitor;
  if (filters.author) params.author = filters.author;
  if (filters.primary_committee) params.primary_committee = filters.primary_committee;
  if (filters.legislative_status) params.legislative_status = filters.legislative_status;
  if (filters.sort_by) params.sort_by = filters.sort_by;
  if (filters.sort_order) params.sort_order = filters.sort_order;

  const { data } = await api.get<BillsSearchResponse>('/bills/search', { params });
  return data;
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const { data } = await api.get<FilterOptions>('/bills/filter-options');
  return data;
}

export async function getKeywords(): Promise<KeywordsResponse> {
  const { data } = await api.get<KeywordsResponse>('/keywords');
  return data;
}

export async function replaceKeywords(rows: KeywordRow[]): Promise<ReplaceKeywordsResponse> {
  const { data } = await api.post<ReplaceKeywordsResponse>('/keywords/replace', { keywords: rows });
  return data;
}

export async function setBillMonitor(id: number, monitor: 0 | 1): Promise<void> {
  await api.patch(`/bills/${id}/monitor`, { monitor });
}
