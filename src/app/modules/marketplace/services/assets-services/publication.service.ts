import { GenericAssetService } from './generic-asset.service';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicationModel } from '@app/shared/models/publication.model';

const { endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PublicationService extends GenericAssetService<PublicationModel> {
  constructor(http: HttpClient) {
    super(http, endpoints.publications);
  }

  protected parseResponse(item: any): PublicationModel {
    return new PublicationModel(item);
  }

  protected parseRequest(item: PublicationModel): any {
    throw new Error('Method not implemented.');
  }
}
