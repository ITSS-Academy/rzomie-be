# Use official Node.js LTS image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install Chrome dependencies
RUN apk update && apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      fontconfig

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_ARGS=--no-sandbox

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app (NestJS build outputs to dist/)
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app

# Install Chrome dependencies
RUN apk update && apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      fontconfig

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_ARGS=--no-sandbox

# Copy only built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./


# Copy static assets (themes, etc.)
COPY --from=builder /app/src/themes ./src/themes

# Copy firebase admin key
COPY firebase-admin-key.json ./

# Create a non-root user for security and set proper permissions
RUN mkdir -p /tmp/puppeteer && \
    chmod -R 777 /tmp/puppeteer && \
    addgroup -S appuser && adduser -S -G appuser appuser && \
    chown -R appuser:appuser /app

# Use this temporary directory for Puppeteer
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer

USER appuser

# Expose port (default NestJS port)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
