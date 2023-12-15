# Use an official Node.js runtime as the base image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy Angular context
COPY . .

# Install the app's dependencies
RUN npm install

# Build
RUN npm run build

# Use nginx from here on
FROM nginx:alpine

# Copy files to nginx folder
COPY --from=builder /usr/src/app/dist/weather-app /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
