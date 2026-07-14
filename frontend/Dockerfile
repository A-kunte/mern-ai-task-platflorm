# Stage 1: Build React App
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
# Using the official unprivileged nginx image fulfills the non-root requirement
FROM nginxinc/nginx-unprivileged:alpine

# Copy the static React build files to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]