# Angular Application Deployment Documentation

## Summary

This documentation outlines the necessary steps to deploy the Angular Marketplace application (frontend) in a Docker container environment using a Linux operating system (Ubuntu). Please follow these steps carefully to ensure a successful deployment.

## Prerequisites

Before beginning the deployment, make sure you have the following components installed:

- [Docker](https://www.docker.com/) (version used: 20.10.24)
- [Docker Compose](https://docs.docker.com/compose/install/) (version used: v2.17.2)

## Deployment

To deploy the application, several Docker images (`docker/marketplace`) were built to enable deployment in both a development and production environment.

### Development Environment

1. **Clone the Repository**

```bash
git clone https://egitlab.iti.es/ai4europe/marketplace-frontend.git
```

2. **Configure Environment Variables and Endpoints**

In the development environment, you should edit the `environment.development.ts` (or `environment.local.ts`, depending on the command used) and `endpoints.ts` files to configure the environment variables and endpoints that the Marketplace consumes.

Example of `environment.development.ts`:

```ts
// File environment.development.ts

import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: false,
    api: {
        base: 'http://localhost', // Domain and port of the reverse proxy
        endpoints,
        schemas,
    },
};
```

>NOTE:
>
> In this development environment, there is a Docker Compose service that runs an Nginx reverse proxy to configure CORS and have a single domain for the API REST [AIOD-rest-api](https://github.com/aiondemand/AIOD-rest-api), [marketplace backend](https://egitlab.iti.es/ai4europe/marketplace-mylibrary-backend)consumed by the Marketplace frontend application.

Example of `endpoints.ts`:

```ts
// File endpoints.ts

export const endpoints = {
    // ... List of endpoints ...
};
```

>NOTE:
>
> The information of the endpoints to be consumed is registered. You can simplify and customize these registrations according to your needs.

3. **Configure and Run Docker Compose Services**

In the `docker-compose-dev.yaml` file, you will find two services with their respective configurations:

- **aiod-marketplace-frontend**: This service runs a Node.js server that launches the Angular application on port 8080.
- **proxy**: It uses Nginx as a reverse proxy for the necessary API REST. Configure the environment variables to identify where the API RESTs are running, such as `MY_PATH_API_AIOD_CATALOGUE` and `MY_PATH_API_MY_LIB`.

To start the Docker services, use the following command:

```bash
docker compose -f docker-compose-dev.yaml up --build
```

As an additional note, if you are using an editor like VSCode, it is necessary to copy the `node_modules` folder to improve the development experience. You can do this with the following command:

```bash
docker cp aiod-marketplace-frontend:/app/node_modules .
```

To stop the services, you can use the following command:

```bash
docker compose -f docker-compose-dev.yaml down
```

### Production Environment

1. **Clone the Repository**

```bash
git clone https://egitlab.iti.es/ai4europe/marketplace-frontend.git
```

2. **Configure Environment Variables and Endpoints**

In the production environment, edit the `environment.production.ts` and `endpoints.ts` files to configure the environment variables and endpoints that the Marketplace consumes.

Example of `environment.production.ts`:

```ts
// File environment.production.ts

import { endpoints } from './endpoints';
import { schemas } from './schemas';

export const environment = {
    name: 'prod',
    develop: true,
    production: false,
    api: {
        base: '', // No need to specify the domain of the API REST.
        endpoints,
        schemas,
    },
};
```

>NOTE:
>
>In this case, the reverse proxy and the Angular Marketplace frontend application share the same Nginx server, which is why it is not necessary to specify the domain of the REST APIs.

3. **Configure and Run Docker Compose Service**

In the `docker-compose.yaml` file, you will find a service with its respective configuration:

- **nginx-marketplace-frontend**: This service uses Nginx as a reverse proxy for the necessary API RESTs and as a web server for the Angular application. Configure environment variables, such as `MY_PATH_API_AIOD_CATALOGUE` and `MY_PATH_API_MY_LIB`.

To start the Docker service in production, use the following command:

```bash
docker compose up --build
```

These are the necessary steps to deploy the Angular application in both development and production environments. Ensure that you follow these steps carefully for a successful deployment.
