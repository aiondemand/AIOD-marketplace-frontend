import { EnvWindow } from '@app/shared/interfaces/env.interface';
import { endpoints } from './endpoints';
import { schemas } from './schemas';

const browserwindow = window as EnvWindow;

export const environment = {
  name: 'dev',
  develop: true,
  production: false,
  api: {
    base: browserwindow.env?.['API_URL'] || 'https://test.openml.org/aiod',
    endpoints,
    schemas,
  },
  keycloakConfig: {
    baseUrl:
      browserwindow.env?.['KEYCLOAK_URL'] || 'https://auth-aiod-dev.iti.es',
    realm: browserwindow.env?.['KEYCLOAK_REALM'] || 'aiod',
    clientId: browserwindow.env?.['KEYCLOAK_CLIENT_ID'] || 'marketplace',
    redirectUri: browserwindow.env?.['ML_REDIRECT_URI'] || '/',
    showDebugInformation: true,
  },
  enhancedApi: {
    baseEnhanced:
      browserwindow.env?.['AIOD_ENHANCED_API'] || 'https://rail-dev.aiod.i3a.es',
  },
  zohoConfig: {
    base: '',
  },
};
