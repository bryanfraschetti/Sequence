FROM node:20

# Copy and install server dependencies in container
WORKDIR /app/server
COPY ./package*.json ./
RUN npm install

# Copy server file
COPY ./server.js ./

# Copy wait-for-it
COPY ./wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Execute wait for it to ensure redis is accepting TCP connections before starting NodeJS service
CMD ["./wait-for-it.sh", "redis-stack-server:6379", "--", "npm", "start"]

# Server runs on port 3001
EXPOSE 3001