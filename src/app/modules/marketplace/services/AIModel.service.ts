import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AIModelModel } from '@app/shared/models/AIModel.model';
import { GenericAssetService } from './assets-services/generic-asset.service';

const { endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class AIModelService extends GenericAssetService<AIModelModel> {
  constructor(http: HttpClient) {
    super(http, endpoints.aimodels);
  }

  protected parseResponse(item: any): AIModelModel {
    return new AIModelModel(item);
  }

  protected parseRequest(item: AIModelModel): any {
    throw new Error('Method not implemented.');
  }
}
