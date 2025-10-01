import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {
  AssetService,
  ParamsReqAsset,
} from '@app/shared/interfaces/asset-service.interface';
import { environment } from '@environments/environment';
import {
  Observable,
  catchError,
  concat,
  forkJoin,
  map,
  of,
  reduce,
} from 'rxjs';
import { chunkArray, removeTrailingSlash } from '../../utils/common.utils';

const { base, endpoints, schemas } = environment.api;
const { baseEnhanced } = environment.enhancedApi;

export abstract class GenericAssetService<T> implements AssetService<T> {
  constructor(
    protected http: HttpClient,
    protected endpoint: string,
  ) {}

  protected abstract parseResponse(item: any): T;

  protected abstract parseRequest(item: T): any;

  private buildHttpParams(paramsAsset: ParamsReqAsset): HttpParams {
    return new HttpParams()
      .set('schema', paramsAsset.schama ?? schemas.aiod)
      .set('offset', paramsAsset.offset)
      .set('limit', paramsAsset.limit);
  }

  public getAssets(paramsAsset: ParamsReqAsset): Observable<T[]> {
    const params = this.buildHttpParams(paramsAsset);
    return this.http
      .get<any[]>(
        `${base}${endpoints.prefixApiAssets}${endpoints.prefixByCategories}${this.endpoint}`,
        { params },
      )
      .pipe(map((items) => items.map((item) => this.parseResponse(item))));
  }

  public getAssetsByPlatform(
    platform: string,
    paramsAsset: ParamsReqAsset,
  ): Observable<T[]> {
    const params = this.buildHttpParams(paramsAsset);
    return this.http
      .get<any[]>(
        `${base}${endpoints.prefixApiAssets}${endpoints.prefixByPlatfoms}/${platform}${this.endpoint}`,
        { params },
      )
      .pipe(map((item) => item.map((item) => this.parseResponse(item))));
  }

  public getAsset(id: string | number): Observable<T> {
    return this.http
      .get<any>(`${base}${endpoints.prefixApiAssets}${this.endpoint}/${id}`)
      .pipe(map((item) => item));
  }

  public getAssetByPlatform(
    id: string | number,
    platform: string,
  ): Observable<T> {
    return this.http
      .get<any>(
        `${base}${endpoints.prefixApiAssets}${endpoints.prefixByPlatfoms}/${platform}${this.endpoint}/${id}`,
      )
      .pipe(map((item) => this.parseResponse(item)));
  }

  public createAsset(asset: T): Observable<T> {
    throw new Error('Method not implemented.');
  }

  public updateAsset(asset: T): Observable<T> {
    throw new Error('Method not implemented.');
  }

  public countAssets(): Observable<number> {
    return this.http.get<number>(
      `${base}${endpoints.prefixApiAssets}${endpoints.prefixCount}${this.endpoint}`,
    );
  }

  public deleteAsset(id: string | number): Observable<void> {
    throw new Error('Method not implemented.');
  }

  public getAssetsByEnhancedSearch(
    searchQuery: string,
    assetType: string,
    topk = 15,
  ): Observable<any> {
    const params = new HttpParams()
      .set('search_query', searchQuery)
      .set('asset_type', assetType)
      .set('topk', topk);

    return this.http
      .post(
        `${endpoints.prefixApiRAIL}${endpoints.enhancedSearch}${endpoints.query}`,
        {},
        {
          observe: 'response',
          responseType: 'text' as 'json',
          params,
        },
      )
      .pipe(
        map((response: HttpResponse<any>) => {
          const locationHeader =
            response.headers.get('Location') ||
            response.headers.get('location');
          if (!locationHeader) {
            throw new Error('Missing Location header in response');
          }
          return locationHeader;
        }),
      );
  }

  public checkEnhancedSearchStatus(
    locationHeader: string,
  ): Observable<{ status: string; result_doc_ids?: string[] }> {
    return this.http.get<{ status: string; result_doc_ids?: string[] }>(
      `${baseEnhanced}${endpoints.enhancedSearch}${removeTrailingSlash(
        locationHeader,
      )}`,
    );
  }

  public getMultipleAssets(ids: string[]): Observable<T[]> {
    const chunkSize = 10;
    const chunks = chunkArray(ids, chunkSize);

    return concat(
      ...chunks.map((chunk) =>
        forkJoin(
          chunk.map((id) =>
            this.getAsset(id).pipe(
              catchError((error) => {
                console.error(`Error fetching asset with ID ${id}:`, error);
                return of(null);
              }),
            ),
          ),
        ).pipe(
          map((results) => results.filter((result) => result !== null) as T[]),
        ),
      ),
    ).pipe(reduce((acc: T[], curr: T[]) => [...acc, ...curr], []));
  }
}
