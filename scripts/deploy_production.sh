#!/usr/env bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

# as bqp  user
USER=$(whoami)
if [ "$USER" != "bqp" ]; then
  echo "This script must be run as bqp user. Current user: $USER"
  exit 1
fi

echo "Building the project..."
npm -v
node -v
npm install env-cmd
rm -rf build
npm run build:production

echo "Cleaning up old deployment..."
rm -rf /home/bqp/www/html/mqp-dashboard-frontend-production/*
echo "Old deployment cleaned."

if [ -d /home/bqp/www/html/mqp-dashboard-frontend-production/ ]; then
  echo "Directory exists."
else
  echo "Directory does not exist. Creating..."
  mkdir -p /home/bqp/www/html/mqp-dashboard-frontend-production/
fi

echo "Deploying to lighttpd server..."
cp -r  build/* /home/bqp/www/html/mqp-dashboard-frontend-production/
echo "Deployment completed successfully."

echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Please restart the lighttpd server to apply changes."
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"

exit 0
