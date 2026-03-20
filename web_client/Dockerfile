# -------- Stage 1: Builder --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY .env .env 
RUN npm run build
RUN npm prune --omit=dev


# -------- Stage 2: Runner
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 10000

# Start both services
CMD sh -c "npm run start -p 10000"