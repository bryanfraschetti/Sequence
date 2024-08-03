FROM node:20

# Create and set the working directory for the app
WORKDIR /app

# Copy the package files and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the rest of the application code
COPY ./utils ./utils
COPY ./routes ./routes
COPY ./redisClient.js ./
COPY ./server.js ./

# Make wait-for-it.sh executable
COPY ./wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Use wait-for-it.sh to ensure Redis is accepting TCP connections before starting NodeJS service
CMD ["./wait-for-it.sh", "redis-cache:6379", "--", "npm", "start"]

# Expose port 3001 for the server
EXPOSE 3001
