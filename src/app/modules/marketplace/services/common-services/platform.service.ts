import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(protected http: HttpClient) {}

  private buildHttpParams(params: any): HttpParams {
    return new HttpParams()
      .set('offset', params?.offset || 0)
      .set('limit', params?.limit || 1000);
  }

  public getPlatforms(paramsPlatform?: any): Observable<any[]> {
    const params = this.buildHttpParams(paramsPlatform);
    return this.http.get<any[]>(
      `${base}${endpoints.prefixApiAssets}${endpoints.platforms}`,
      { params },
    );
  }
}
