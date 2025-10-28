#!/usr/env bash

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
npm run build:stage

echo "Cleaning up old deployment..."
rm -rf /home/bqp/www/html/mqp-dashboard-frontend-stage/*
echo "Old deployment cleaned."

if [ -d /home/bqp/www/html/mqp-dashboard-frontend-stage/ ]; then
  echo "Directory exists."
else
  echo "Directory does not exist. Creating..."
  mkdir -p /home/bqp/www/html/mqp-dashboard-frontend-stage/
fi

echo "Deploying to lighttpd server..."
cp -r  build/* /home/bqp/www/html/mqp-dashboard-frontend-stage/
echo "Deployment completed successfully."

echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Please restart the lighttpd server to apply changes."
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"

exit 0
