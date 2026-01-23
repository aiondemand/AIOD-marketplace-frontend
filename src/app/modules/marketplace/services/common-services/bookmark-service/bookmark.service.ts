import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';
const { base, endpoints } = environment.api;

export enum AssetCategoryShort {
  mdl = 'AIModel',
  data = 'Dataset',
  exp = 'Experiment',
  srvc = 'Service',
  edu = 'Educational resource',
  pub = 'Publication',
  comp = 'Computational asset',
  res = 'Resource Bundle',
  case = 'Success stories',
}

interface BookmarkItem {
  resource_identifier: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly ENDPOINT_MAPPING: { [key: string]: string } = {
    mdl: 'ml_models',
    data: 'datasets',
    exp: 'experiments',
    edu: 'educational_resources',
    pub: 'publications',
    comp: 'computational_assets',
    srvc: 'services',
    res: 'resource_bundles',
    case: 'case_studies',
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getPrefix(identifier: string): string {
    return identifier.split('_')[0];
  }

  private getEndpoint(prefix: string): string {
    return this.ENDPOINT_MAPPING[prefix] || this.ENDPOINT_MAPPING['mdl'];
  }

  private getCategoryFromPrefix(prefix: string): string {
    return (
      AssetCategoryShort[prefix as keyof typeof AssetCategoryShort] ||
      AssetCategoryShort.mdl
    );
  }

  private async getHttpHeader(): Promise<HttpHeaders> {
    const authToken = await this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });
  }

  private parseResponseAssetsPurchase(
    data: any,
    prefix: string,
  ): AssetsPurchase {
    if (!data) {
      return new AssetsPurchase({});
    }

    const payload: any = {
      resource_identifier: data.ai_resource_identifier,
      addedAt: data.created_at,
      category: this.getCategoryFromPrefix(prefix),
      name: data.name || data.category,
      same_as: data.same_as,
    };

    return new AssetsPurchase(payload);
  }

  public async getBookmarks(
    offset = 0,
    limit = 100,
  ): Promise<Observable<AssetsPurchase[]>> {
    const headers = await this.getHttpHeader();

    return this.http
      .get<BookmarkItem[]>(
        `${base}${endpoints.prefixApiAssets}${endpoints.bookmarks}?offset=${offset}&limit=${limit}`,
        {
          headers: headers,
        },
      )
      .pipe(
        switchMap((response: BookmarkItem[]) => {
          if (!response || response.length === 0) {
            return of([]);
          }

          const requests = response.map((item) => {
            const identifier = item.resource_identifier;
            const prefix = this.getPrefix(identifier);
            const endpoint = this.getEndpoint(prefix);
            const url = `${base}${endpoints.prefixApiAssets}/${endpoint}/${identifier}`;

            return {
              request: this.http.get<any>(url).pipe(catchError(() => of(null))),
              prefix,
            };
          });

          return forkJoin(requests.map((rd) => rd.request)).pipe(
            map((responses: any[]) =>
              responses.map((r, i) =>
                this.parseResponseAssetsPurchase(r, requests[i].prefix),
              ),
            ),
          );
        }),
        catchError((error) => {
          console.error('Error fetching bookmarks:', error);
          return of([] as AssetsPurchase[]);
        }),
      );
  }

  public async getBookmarksList(): Promise<Observable<BookmarkItem[]>> {
    const headers = await this.getHttpHeader();

    return this.http.get<BookmarkItem[]>(
      `${base}${endpoints.prefixApiAssets}${endpoints.bookmarks}?offset=0&limit=100`,
      {
        headers: headers,
      },
    );
  }

  public async addBookmark(identifier: string): Promise<Observable<string>> {
    const headers = await this.getHttpHeader();
    return this.http.post<any>(
      `${base}${endpoints.prefixApiAssets}${endpoints.bookmarks}`,
      null,
      {
        params: new HttpParams().set('resource_identifier', identifier),
        headers: headers,
      },
    );
  }

  public async deleteBookmark(identifier: string): Promise<Observable<string>> {
    const params = new HttpParams().set('resource_identifier', identifier);
    const headers = await this.getHttpHeader();

    return this.http.delete<string>(
      `${base}${endpoints.prefixApiAssets}${endpoints.bookmarks}`,
      {
        params,
        headers: headers,
      },
    );
  }
}
