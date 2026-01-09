# AI Catalogue Deployment Documentation

## Summary

This documentation outlines the necessary steps to deploy the Angular Marketplace application (frontend) in a Docker container environment using a Linux operating system (Ubuntu). Please follow these steps carefully to ensure a successful deployment.

## Prerequisites

Before beginning the deployment, make sure you have the following components installed:

- [Docker](https://www.docker.com/) (version used: 20.10.24)
- [Docker Compose](https://docs.docker.com/compose/install/) (version used: v2.17.2)

## Deployment

1. **Clone the Repository**

```bash
git clone https://egitlab.iti.es/ai4europe/marketplace-frontend.git
```

2. **Configure Environment Variables and Endpoints**

* Copy `.env.template` to `.env` file and provide values to the environment variables defined there. 

```
# AIoD REST API base URL.
MY_PATH_API_AIOD_CATALOGUE=
# MyLibrary Backend base URL. Ex: http://172.17.0.1:8090 (if deployed locally)
MY_PATH_API_MY_LIB=
# Keycloak base URL
KEYCLOAK_URL=
# Name of Keycloak realm where keycloack client for user authentication is defined
KEYCLOAK_REALM=
# Name of Keycloak client used for user authentication
KEYCLOAK_CLIENT_ID=
# URL of mylibrary-nginx-frontend container. Ex: http://172.17.0.1:9094
MY_PATH_MARKETPLACE=
# Enhance Search base URL.
AIOD_ENHANCED_API=
# URL to include Zoho script to collect user metrics.
ZOHO_URL=
#ML_REDIRECT_URI=mylibrary/ #must end with /
# API_URL=http://localhost
# Metadata Catalogue Editor base URL.
MCE_URL=
```

>NOTE:
>
>If you are running other AIoD services locally (e.g., the REST API) on the same machine, you should check the Docker service gateway (using the **ifconfig** command and looking at the IP of the **docker0** interface). Such an IP (together with the corresponding port if applicable) is the one that has to be used to configure the corresponding environment variable (e.g., `MY_PATH_API_AIOD_CATALOGUE`)


3. **Run Docker container**

In the `docker-compose-proxy.yaml` file, you will find two services:

- **mylibrary-nginx-proxy**: runs an Nginx used as a reverse proxy for the necessary requests to other APIs and services. This service exposes port 9092, which will be the entry port to the AI Catalogue service.

- **mylibrary-nginx-frontend**: this service runs a Node.js server that launches the Angular application on port 9094. Note, however, that this port is used internally and does not need to be accessible to external services.

To start the Docker services, use the following command:

```bash
docker compose -f docker-compose-proxy.yaml up --build
```
 
Once the containers are up an running, the AI Catalogue is available at http://localhost:9092.


To stop the services, you can use the following command:

```bash
docker compose -f docker-compose-proxy.yaml down
```
 