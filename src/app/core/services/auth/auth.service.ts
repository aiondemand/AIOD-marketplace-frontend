import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

export interface UserProfile {
  name: string;
  email: string;
  identifier: string;
  isAuthorized: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak: KeycloakInstance;
  private _mockToken: string | null = null;

  userProfileSubject = new BehaviorSubject<UserProfile>({} as UserProfile);

  constructor() {
    this.keycloak = new (Keycloak as any)({
      url: 'https://auth.aiod.eu',
      realm: 'aiod',
      clientId: 'marketplace',
    });
  }

  async init(): Promise<void> {
    await this.keycloak.init({
      onLoad: 'check-sso', // auto-login if user has Keycloak session
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri:
        window.location.origin + '/assets/silent-check-sso.html',
    } as any);
  }

  setMockToken(token: string): void {
    this._mockToken = token;
    // Decode the token to get profile info
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.userProfileSubject.next({
      name: payload.name || payload.preferred_username,
      email: payload.email,
      identifier: payload.sub,
      isAuthorized: true,
    });
  }

  isAuthenticated(): boolean {
    return this._mockToken !== null || (this.keycloak.authenticated ?? false);
  }

  getToken(): string | undefined {
    return this._mockToken || this.keycloak.token;
  }

  getProfile() {
    if (this._mockToken) {
      const payload = JSON.parse(atob(this._mockToken.split('.')[1]));
      return {
        name: payload.name || payload.preferred_username,
        avatar: payload.avatar_url,
      };
    }
    return {
      name:
        (this.keycloak.idTokenParsed as any)?.name ||
        (this.keycloak.idTokenParsed as any)?.preferred_username,
      avatar: (this.keycloak.idTokenParsed as any)?.avatar_url,
    };
  }

  async loadUserProfile() {
    if (this._mockToken) {
      const payload = JSON.parse(atob(this._mockToken.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.preferred_username,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        enabled: true,
        emailVerified: payload.email_verified,
        totp: false,
        createdTimestamp: Date.now(),
      };
    }
    return this.keycloak.loadUserProfile();
  }

  login(): void {
    if (!this._mockToken) {
      this.keycloak.login();
    }
  }

  logout(): void {
    if (this._mockToken) {
      this._mockToken = null;
      this.userProfileSubject.next({} as UserProfile);
    } else {
      this.keycloak.logout();
    }
  }
}
