ENV ?= production

deploy:
	BUILD_ENV=$(ENV) docker compose build --build-arg BUILD_ENV=$(ENV)
	docker compose up -d

# Usage:
# make deploy ENV=staging
# make deploy ENV=production