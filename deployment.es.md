# Documentación de Despliegue de la Aplicación Angular

## Resumen

Esta documentación describe los pasos necesarios para desplegar la aplicación Angular Marketplace (frontend) en un entorno de contenedores Docker utilizando un sistema operativo Linux (Ubuntu). Asegúrate de seguir estos pasos cuidadosamente para garantizar un despliegue exitoso.

## Requisitos Previos

Antes de iniciar el despliegue, asegúrate de tener instalados los siguientes componentes:

- [Docker](https://www.docker.com/) (versión utilizada: 20.10.24)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión utilizada: v2.17.2)

## Despliegue

Para desplegar la aplicación, se construyeron varias imágenes Docker (`docker/marketplace`) que permiten el despliegue tanto en un entorno de desarrollo como en un entorno de producción.

### Entorno de Desarrollo

1. **Clonar el Repositorio**

```bash
   git clone https://egitlab.iti.es/ai4europe/marketplace-frontend.git
```

2. **Configurar las Variables de Entorno y Endpoints**

En el entorno de desarrollo, debes editar los archivos `environment.development.ts` (o `environment.local.ts` según el comando utilizado) y `endpoints.ts` para configurar las variables de entorno y endpoints que consume el Marketplace.

Ejemplo de `environment.development.ts`:

```ts
// Fichero environment.development.ts

import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: false,
    api: {
        base: 'http://localhost', // Dominio y puerto del proxy inverso
        endpoints,
        schemas,
    },
};

```

>NOTA:
>
> En este entorno de desarrollo existe un servicio en docker compose que lanza un nginx proxy inverso para configurar el CORS y tener un solo dominio para los  api-rest [AIOD-rest-api](https://github.com/aiondemand/AIOD-rest-api), [marketplace backend](https://egitlab.iti.es/ai4europe/marketplace-mylibrary-backend) que consume la aplicacaión del marketplace frontend.

Ejemplo de `endpoints.ts`:

```ts
// Fichero endpoints.ts

export const endpoints = {
    // ... Lista de endpoints ...
};
```

>NOTA:
>
> Se registra la información de los endpoints que se consumirán. Puedes simplificar y personalizar estos registros según las necesidades.

3. **Configurar y Ejecutar los Servicios de Docker Compose**

En el archivo `docker-compose-dev.yaml`, encontrarás dos servicios con sus respectivas configuraciones:

- **aiod-marketplace-frontend**: Este servicio ejecuta un servidor Node.js que lanza la aplicación Angular en el puerto 8080.
- **proxy**: Utiliza Nginx como un proxy inverso para los API REST necesarios. Configura las variables de entorno para identificar dónde se ejecutan las API REST, como `MY_PATH_API_AIOD_CATALOGUE` y `MY_PATH_API_MY_LIB`.

Para iniciar los servicios de Docker, utiliza el siguiente comando:

```bash
docker compose -f docker-compose-dev.yaml up --build
```

Como nota adicional, si estás utilizando un editor como VSCode, es necesario copiar la carpeta node_modules para mejorar la experiencia de desarrollo. Puedes hacerlo con el siguiente comando:

```bash
docker cp aiod-marketplace-frontend:/app/node_modules .
```

Para detener los servicios, puedes usar el siguiente comando:

```bash
 docker compose -f docker-compose-dev.yaml down
```

### Entorno de Producción

1. **Clonar el repositorio**

```bash
git clone https://egitlab.iti.es/ai4europe/marketplace-frontend.git

```

2. **Configurar las Variables de Entorno y Endpoints**
En el entorno de producción, edita los archivos `environment.production.ts` y `endpoints.ts` para configurar las variables de entorno y endpoints que consume el Marketplace.

Ejemplo de `environment.production.ts`:

```ts
// Fichero environment.production.ts

import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: false,
    api: {
        base: '', // No es necesario especificar el dominio de los API REST.
        endpoints,
        schemas,
    },
};
```

>NOTA:
>
> En este caso el proxy inverso y la aplicación angular marketplace frontend comparten en mismo servidor de nginx, es por eso que no es necesario especificar el dominio de los API REST.

3. **Configurar y Ejecutar el Servicio de Docker Compose**
En el archivo` docker-compose.yaml`, encontrarás un servicio con sus respectivas configuraciones:

- **nginx-marketplace-frontend**: Este servicio utiliza Nginx como un proxy inverso para los API REST necesarios y como servidor web para la aplicación Angular. Configura las variables de entorno, como `MY_PATH_API_AIOD_CATALOGUE` y `MY_PATH_API_MY_LIB`.

Para iniciar el servicio de Docker en producción, utiliza el siguiente comando:

```bash
docker compose up --build
```

Estos son los pasos necesarios para desplegar la aplicación Angular en entornos de desarrollo y producción. Asegúrate de seguir estos pasos con atención para un despliegue exitoso.
