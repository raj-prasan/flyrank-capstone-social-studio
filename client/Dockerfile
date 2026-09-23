# Multi-stage Dockerfile for Flyrank Frontend Client (React + Vite)

# Stage 1: Build static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on package-lock
COPY package*.json ./
RUN npm ci

# Copy all source files and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with high-performance Nginx
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
