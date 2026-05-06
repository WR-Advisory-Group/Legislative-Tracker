export interface Bill {
  id: number;
  type: string | null;
  no: string | null;
  title: string | null;
  longTitle: string | null;
  dateFiled: string | null;
  author: string | null;
  coAuthor: string | null;
  primaryCommittee: string | null;
  secondaryCommittee: string | null;
  legislativeStatus: string | null;
  legislativeStatusDate: string | null;
  pdfUrl: string | null;
  congress: string | null;
  permalink: string | null;
  monitor: number;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface BillsSearchResponse {
  data: Bill[];
  pagination: PaginationMeta;
}

export interface FilterOptions {
  congresses: string[];
  types: string[];
  primary_committees: string[];
  legislative_statuses: string[];
  authors: string[];
  committee_names: string[];
}

export interface Committee {
  code: string;
  name: string;
  monitor: number;
}

export interface CommitteesSearchResponse {
  data: Committee[];
}
