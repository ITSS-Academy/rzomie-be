# Use official Node.js LTS image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

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

# Copy only built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./


# Copy static assets (themes, etc.)
COPY --from=builder /app/src/themes ./src/themes

# Copy firebase admin key
COPY firebase-admin-key.json ./

# Expose port (default NestJS port)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
