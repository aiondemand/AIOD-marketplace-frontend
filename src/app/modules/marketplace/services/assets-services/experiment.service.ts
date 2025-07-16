import { ExperimentModel } from '@app/shared/models/experiment.model';
import { GenericAssetService } from './generic-asset.service';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const { endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class ExperimentService extends GenericAssetService<ExperimentModel> {
  constructor(http: HttpClient) {
    super(http, endpoints.expetiments);
  }

  protected parseResponse(item: any): ExperimentModel {
    return new ExperimentModel(item);
  }

  protected parseRequest(item: ExperimentModel): any {
    throw new Error('Method not implemented.');
  }
}
