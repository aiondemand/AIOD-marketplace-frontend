import { Observable } from 'rxjs';

export interface ParamsReqAsset {
  offset: number;
  limit: number;
  schama?: string;
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
