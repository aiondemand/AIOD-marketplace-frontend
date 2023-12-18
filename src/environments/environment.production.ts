import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: false,
    production: true,
    api: {
        base: '',
        endpoints,
        schemas
    },
    keycloakConfig: {
        baseUrl: 'https://auth.aiod.eu/aiod-auth',
        realm: 'aiod',
        clientId: 'marketplace',
        showDebugInformation: true,
    },
};
