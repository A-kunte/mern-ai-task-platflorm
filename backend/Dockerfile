# Stage 1: Build Environment
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production Environment
FROM node:20-alpine
WORKDIR /app

# Create a secure non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled files from the builder stage
COPY --from=builder /app ./

# Grant ownership to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]

# Add this near the end of your Dockerfiles
# Use the built-in secure non-root user
USER node