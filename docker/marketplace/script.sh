#!/bin/sh

export MY_PATH_API_AIOD_CATALOGUE
export MY_PATH_API_MY_LIB


envsubst '${MY_PATH_API_MY_LIB},${MY_PATH_API_AIOD_CATALOGUE}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf 
nginx -g 'daemon off;'
