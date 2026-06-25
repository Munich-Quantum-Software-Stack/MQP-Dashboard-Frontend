#!/bin/bash
# Creates one Grafana dashboard per room, each with 6 sensor panels backed by
# the built-in TestData datasource (no external DB required).
# Run once after starting the Docker container:
#   bash scripts/create-grafana-dashboards.sh

set -euo pipefail

GRAFANA_URL="http://localhost:3000"
AUTH="admin:admin"

create_dashboard() {
  local ROOM_ID=$1
  local ROOM_NAME=$2
  local DASH_UID=$3

  curl -s -X POST "$GRAFANA_URL/api/dashboards/db" \
    -H "Content-Type: application/json" \
    -u "$AUTH" \
    -d "{
      \"dashboard\": {
        \"uid\": \"$DASH_UID\",
        \"title\": \"$ROOM_NAME\",
        \"tags\": [\"telemetry\", \"$ROOM_ID\"],
        \"timezone\": \"browser\",
        \"refresh\": \"10s\",
        \"panels\": [
          {
            \"id\": 1,
            \"title\": \"Temperature\",
            \"type\": \"timeseries\",
            \"gridPos\": { \"x\": 0, \"y\": 0, \"w\": 12, \"h\": 8 },
            \"datasource\": \"TestData\",
            \"targets\": [{
              \"refId\": \"A\",
              \"scenarioId\": \"random_walk\",
              \"alias\": \"Temperature (°C)\",
              \"startValue\": 22,
              \"spread\": 2
            }],
            \"fieldConfig\": {
              \"defaults\": {
                \"unit\": \"celsius\",
                \"color\": { \"mode\": \"palette-classic\" },
                \"custom\": { \"lineWidth\": 2, \"fillOpacity\": 15 }
              }
            }
          },
          {
            \"id\": 2,
            \"title\": \"Humidity\",
            \"type\": \"timeseries\",
            \"gridPos\": { \"x\": 12, \"y\": 0, \"w\": 12, \"h\": 8 },
            \"datasource\": \"TestData\",
            \"targets\": [{
              \"refId\": \"A\",
              \"scenarioId\": \"random_walk\",
              \"alias\": \"Humidity (%)\",
              \"startValue\": 45,
              \"spread\": 5
            }],
            \"fieldConfig\": {
              \"defaults\": {
                \"unit\": \"percent\",
                \"color\": { \"mode\": \"palette-classic\" }
              }
            }
          },
          {
            \"id\": 3,
            \"title\": \"Pressure\",
            \"type\": \"timeseries\",
            \"gridPos\": { \"x\": 0, \"y\": 8, \"w\": 12, \"h\": 8 },
            \"datasource\": \"TestData\",
            \"targets\": [{
              \"refId\": \"A\",
              \"scenarioId\": \"random_walk\",
              \"alias\": \"Pressure (hPa)\",
              \"startValue\": 1013,
              \"spread\": 3
            }],
            \"fieldConfig\": {
              \"defaults\": {
                \"unit\": \"pressurehpa\",
                \"color\": { \"mode\": \"palette-classic\" }
              }
            }
          },
          {
            \"id\": 4,
            \"title\": \"Power Draw\",
            \"type\": \"timeseries\",
            \"gridPos\": { \"x\": 12, \"y\": 8, \"w\": 12, \"h\": 8 },
            \"datasource\": \"TestData\",
            \"targets\": [{
              \"refId\": \"A\",
              \"scenarioId\": \"random_walk\",
              \"alias\": \"Power (kW)\",
              \"startValue\": 42,
              \"spread\": 8
            }],
            \"fieldConfig\": {
              \"defaults\": {
                \"unit\": \"kwatt\",
                \"color\": { \"mode\": \"palette-classic\" }
              }
            }
          },
          {
            \"id\": 5,
            \"title\": \"Helium Level\",
            \"type\": \"timeseries\",
            \"gridPos\": { \"x\": 0, \"y\": 16, \"w\": 12, \"h\": 8 },
            \"datasource\": \"TestData\",
            \"targets\": [{
              \"refId\": \"A\",
              \"scenarioId\": \"random_walk\",
              \"alias\": \"Helium (%)\",
              \"startValue\": 95,
              \"spread\": 1
            }],
            \"fieldConfig\": {
              \"defaults\": {
                \"unit\": \"percent\",
                \"color\": { \"mode\": \"fixed\", \"fixedColor\": \"blue\" }
              }
            }
          },
          {
            \"id\": 6,
            \"title\": \"Dust / Particles\",
            \"type\": \"timeseries\",
            \"gridPos\": { \"x\": 12, \"y\": 16, \"w\": 12, \"h\": 8 },
            \"datasource\": \"TestData\",
            \"targets\": [{
              \"refId\": \"A\",
              \"scenarioId\": \"random_walk\",
              \"alias\": \"Particles (μg/m³)\",
              \"startValue\": 5,
              \"spread\": 2
            }],
            \"fieldConfig\": {
              \"defaults\": {
                \"unit\": \"conμgm3\",
                \"color\": { \"mode\": \"palette-classic\" }
              }
            }
          }
        ],
        \"schemaVersion\": 38,
        \"version\": 1
      },
      \"folderId\": 0,
      \"overwrite\": true
    }"
  echo "Created dashboard: $ROOM_NAME (uid: $DASH_UID)"
}

create_dashboard "warm_lab"     "Warm Lab"     "warm-lab-telemetry"
create_dashboard "cold_lab"     "Cold Lab"     "cold-lab-telemetry"
create_dashboard "compute_cube" "Compute Cube" "compute-cube-telemetry"
create_dashboard "cloud"        "Cloud"        "cloud-telemetry"

echo ""
echo "All dashboards created. Verify at $GRAFANA_URL/dashboards"
echo ""
echo "Quick check:"
curl -s "$GRAFANA_URL/api/search?tag=telemetry" -u "$AUTH" | python3 -m json.tool 2>/dev/null | grep -E '"title"|"uid"' || true
