export interface ParamsReqSearchAsset {
  platforms?: string[];
  searchQuery: string;
  searchFields?: string[];
  limit: number;
  page: number;
  exact_match?: boolean;
}
