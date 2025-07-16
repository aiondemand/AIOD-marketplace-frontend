import { environment } from '@environments/environment';
import { GenericAssetService } from './generic-asset.service';
import { ServiceModel } from '@app/shared/models/service.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const { endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class ServiceService extends GenericAssetService<ServiceModel> {
  constructor(http: HttpClient) {
    super(http, endpoints.services);
  }

  protected override parseResponse(item: any): ServiceModel {
    return new ServiceModel(item);
  }

  protected override parseRequest(item: ServiceModel) {
    throw new Error('Method not implemented.');
  }
}
