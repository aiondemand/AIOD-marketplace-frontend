import { DatasetModel } from '@app/shared/models/dataset.model';
import { GenericAssetService } from './generic-asset.service';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const { endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class DatasetService extends GenericAssetService<DatasetModel> {
  constructor(http: HttpClient) {
    super(http, endpoints.datasets);
  }

  protected parseResponse(item: any): DatasetModel {
    return new DatasetModel(item);
  }

  protected parseRequest(item: DatasetModel): any {
    throw new Error('Method not implemented.');
  }
}
