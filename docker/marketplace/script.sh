#!/bin/sh

export MY_PATH_API_AIOD_CATALOGUE
export MY_PATH_API_MY_LIB


envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

# nginx -g 'daemon off;'

# Execute the CMD passed to the container
exec "$@"
