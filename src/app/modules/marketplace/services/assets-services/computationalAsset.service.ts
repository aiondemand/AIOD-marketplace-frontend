import { GenericAssetService } from "./generic-asset.service";
import { environment } from "@environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ComputationalAssetModel } from "@app/shared/models/computationalAsset.model";

const { endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ComputationalAssetService extends GenericAssetService<ComputationalAssetModel> {
    constructor(http: HttpClient) {
        super(http, endpoints.computationalAssets);
    }

    protected parseResponse(item: any): ComputationalAssetModel {
        return new ComputationalAssetModel(item);
    }

    protected parseRequest(item: ComputationalAssetModel): any {
        throw new Error("Method not implemented.");
    }
    
}