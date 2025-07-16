import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return firstValueFrom(this.http.get('/assets/config.json')).then(
      (config) => {
        this.appConfig = config;
      },
    );
  }

  checkConfigFileLoaded() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
  }

  get title() {
    this.checkConfigFileLoaded();
    return this.appConfig.title;
  }

  get sidenavMenu() {
    this.checkConfigFileLoaded();
    return this.appConfig.sidenavMenu;
  }

  get tags() {
    this.checkConfigFileLoaded();
    return this.appConfig.tags;
  }

  get voName() {
    this.checkConfigFileLoaded();
    return this.appConfig.voName;
  }

  get acknowledgments() {
    this.checkConfigFileLoaded();
    return this.appConfig.acknowledgments;
  }

  get projectName() {
    this.checkConfigFileLoaded();
    return this.appConfig.projectName;
  }

  get projectUrl() {
    this.checkConfigFileLoaded();
    return this.appConfig.projectUrl;
  }

  get assets() {
    this.checkConfigFileLoaded();
    return this.appConfig.assets;
  }
}
