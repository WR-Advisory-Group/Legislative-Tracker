export interface KeywordGroup {
  label: string;
  keywords: string[];
}

export interface KeywordsResponse {
  groups: KeywordGroup[];
}

export interface ReplaceKeywordsResponse {
  inserted: number;
  groups: KeywordGroup[];
}

export interface KeywordRow {
  keyword: string;
  group: string;
}
