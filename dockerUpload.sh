#!/bin/bash

# Set your repository name
DOCKER_USER="bryanfraschetti"

# Get all the local Docker images (excluding the header line)
IMAGE_NAMES=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v '<none>')

# Loop through all images and push with v1.0.0 tag
for IMAGE_NAME in $IMAGE_NAMES
do
    if [[ $IMAGE_NAME == sequence* ]]; then

        docker tag $IMAGE_NAME $DOCKER_USER/$IMAGE_NAME
        docker push $DOCKER_USER/$IMAGE_NAME
    fi
done
