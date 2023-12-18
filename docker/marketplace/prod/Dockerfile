#stage 1
FROM node:20.5 as node
WORKDIR /app
COPY . .

RUN npm install -g @angular/cli@latest
RUN npm install
RUN npm run build-ai4eosc-prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/ai4-dashboard /usr/share/nginx/html