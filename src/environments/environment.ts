import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: true,
    api: {
        base: '',
        endpoints,
        schemas,
    },
    keycloakConfig: {
        baseUrl: '',
        realm: '',
        clientId: '',
        redirectUri: '',
        showDebugInformation: true
    }
};
