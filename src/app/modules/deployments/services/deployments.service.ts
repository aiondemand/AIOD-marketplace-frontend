import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
  Deployment,
  statusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class DeploymentsService {
  readonly voParam: HttpParams;
  readonly vosArrayParam: HttpParams;
  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
  ) {
    this.voParam = new HttpParams().set(
      'vo',
      this.appConfigService?.voName || '',
    );
    this.vosArrayParam = new HttpParams().set(
      'vos',
      this.appConfigService?.voName || '',
    );
  }

  getDeployments(): Observable<Deployment[]> {
    // const url = `${base}${endpoints.deployments}`;
    const url = '';
    return this.http.get<Array<Deployment>>(url, {
      params: this.vosArrayParam,
    });
  }

  getDeploymentByUUID(deploymentUUID: string): Observable<Deployment> {
    //  const url = `${base}${endpoints.deploymentByUUID.replace(

    //':deploymentUUID',
    //     deploymentUUID
    //   )}`;
    const url = '';
    return this.http.get<Deployment>(url, { params: this.voParam });
  }

  postTrainModule(moduleConf: TrainModuleRequest): Observable<statusReturn> {
    // const url = `${base}${endpoints.trainModule}`;
    //.trainModule is not used anymore, but kept for backward compatibility
    const url = '';
    return this.http.post<statusReturn>(url, moduleConf, {
      params: this.voParam,
    });
  }

  deleteDeploymentByUUID(deploymentUUID: string): Observable<statusReturn> {
    // const url = `${base}${endpoints.deploymentByUUID.replace(
    //   ':deploymentUUID',

    //deploymentUUID
    //)}`;
    const url = '';
    return this.http.delete<statusReturn>(url, { params: this.voParam });
  }
}
