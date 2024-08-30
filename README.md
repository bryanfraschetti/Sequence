# 🎼 Sequence.

This is a full stack web application using a React front end in
combination with an Express.js/Node.js back end and deployed with Docker/Docker-Compose. The containerization of the application is to help increase its portability while also minimizing the requirements of the installation - improving production performance.

This app communicates with the Spotify API to access a user's playlists and
the information regarding the musical content of their songs

The purpose of this application is for users to reorganize their playlists
based on music theory

Naturally, any .env configuration file used in development is not tracked as it contains confidential credentials.
Similarly, when running in a docker container it is unadvisable to store the .env on the container. For this reason, the real docker-compose.yaml, which stores credentials is also not version tracked. An example docker-compose without any critical information is nevertheless provided.

## ⚙️ Production Steps

First build the client locally. It will be copied to the container and only the final build product is needed. Building locally helps minimize the Docker build and runtime. These steps are automated in build.sh

### 🧰 Building Client (React)

```
cd client
npm install # If dependencies not yet installed
npm run build
```

### 🐋 Start Docker Service

```
docker compose up
```

This builds and starts several containers. Firstly, a redis container which Sequence employs to implement a caching system.

Note that it may be necessary to first run

```
redis-cli shutdown
```

and stop any locally running redis instance to free up port 6379 since the docker container is mapped to run on that port.

Additionally, a container is created to host the build product of the react app. Since the react app is static Nginx is best suited for deployment and an Nginx container is chosen as the base.

Then a Node container is created. This container serves the backend API which is the middleware between the client, cache, and the Spotify API. This depends on the existing caching service.

To resolve all requests using the same endpoint, we have a container through which all traffic is routed - a lightweight Nginx instance. Requests matching the /api prefixed path are reverse-proxied to the Node container, which is optimized for handling Rest API traffic. Other endpoints are proxied to the container that hosts the static React app. This is dependent on both the Node and Nginx/React containers

Various exporter containers exist to scrape metrics from the different containers: a centralized Nginx exporter for the Nginx instance that sits in front of and reverse proxies to Node and React, a node exporter, another Nginx exporter for the Nginx instance which is responsible for serving the React client, a Redis exporter to examine cache performance, and Cadvisor to monitor the statuses of all containers. All of this data is passed to Grafana for visualization using the help of Prometheus.

## 🏗️ Development Steps (Deprecated)

In development, services like nodemon allow for changes and updates to be observed in realtime. To take advantage of this, the user interacts with a React server. Requests that cannot be satisfied by the React app are proxied to the Express/Node server, which acts as a middleware between the client and the Spotify API. In this setup, the React App is setup to run on port 3000 and the Express/Node App is on port 3001.

### 📍 Start Local Redis Server

```
redis-server --loadmodule /path/to/librejson.so --daemonize yes
```

This starts the redis server as a background process with the JSON module loaded

### 🧑‍💻 Start React App

```
cd client
npm install # If dependencies not yet installed
npm start
```

### 🖥️ Start Express Node Development Server

```
cd ../server
npm install # If dependencies not yet installed
npm run devStart
```
