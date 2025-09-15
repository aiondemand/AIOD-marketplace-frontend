import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { Observable, map, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EXTERNAL_LINKS } from '@app/shared/constants/external-links';

export enum AssetCategoryShort {
  mdl = 'AIModel',
  data = 'Dataset',
  exp = 'Experiment',
  serv = 'Service',
  edu = 'Educational resource',
  pub = 'Publication',
}

interface BookmarkItem {
  resource_identifier: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly BOOKMARKS_URL =
    environment.name === 'dev'
      ? EXTERNAL_LINKS.BOOKMARKS_TEST
      : EXTERNAL_LINKS.BOOKMARKS_PROD;

  private readonly ENDPOINT_MAPPING: { [key: string]: string } = {
    mdl: 'ml_models',
    data: 'datasets',
    exp: 'experiments',
    edu: 'educational_resources',
    pub: 'publications',
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getPrefix(identifier: string): string {
    return identifier.split('_')[0];
  }

  private getEndpoint(prefix: string): string {
    return this.ENDPOINT_MAPPING[prefix] || 'ml_models';
  }

  private getCategoryFromPrefix(prefix: string): string {
    return (
      AssetCategoryShort[prefix as keyof typeof AssetCategoryShort] || 'AIModel'
    );
  }

  private getHttpHeader(): HttpHeaders {
    const authToken = this.authService.getToken();
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
    };

    return new AssetsPurchase(payload);
  }

  public getBookmarks(): Observable<AssetsPurchase[]> {
    return this.http
      .get<BookmarkItem[]>(this.BOOKMARKS_URL, {
        headers: this.getHttpHeader(),
      })
      .pipe(
        map((response: BookmarkItem[]) => {
          const requestData = response.map((item) => {
            const identifier = item.resource_identifier;
            const prefix = this.getPrefix(identifier);
            const endpoint = this.getEndpoint(prefix);
            const url = `https://mylibrary.aiod.eu/api-metadata/${endpoint}/${identifier}`;

            return {
              request: this.http.get<any>(url).pipe(catchError(() => of(item))),
              prefix,
            };
          });

          return forkJoin(requestData.map((rd) => rd.request)).pipe(
            map((responses: any[]) =>
              responses.map((r, i) =>
                this.parseResponseAssetsPurchase(r, requestData[i].prefix),
              ),
            ),
          );
        }),
        catchError((error) => {
          console.error('Error fetching bookmarks:', error);
          return of([]);
        }),
      )
      .pipe(
        map((result) => result as AssetsPurchase[]),
        catchError((error) => {
          console.error('Final error in getBookmarks:', error);
          return of([]);
        }),
      );
  }

  public addBookmark(identifier: string): Observable<string> {
    return this.http.post<any>(this.BOOKMARKS_URL, null, {
      params: new HttpParams().set('resource_identifier', identifier),
      headers: this.getHttpHeader(),
    });
  }

  public deleteBookmark(identifier: string): Observable<string> {
    const params = new HttpParams().set('resource_identifier', identifier);
    return this.http.delete<string>(this.BOOKMARKS_URL, {
      params,
      headers: this.getHttpHeader(),
    });
  }
}
