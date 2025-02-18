import { EnvWindow } from '@app/shared/interfaces/env.interface';
import { endpoints } from './endpoints';
import { schemas } from './schemas';

const browserwindow = window as EnvWindow;

export const environment = {
    name: 'dev',
    develop: true,
    production: false,
    api: {
        base: browserwindow.env?.['API_URL'] || '',
        endpoints,
        schemas,
    },
    keycloakConfig: {
        baseUrl: browserwindow.env?.['KEYCLOAK_URL'],
        realm: browserwindow.env?.['KEYCLOAK_REALM'] || 'aiod',
        clientId: browserwindow.env?.['KEYCLOAK_CLIENT_ID'] || 'marketplace',
        showDebugInformation: true,
    },
    enhancedApi: {
        baseEnhanced: browserwindow.env?.['AIOD_ENHANCED_API'],
    }
};
