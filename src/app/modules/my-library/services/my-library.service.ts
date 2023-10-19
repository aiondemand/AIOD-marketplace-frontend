import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { UserModel } from '@app/shared/models/user.model';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

const { base, endpoints } = environment.api

export interface AssetBodyRemove {
  identifier: string,
  category: AssetCategory
}

@Injectable({
  providedIn: 'root'
})
export class MyLibraryService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHttpHeader(): HttpHeaders {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });

    return headers;
  }

  private parseResponse(data: any): AssetsPurchase {
     return new AssetsPurchase(data);
  }

  public getAssetsPurchased(user: UserModel): Observable<AssetsPurchase[]> {
    const url = `${base}${endpoints.prefixApiLibraries}${endpoints.librariesAssets}`.replace(':userId',user.id);
    return this.http.get<any>(url, {headers: this.getHttpHeader()}).pipe(map((data: any) => data.data.map((item:any) => this.parseResponse(item))));
  }

  public deleteAssetMyLibrary(user: UserModel, body: AssetBodyRemove): Observable<void> {
    const url = `${base}${endpoints.prefixApiLibraries}${endpoints.librariesAssets}`.replace(':userId',user.id);
    const httpOptions = {
      headers: this.getHttpHeader(), 
      body
    }
    return this.http.delete<void>(url, httpOptions);
  }
}
