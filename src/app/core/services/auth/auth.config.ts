import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '@environments/environment';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer:
    environment.keycloakConfig.baseUrl +
    '/realms/' +
    environment.keycloakConfig.realm,

  // URL of the SPA to redirect the user to after login
  //redirectUri: window.location.origin,
  redirectUri:
    window.location.origin + '/' + environment.keycloakConfig.redirectUri,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: environment.keycloakConfig.clientId,

  // Authorization Code Flow
  responseType: 'code',

  // set the scope for the permissions the client should request
  scope: 'openid profile microprofile-jwt email',

  showDebugInformation: environment.keycloakConfig.showDebugInformation,
  useSilentRefresh: true,
  silentRefreshRedirectUri:
    window.location.origin + '/' + environment.keycloakConfig.redirectUri,
  silentRefreshTimeout: 5000,
  sessionChecksEnabled: false,
  timeoutFactor: 0.75,

  requireHttps: false,
};
