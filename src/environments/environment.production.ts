import { EnvWindow } from '@app/shared/interfaces/env.interface';
import { endpoints } from './endpoints';
import { schemas } from './schemas';

const browserwindow = window as EnvWindow;

export const environment = {
    name: 'prod',
    develop: false,
    production: true,
    api: {
        base: browserwindow.env?.['API_URL'] || '',
        endpoints,
        schemas,
    },
    keycloakConfig: {
        baseUrl: browserwindow.env?.['KEYCLOAK_URL'],
        realm: browserwindow.env?.['KEYCLOAK_REALM'] || 'aiod',
        clientId: browserwindow.env?.['KEYCLOAK_CLIENT_ID'] || 'marketplace',
        redirectUri: browserwindow.env?.['ML_REDIRECT_URI'] || '/',
        showDebugInformation: true,
    },
};
