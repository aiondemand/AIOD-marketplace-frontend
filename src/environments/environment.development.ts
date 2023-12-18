import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: false,
    api: {
        base: 'http://localhost:8083',
        endpoints,
        schemas,
    },
    keycloakConfig: {
        baseUrl: 'https://aiod-dev.i3a.es/aiod-auth',
        realm: 'aiod',
        clientId: 'marketplace',
        showDebugInformation: true,
    },
};
