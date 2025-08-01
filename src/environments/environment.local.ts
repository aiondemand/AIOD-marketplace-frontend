import { EnvWindow } from '@app/shared/interfaces/env.interface';
import { endpoints } from './endpoints';
import { schemas } from './schemas';

const browserwindow = window as EnvWindow;

export const environment = {
  name: 'prod',
  develop: true,
  production: false,
  api: {
    base: browserwindow.env?.['API_URL'] || 'http://localhost:8001',
    endpoints,
    schemas,
  },
  keycloakConfig: {
    baseUrl:
      browserwindow.env?.['KEYCLOAK_URL'] ||
      'https://aiod-dev.i3a.es/aiod-auth',
    realm: browserwindow.env?.['KEYCLOAK_REALM'] || 'aiod',
    clientId: browserwindow.env?.['KEYCLOAK_CLIENT_ID'] || 'marketplace',
    redirectUri: browserwindow.env?.['ML_REDIRECT_URI'] || '',
    showDebugInformation: true,
  },
  enhancedApi: {
    baseEnhanced:
      browserwindow.env?.['AIOD_ENHANCED_API'] || 'http://localhost:8001',
  },
  zohoConfig: {
    base: '',
  },
};
