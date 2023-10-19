import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: false,
    api: {
        base: 'http://localhost',
        endpoints,
        schemas,
    },
};
