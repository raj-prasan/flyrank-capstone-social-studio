# Multi-stage Dockerfile for Flyrank Backend Server

# Stage 1: Build TypeScript source
FROM node:22-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies required for compilation)
COPY package*.json ./
RUN npm ci

# Copy configuration and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript in /dist
RUN npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript output from builder stage
COPY --from=builder /app/dist ./dist

# Expose default API server port
EXPOSE 4000

# Start server
CMD ["node", "dist/index.js"]
