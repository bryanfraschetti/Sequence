FROM node:20

# Copy client build
WORKDIR /app/client/build
COPY ./client/build .

# Copy and install server dependencies in container
WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install

# Copy server file
COPY ./server/server.js ./

# Server runs on port 3001
EXPOSE 3001

CMD ["npm", "start"]
