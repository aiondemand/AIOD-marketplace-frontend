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

# Copy the environment template
COPY src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js

# Copy the nginx template configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the startup script
COPY docker/marketplace/script.sh /script.sh

# Set the entrypoint
ENTRYPOINT ["/script.sh"]

CMD  ["nginx", "-g", "daemon off;"]