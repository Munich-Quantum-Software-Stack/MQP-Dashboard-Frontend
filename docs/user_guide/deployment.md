# Deployment

This document describes how to build and deploy the frontend application using Docker and Docker Compose. It also covers how the app connects to the backend infrastructure at runtime.

## Overview

The frontend is a React (craco) application served by an nginx container. The build process is fully containerised — no local Node.js installation is required to deploy.

At runtime, the app container sits on a shared Docker network alongside the backend services. It is not exposed directly to the internet; an infrastructure-level nginx reverse proxy handles all inbound traffic and routes requests to the appropriate container by hostname.

```
Internet
   │
   ▼
nginx (infrastructure)       ← binds :80 / :443, TLS termination
   ├── app.example.com   →   react-app container (this repo)
   └── grafana.example.com → grafana container   (backend repo)

All containers share a Docker bridge network: web
```

```
Infrastructure repo                             App repo 
──────────────────────────────                  ────────────────────────────────
  nginx container                                 react-app container
    - binds :80, :443                               - inner nginx serves SPA
    - routes by hostname                            - listens on :80 internally
    - TLS termination                               - NO published ports
    - proxies → react-app:80                        - only on shared network
    - proxies → grafana:3000
                    │                                        │
                    └──────── shared Docker network ─────────┘
```

## Prerequisites

- Docker and Docker Compose installed on the target machine
- The shared Docker network `mqp-web` must already exist (created by the infrastructure stack)
- A clone of this repository on the target machine

## Repository structure

```
MQP-Dashboard-Frontend/
├── ...
├── src/
├── public/
├── nginx/
│   └── default.conf        # inner nginx config — serves the SPA
├── Dockerfile              # multi-stage: build → serve
├── docker-compose.yml
├── Makefile
├── .env.test
├── .env.staging
└── .env.production
```

## Environment configuration

Build-time environment variables are managed via per-environment `.env.*` files and injected during the React build step using `env-cmd`. The target environment is selected by passing `BUILD_ENV` at build time.

| File | Environment |
|---|---|
| `.env.test` | Test |
| `.env.staging` | Staging |
| `.env.production` | Production |

!!! warning
    Never commit secrets or API keys to these files. Use environment-specific secret management for sensitive values.

## Building and deploying

Deployment is managed via `make` targets. All targets accept an optional `ENV` variable (defaults to `production`).

```bash
# Deploy to production (default)
make deploy

# Deploy to staging
make deploy ENV=staging

# Deploy to test
make deploy ENV=test
```

### Available Makefile targets

| Target | Description |
|---|---|
| `make build` | Build the Docker image for the target environment |
| `make up` | Start the container (image must already be built) |
| `make deploy` | Build and start in one step |
| `make down` | Stop and remove the container |
| `make logs` | Tail container logs |

### First-time setup

On a fresh machine, ensure the shared network exists before bringing up the app:

```bash
docker network create mqp-web
```

This network is owned by the infrastructure stack. If the infrastructure stack is already running, the network will already exist.

## How the Docker image is built

The `Dockerfile` uses a multi-stage build:

1. **Stage 1 — build**: installs Node dependencies and runs `env-cmd` with the target `.env.*` file to produce a static build in `/app/build`
2. **Stage 2 — serve**: copies the static build into an nginx Alpine image

The result is a small, self-contained image with no Node.js runtime.

```dockerfile
# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm ci
COPY . .
ARG BUILD_ENV=production
RUN npx env-cmd -f .env.${BUILD_ENV} npm run build:${BUILD_ENV}

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Inner nginx configuration

The `nginx/default.conf` in this repository is the **inner** nginx config — it runs inside the container and is responsible only for serving the SPA correctly. It is not the infrastructure-level reverse proxy.

Its sole responsibilities are:

- Serving static files from `/usr/share/nginx/html`
- Redirecting all unknown paths to `index.html` so client-side routing works
- Exposing a `/health` endpoint for container health checks

It has no knowledge of domain names, TLS, or upstream services. Those concerns belong to the infrastructure layer.

## Connection to the backend

The app container joins the shared `mqp-web` Docker network at startup. It does not publish any ports to the host directly.

The infrastructure nginx reverse proxy — maintained in the backend repository — routes `mqp.example.com` traffic to this container by its Docker container name (`mqp-app`). No changes to this repository are required when the infrastructure routing configuration changes.

### Grafana embedding

Certain pages embed Grafana dashboard panels via `<iframe>`. Grafana is deployed as part of the backend stack and is accessible at `grafana.example.com`. The infrastructure nginx exposes only the paths required for panel embedding (`/d-solo/`, `/public/`) and blocks all other Grafana routes.

The `Content-Security-Policy: frame-ancestors *.example.com` header set by the infrastructure nginx ensures panels can only be embedded from the shared superdomain.

No Grafana configuration lives in this repository.

## Updating a deployment

To deploy a new version of the app:

```bash
git pull
make deploy ENV=production
```

This rebuilds the image from the latest source and restarts the container. The infrastructure nginx reconnects automatically — no changes to the infrastructure stack are needed.