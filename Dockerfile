# Use the official Node.js v22 image
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application into the container
COPY . .

# Expose the application port (adjust if not 3000)
EXPOSE 3000

# Install ts-node and nodemon globally for development-like behavior
RUN npm install -g ts-node nodemon

# Command to run the application
CMD ["nodemon", "--exec", "ts-node", "server.ts"]
