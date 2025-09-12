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
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: environment.keycloakConfig.clientId,

  // Authorization Code Flow
  responseType: 'code',

  // set the scope for the permissions the client should request
  scope: 'openid profile microprofile-jwt email',

  showDebugInformation: environment.keycloakConfig.showDebugInformation,

  requireHttps: false,
};
