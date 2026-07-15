# Stage 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# This uses the default Nginx config
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]