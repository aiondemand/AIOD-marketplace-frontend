import { SortField, SortOrder } from './asset-service.interface';

export interface ParamsReqSearchAsset {
  platforms?: string[];
  searchQuery: string;
  searchFields?: string[];
  limit: number;
  page: number;
  exact_match?: boolean;
  sort_field?: SortField;
  sort_order?: SortOrder;
}
