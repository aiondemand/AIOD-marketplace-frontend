import { GenericAssetService } from "./generic-asset.service";
import { environment } from "@environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CaseStudyModel } from "@app/shared/models/caseStudy.model";

const { endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class CaseStudyService extends GenericAssetService<CaseStudyModel> {
    constructor(http: HttpClient) {
        super(http, endpoints.caseStudies);
    }

    protected parseResponse(item: any): CaseStudyModel {
        return new CaseStudyModel(item);
    }

    protected parseRequest(item: CaseStudyModel): any {
        throw new Error("Method not implemented.");
    }
    
}