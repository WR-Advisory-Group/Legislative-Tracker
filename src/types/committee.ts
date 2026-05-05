export interface Committee {
  code: string;
  name: string;
  monitor: number;
}

export interface CommitteeFilters {
  q: string;
  monitor: string;
}

export const DEFAULT_FILTERS: CommitteeFilters = {
  q: '',
  monitor: '',
};

export interface CommitteesSearchResponse {
  data: Committee[];
}
