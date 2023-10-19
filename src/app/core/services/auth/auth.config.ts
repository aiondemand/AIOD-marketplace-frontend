import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'https://test.openml.org/aiod-auth/realms/dev',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'aiod-api-swagger',

    // Authorization Code Flow
    responseType: 'code',

    // set the scope for the permissions the client should request
    scope: 'openid profile microprofile-jwt',

    showDebugInformation: false,
};
