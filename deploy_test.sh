#!/usr/env bash

sudo su bqp
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
npm run build:test

echo "Cleaning up old deployment..."
rm -rf /home/bqp/www/html/mqp-dashboard-frontend-test/*

if [ -d /home/bqp/www/html/mqp-dashboard-frontend-test/ ]; then
  echo "Directory exists."
else
  echo "Directory does not exist. Creating..."
  mkdir -p /home/bqp/www/html/mqp-dashboard-frontend-test/
fi

echo "Deploying to lighttpd server..."
cp -r  build/* /home/bqp/www/html/mqp-dashboard-frontend-test/
exit 0

sudo -i
echo "Switched to root user."
echo "Restarting lighttpd service..."
systemctl restart lighttpd.service
exit 0