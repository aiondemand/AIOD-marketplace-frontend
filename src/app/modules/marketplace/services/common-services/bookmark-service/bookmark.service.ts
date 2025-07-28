import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { UserPurchases } from '@app/shared/models/user.model';
import { UserModel } from '@app/shared/models/user.model';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

const { base, endpoints } = environment.api;

export interface BookmarkBodyRemove {
  identifier: string;
  category: AssetCategory;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHttpHeader(): HttpHeaders {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });

    return headers;
  }

  private parseRequest(items: AssetsPurchase[]): Array<any> {
    return items.map((item) => {
      return {
        identifier: item.identifier,
        name: item.name,
        category: item.category,
        url_metadata: item.urlMetadata,
        price: item.price,
        added_at: item.addedAt,
      };
    });
  }

  private parseResponseAssetsPurchase(data: any): AssetsPurchase {
    return new AssetsPurchase(data);
  }

  private parseResponseUserPurchases(data: any): UserPurchases {
    return new UserPurchases(data.data);
  }

  public getBookmarks(user: UserModel): Observable<AssetsPurchase[]> {
    const url =
      `${base}${endpoints.prefixApiLibraries}${endpoints.librariesAssets}`.replace(
        ':userId',
        user.id,
      );
    return this.http
      .get<any>(url, { headers: this.getHttpHeader() })
      .pipe(
        map((data: any) =>
          data.data.map((item: any) => this.parseResponseAssetsPurchase(item)),
        ),
      );
  }

  public addBookmark(
    user: UserModel,
    items: AssetsPurchase[],
  ): Observable<UserPurchases> {
    const url =
      `${base}${endpoints.prefixApiPayment}${endpoints.payment}`.replace(
        ':userId',
        user.id,
      );
    const params = new HttpParams().set('user_email', user.email);
    const headers = this.getHttpHeader();

    return this.http
      .post<any>(url, this.parseRequest(items), { params, headers })
      .pipe(map((data) => this.parseResponseUserPurchases(data)));
  }

  public deleteBookmark(
    user: UserModel,
    body: BookmarkBodyRemove,
  ): Observable<void> {
    const url =
      `${base}${endpoints.prefixApiLibraries}${endpoints.librariesAssets}`.replace(
        ':userId',
        user.id,
      );
    const httpOptions = {
      headers: this.getHttpHeader(),
      body,
    };
    return this.http.delete<void>(url, httpOptions);
  }
}
