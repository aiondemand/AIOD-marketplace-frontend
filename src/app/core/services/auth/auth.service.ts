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
  private refreshInProgress = false;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

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

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.monitorTokenEvents();

      if (this.isAuthenticated()) {
        this.tryLoadProfileFromTokens();
        this.oauthService.setupAutomaticSilentRefresh();
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
  private monitorTokenEvents() {
    this.oauthService.events.subscribe((event) => {
      console.log('OAuth Event:', event.type);

      switch (event.type) {
        case 'token_received':
          console.log('Token refreshed successfully');
          this.isAuthenticatedSubject.next(true);
          break;

        case 'token_refresh_error':
          console.error('Token refresh failed:', event);
          this.handleRefreshError();
          break;

        case 'silent_refresh_error':
          console.error('Silent refresh error:', event);
          this.handleRefreshError();
          break;

        case 'silent_refresh_timeout':
          console.error('Silent refresh timeout');
          this.handleRefreshError();
          break;

        case 'session_terminated':
          console.warn('Session terminated');
          this.handleSessionTerminated();
          break;
      }
    });
  }

  private handleRefreshError() {
    console.warn('Attempting manual token refresh...');

    // Try one manual refresh before giving up
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;

      this.oauthService
        .refreshToken()
        .then(() => {
          console.log('✅ Manual refresh succeeded');
          this.refreshInProgress = false;
          this.isAuthenticatedSubject.next(true);
        })
        .catch((error) => {
          console.error('❌ Manual refresh also failed:', error);
          this.refreshInProgress = false;
          this.handleSessionExpired();
        });
    }
  }

  private handleSessionExpired() {
    console.error('Session expired, user must re-authenticate');
    this.isAuthenticatedSubject.next(false);

    // Clear tokens
    this.oauthService.logOut(true); // true = revoke tokens

    // Redirect to login with return URL
    const returnUrl = this.router.url;
    this.router.navigate(['/login'], {
      queryParams: { returnUrl },
    });
  }

  private handleSessionTerminated() {
    console.warn('Session terminated in another tab');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  login(url: string) {
    this.oauthService.initLoginFlow(url);
  }

  logout() {
    this.oauthService.logOut();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/resources']);
  }

  isAuthenticated(): boolean {
    return !!this.oauthService.getIdToken();
  }

  isAuthActiveUser(): boolean {
    return (
      this.isAuthenticated() &&
      !!this.oauthService.getAccessToken() &&
      this.oauthService.hasValidAccessToken() &&
      this.oauthService.hasValidIdToken()
    );
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
    return this.oauthService?.getAccessToken();
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

  async tryRefreshToken(): Promise<boolean> {
    if (this.refreshInProgress) {
      console.log('Refresh already in progress, waiting...');
      return false;
    }

    try {
      this.refreshInProgress = true;
      await this.oauthService.refreshToken();
      this.refreshInProgress = false;
      return true;
    } catch (error) {
      console.error('Manual refresh failed:', error);
      this.refreshInProgress = false;
      this.handleSessionExpired();
      return false;
    }
  }
}
