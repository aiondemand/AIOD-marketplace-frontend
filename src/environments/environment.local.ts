import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'dev',
    develop: true,
    production: false,
    api: {
        base: '',
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
