# -------- Stage 1: Builder --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------- Stage 2: Runner
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy app
COPY --from=builder /app .

EXPOSE 10000

# Start both services
CMD sh -c "npm run start -p 10000"