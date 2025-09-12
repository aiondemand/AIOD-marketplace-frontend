import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { authCodeFlowConfig } from './auth.config';
import { AppConfigService } from '../app-config/app-config.service';

export interface UserProfile {
  name: string;
  email: string;
  identifier: string;
  isAuthorized: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private defaultProfile: UserProfile = {
    name: '',
    email: '',
    identifier: '',
    isAuthorized: false,
  };
  public userProfileSubject = new BehaviorSubject<UserProfile>(
    this.defaultProfile,
  );
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private appConfigService: AppConfigService,
  ) {
    this.configureOAuthService();
  }

  configureOAuthService() {
    const config = { ...authCodeFlowConfig };
    if (config.issuer) {
      config.issuer = config.issuer.replace('/realms/', '/realms/');
    }
    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const claims = this.oauthService.getIdentityClaims();
        if (claims) {
          const userProfile: UserProfile = {
            name: claims['name'] || claims['preferred_username'],
            email: claims['email'],
            identifier: claims['sub'],
            isAuthorized: false,
          };
          this.userProfileSubject.next(userProfile);

          localStorage.setItem('aiod-user', JSON.stringify(claims));
          window.dispatchEvent(
            new CustomEvent('aiod-login', { detail: claims }),
          );
        }

        if (
          this.oauthService.state &&
          this.oauthService.state !== 'undefined' &&
          this.oauthService.state !== 'null'
        ) {
          let stateUrl = this.oauthService.state;
          if (stateUrl.startsWith('/') === false) {
            stateUrl = decodeURIComponent(stateUrl);
          }
          this.router.navigateByUrl(stateUrl);
        }
      }
    });
  }

  public login(url?: string): void {
    this.oauthService.initCodeFlow(url);
  }

  public logout(): void {
    localStorage.removeItem('aiod-user');
    window.dispatchEvent(new CustomEvent('aiod-logout'));

    this.oauthService.logOut();
    this.userProfileSubject.next(this.defaultProfile);
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public getToken(): string | undefined {
    return this.oauthService.getAccessToken() ?? undefined;
  }
}
