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
};
