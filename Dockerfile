# syntax=docker/dockerfile:1

# Stage 1: build React frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: build Node backend
FROM node:20-alpine AS backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=frontend /app/dist ./dist
COPY --from=backend /app/server/dist ./server/dist
COPY --from=backend /app/server/node_modules ./server/node_modules
COPY server/package.json ./server/package.json
ENV NODE_ENV=production
EXPOSE 4568
CMD ["node", "server/dist/index.js"]
