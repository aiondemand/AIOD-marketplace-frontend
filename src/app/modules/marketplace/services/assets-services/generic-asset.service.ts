import { HttpClient, HttpParams } from "@angular/common/http";
import { AssetService, ParamsReqAsset } from "@app/shared/interfaces/asset-service.interface";
import { environment } from "@environments/environment";
import { Observable, map } from "rxjs";

const { base, endpoints, schemas } = environment.api;

export abstract class GenericAssetService<T> implements AssetService<T> {

    constructor(protected http: HttpClient, protected endpoint: string) { }

    protected abstract parseResponse(item: any): T;
    protected abstract parseRequest(item: T): any;

    private buildHttpParams(paramsAsset: ParamsReqAsset): HttpParams {
        return new HttpParams()
            .set('schema', paramsAsset.schama??schemas.aiod)
            .set('offset', paramsAsset.offset)
            .set('limit', paramsAsset.limit);
    }

    public getAssets(paramsAsset: ParamsReqAsset): Observable<T[]> {
        let params = this.buildHttpParams(paramsAsset);
        return this.http.get<any[]>(`${base}${endpoints.prefixApiAssets}${this.endpoint}`, {params}).pipe(map(items => items.map(item => this.parseResponse(item))))
    }
    
    public getAssetsByPlatform(platform: string, paramsAsset: ParamsReqAsset): Observable<T[]> {
        let params = this.buildHttpParams(paramsAsset);
        return this.http.get<any[]>(`${base}${endpoints.prefixApiAssets}${endpoints.prefixByPlatfoms}/${platform}${this.endpoint}`, {params}).pipe(map(item => item.map(item => this.parseResponse(item))))
    }

    public getAsset(id: string | number): Observable<T> {
        return this.http.get<any>(`${base}${endpoints.prefixApiAssets}${this.endpoint}/${id}`).pipe(map(item => this.parseResponse(item)));
    }

    public getAssetByPlatform(id: string | number, platform: string): Observable<T> {
        return this.http.get<any>(`${base}${endpoints.prefixApiAssets}${endpoints.prefixByPlatfoms}/${platform}${this.endpoint}/${id}`).pipe(map(item => this.parseResponse(item)));
    }
    
    public createAsset(asset: T): Observable<T> {
        throw new Error("Method not implemented.");
    }
    
    public updateAsset(asset: T): Observable<T> {
        throw new Error("Method not implemented.");
    }
    
    public countAssets(): Observable<number> {
        return this.http.get<number>(`${base}${endpoints.prefixApiAssets}${endpoints.prefixCount}${this.endpoint}`);
    }
    
    public deleteAsset(id: string | number): Observable<void> {
        throw new Error("Method not implemented.");
    }
}