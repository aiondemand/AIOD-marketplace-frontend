import { Observable } from 'rxjs';

export enum SortField {
  DateModified = 'date_modified',
  DateCreated = 'date_created',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ParamsReqAsset {
  offset: number;
  limit: number;
  schema?: string;
  sort_field?: SortField;
  sort_order?: SortOrder;
}

export interface AssetService<T> {
  getAssetsByPlatform(
    platform: string,
    paramsAsset: ParamsReqAsset,
  ): Observable<T[]>;
  getAssetByPlatform(id: string | number, platform: string): Observable<T>;
  getAssets(params: ParamsReqAsset): Observable<T[]>;
  getAsset(id: number | string): Observable<T>;
  countAssets(): Observable<number>;

  createAsset(asset: T): Observable<T>;
  updateAsset(asset: T): Observable<T>;
  deleteAsset(id: number | string): Observable<void>;
}
