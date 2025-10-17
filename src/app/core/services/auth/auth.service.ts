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
  preferred_username?: string;
}

@Injectable()
export class AuthService {
  private lastSilentRefreshAt = 0;
  private readonly minSilentRefreshIntervalMs = 100_000;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private appConfigService: AppConfigService,
  ) {
    this.configureOAuthService();

    try {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    } catch (e) {
      //swallow
    }
  }

  userProfileSubject = new BehaviorSubject<UserProfile>({} as UserProfile);

  /**
   * Configure the oauth service, tries to login and saves the user profile for display.
   *
   *
   * @memberof AuthService
   */
  configureOAuthService() {
    this.oauthService.configure(authCodeFlowConfig);
    try {
      if (
        typeof localStorage !== 'undefined' &&
        (this.oauthService as any).setStorage
      ) {
        (this.oauthService as any).setStorage(localStorage);
      }
    } catch (e) {
      console.warn(
        'AuthService: unable to set localStorage for OAuthService',
        e,
      );
    }

    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.isAuthenticated()) {
        this.tryLoadProfileFromTokens();
      } else {
        const now = Date.now();
        if (now - this.lastSilentRefreshAt > this.minSilentRefreshIntervalMs) {
          this.lastSilentRefreshAt = now;
          this.oauthService
            .silentRefresh()
            .then(() => this.tryLoadProfileFromTokens())
            .catch(() => {
              // swallow
            });
        }
      }
    });
  }

  private async tryLoadProfileFromTokens(): Promise<void> {
    if (this.isAuthenticated() && this.oauthService.hasValidAccessToken()) {
      try {
        const profile: any = await this.oauthService.loadUserProfile();
        const userProfile: UserProfile = {
          name: profile['info']['name'],
          email: profile['info']['email'],
          identifier: profile['info']['sub'],
          preferred_username: profile['info']['preferred_username'],
          isAuthorized: false,
        };
        this.userProfileSubject.next(userProfile);

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
      } catch (e) {
        this.userProfileSubject.next({} as UserProfile);
      }
    } else {
      this.userProfileSubject.next({} as UserProfile);
    }
  }

  private handleStorageEvent(event: StorageEvent) {
    try {
      if (!event.key) {
        return;
      }

      const key = event.key;
      if (
        key.includes('access_token') ||
        key.includes('id_token') ||
        key.includes('logout') ||
        key.includes('auth')
      ) {
        this.tryLoadProfileFromTokens();
      }
    } catch (e) {
      // swallow
    }
  }

  login(url: string) {
    this.oauthService.initLoginFlow(url);
  }

  logout() {
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return !!this.oauthService.getIdToken();
  }

  getProfile() {
    return {
      name:
        (this.getToken().idTokenParsed as any)?.name ||
        (this.getToken().idTokenParsed as any)?.preferred_username,
      avatar: (this.getToken().idTokenParsed as any)?.avatar_url,
    };
  }

  getToken(): any {
    return this.oauthService?.getAccessToken() ?? undefined;
  }

  parseVosFromProfile(entitlements: string[]): string[] {
    const foundVos: string[] = [];
    entitlements.forEach((vo) => {
      const m = vo.match('group:(.+?):');
      if (m && m[0]) {
        foundVos.push(m[0]);
      }
    });
    return foundVos;
  }
}
