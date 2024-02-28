# Sequence

This is a full stack web application using a React front end in
combination with an Express.js/Node.js back end and deployed with Docker/Docker-Compose. The containerization of the application is to help increase its portability while also minimizing the requirements of the installation - improving production performance.

This app communicates with the Spotify API to access a user's playlists and
the information regarding the musical content of their songs

The purpose of this application is for users to reorganize their playlists
based on music theory

Naturally, the .env configuration file used in development is not tracked as it contains confidential credentials.
Similarly, when running in a docker container it is unadvisable to store the .env on the container. For this reason, the real
docker-compose.yaml is also not version tracked. An example docker-compose without any critical information is nevertheless provided.

## Production Steps

First build the client locally. It will be copied to the container and only the final build product is needed. Building locally helps minimize the Docker build and runtime.

### Building Client

```
cd client
npm install # If dependencies not yet installed
npm run build
```

### Building Docker Image

```
cd ..
docker build -t sequence .
```

### Start Docker Service

```
docker compose up
```

This also starts a redis-stack-server container, which is the redis container that the Sequence container communicates with.

It may be necessary to run

```
redis-cli shutdown
```

to free up port 6379 since localhost:6379 is mapped to redis-stack-server:6379 (the docker container redis service)

## Development Steps

In development, services like nodemon allow for changes and updates to be observed in realtime. To take advantage of this, the user interacts with a React server. Requests that cannot be satisfied by the React app are proxied to the Express/Node server, which acts as a middleware between the client and the Spotify API. In this setup, the React App is setup to run on port 3000 and the Express/Node App is on port 3001.

### Start Local Redis Server

```
redis-server --loadmodule /path/to/librejson.so --daemonize yes
```

This starts the redis server as a background process with the JSON module loaded

### Start React App

```
cd client
npm install # If dependencies not yet installed
npm start
```

### Start Express Node Development Server

```
cd ../server
npm install # If dependencies not yet installed
npm run devStart
```
