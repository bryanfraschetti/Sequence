#!/bin/bash

react_container=$(docker container list -a | grep "react" | awk '{print $1}' | xargs)
if [ -n "$react_container" ]; then
    docker stop $react_container
fi

api_container=$(docker container list -a | grep "api" | awk '{print $1}' | xargs)
if [ -n "$api_container" ]; then
    docker stop $api_container
fi

react_image=$(docker image list | grep "react" | awk '{print $3}' | xargs)
if [ -n "$react_image" ]; then
    docker rmi -f $react_image
fi

api_image=$(docker image list | grep "api" | awk '{print $3}' | xargs)
if [ -n "$api_image" ]; then
    docker rmi -f $api_image
fi

redis_image=$(docker image list | grep "redis" | awk '{print $3}' | xargs)
if [ -n "$redis_image" ]; then
    docker rmi -f $redis_image
fi

nginx_image=$(docker image list | grep "nginx" | awk '{print $3}' | xargs)
if [ -n "$nginx_image" ]; then
    docker rmi -f $nginx_image
fi


cd ./client
# npm install # If dependencies not yet installed
npm run build

redis-cli shutdown

# Go back to the root directory and start Docker Compose
cd ..
docker compose up --detach