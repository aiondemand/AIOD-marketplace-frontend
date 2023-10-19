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
};
