import { AssetModel } from "@app/shared/models/asset.model";
import { GenericAssetService } from "./generic-asset.service";
import { HttpClient } from "@angular/common/http";
import { endpoints } from "@environments/endpoints";
import { AssetCategory } from "@app/shared/models/asset-category.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GeneralAssetService extends GenericAssetService<AssetModel> {

    private assetCategory: AssetCategory;

    constructor(http: HttpClient) {
        super(http, endpoints.datasets);
        this.assetCategory = AssetCategory.Dataset;
    }

    protected override parseResponse(item: any): AssetModel {
        return new AssetModel(item, this.assetCategory);
    }

    protected override parseRequest(item: any): AssetModel {
        throw new Error("Method not implemented.");
    }

    public setAssetCategory(category: AssetCategory): void {
        this.assetCategory = category;
        this.setEndpoint();
    }

    private setEndpoint(): void {
        switch(this.assetCategory) {
            case AssetCategory.Dataset:
                this.endpoint = endpoints.datasets;
                break;
            case AssetCategory.Service: 
                this.endpoint = endpoints.services;
                break
            case AssetCategory.Experiment:
                this.endpoint = endpoints.expetiments;
                break;
            case AssetCategory.AIModel:
                this.endpoint = endpoints.aimodels;
                break;
            case AssetCategory["Educational Resource"]:
                this.endpoint = endpoints.educationalResources;
                break;
            default:
                throw new Error('Does not exit category selected');
        }
    }

}