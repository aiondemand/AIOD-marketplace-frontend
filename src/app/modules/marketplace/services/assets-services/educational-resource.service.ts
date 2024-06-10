import { GenericAssetService } from "./generic-asset.service";
import { environment } from "@environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EducationalResourceModel } from "@app/shared/models/educationalResource.model";

const { endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class EducationalResourceService extends GenericAssetService<EducationalResourceModel> {
    constructor(http: HttpClient) {
        super(http, endpoints.educationalResources);
    }

    protected parseResponse(item: any): EducationalResourceModel {
        return new EducationalResourceModel(item);
    }

    protected parseRequest(item: EducationalResourceModel): any {
        throw new Error("Method not implemented.");
    }
    
}