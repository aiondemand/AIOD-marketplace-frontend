FROM node:20.5 as node
WORKDIR /app

COPY ./package.json .
RUN npm install -g @angular/cli@latest
RUN yarn install
