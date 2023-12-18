import { Injectable } from '@angular/core';
import { environment } from "@environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from 'rxjs';
import { SearchModel } from '@app/shared/models/search.model';
import { ParamsReqSearchAsset } from "@app/shared/interfaces/search-service.interface";
import { AssetCategory } from '@app/shared/models/asset-category.model';

const { base, endpoints } = environment.api

@Injectable({
  providedIn: 'root'
})

export class ElasticSearchService {
  constructor(private http: HttpClient) {}

  private buildParamsSearch(paramsSearch: ParamsReqSearchAsset): HttpParams {
    let params = new HttpParams()
      .set('page', paramsSearch.page)
      .set('limit', paramsSearch.limit)
      .set('search_query',paramsSearch.searchQuery);
      if(paramsSearch.platforms && paramsSearch.platforms.length > 0) {
        paramsSearch.platforms.forEach(platform => params = params.append('platforms', platform));
      }
      if (paramsSearch.searchFields && paramsSearch.searchFields.length > 0) {
        paramsSearch.searchFields?.forEach(field => params = params.append('search_fields', field));
      }   
    return params;
  }

  private getEndpoint(assetCategory: AssetCategory): string {
    switch(assetCategory) {
        case AssetCategory.Dataset:
            return endpoints.datasets;
        case AssetCategory.Service: 
            return endpoints.services;
        case AssetCategory.Experiment:
            return endpoints.expetiments;
        case AssetCategory.AIModel:
            return endpoints.aimodels;
        default:
            throw new Error('Does not exit category selected');
    }
  }

  public getAssetBySearch(paramsSearch: ParamsReqSearchAsset, assetCategory: AssetCategory): Observable<SearchModel>{
    const endpoint = this.getEndpoint(assetCategory);
    const params = this.buildParamsSearch(paramsSearch);
    const url = `${base}${endpoints.prefixApiAssets}${endpoints.search}${endpoint}`;
    return this.http.get<SearchModel>(url,{params}).pipe(map((data: any) => new SearchModel(data, assetCategory)));
  }

}
