FROM node:20

# Copy and install client dependencies in container
WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm install

# Copy client source code
COPY ./client .
RUN npm run build

# Copy and install server dependencies in container
WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install

# Copy server source to the container
COPY ./server .

# Server runs on port 3001
EXPOSE 3001

CMD ["npm", "start"]
