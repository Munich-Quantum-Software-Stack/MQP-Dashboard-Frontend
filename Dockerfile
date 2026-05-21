# ── Stage 1: build the React app ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install && npm ci

COPY . .

ARG BUILD_ENV=production
RUN npx env-cmd -f .env.${BUILD_ENV} npm run build:${BUILD_ENV}

# ── Stage 2: serve with nginx ──────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80