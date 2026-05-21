ENV ?= production

build:
	BUILD_ENV=$(ENV) docker compose build

up:
	docker compose up -d

deploy: build up

down:
	docker compose down

logs:
	docker compose logs -f react-app
# Usage:
# make deploy ENV=staging
# make deploy ENV=production