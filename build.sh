#!/bin/bash

docker compose down

redis-cli shutdown

delete_container() {
    container_name=$1
    container_id=$(docker container list -a | grep "$container_name" | awk '{print $1}' | xargs)
    if [ -n "$container_id" ]; then
        docker stop $container_id
        docker rm $container_id
    fi
}

delete_image() {
    image_name=$1
    image_id=$(docker image list | grep "$image_name" | awk '{print $3}' | xargs)
    if [ -n "$image_id" ]; then
        docker rmi -f $image_id
    fi
}

compile_react(){
    # This is not automated as part of the dockerfile because it is a time consuming step
    # It should only be executed if changes were made to the React app rather than every instance start
    cd ./client
    # npm install # If dependencies not yet installed
    npm run build
    # Go back to the root directory and start Docker Compose
    cd ..
}

if [ -z "$1" ]; then
    # No arguments, rebuild everything
    docker rmi -f $(docker images -aq)

    compile_react

else
    # Iterate over each argument provided
    for name in "$@"; do
        delete_container "$name"
        delete_image "$name"
        
        if [ "$name" = "react" ]; then
            compile_react
        fi
    done
fi

docker compose up --detach
