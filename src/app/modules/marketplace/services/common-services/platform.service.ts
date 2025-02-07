import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "@environments/environment";
import { map, Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(protected http: HttpClient) { }

  private buildHttpParams(params: any): HttpParams {
      return new HttpParams()
          .set('offset', params?.offset)
          .set('limit', params?.limit);
  }

  public getPlatforms(params?: any): Observable<any[]> {
      let httpParams = this.buildHttpParams(params);
      return this.http.get<any[]>(`${base}${endpoints.prefixApiAssets}${endpoints.platforms}`, {...httpParams});
  }
}
