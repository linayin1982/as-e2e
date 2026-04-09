#!/usr/bin/env bash
# softcar_ecall_flow.sh — Simulates a full ECALL flow via the VCC Soft-car simulator
# Usage: ./softcar_ecall_flow.sh [VIN] [SERVICE_TYPE]
#
# Defaults:
#   VIN          = VIN000SOFTCARTEST (17 chars)
#   SERVICE_TYPE = ECALL (options: ECALL ACN ACNADVANCED BCALL ICALL WCALL ASTCALL SCALL)

set -euo pipefail

BASE_URL="https://vcc-vocmo-soft-car.qa.voc.eu-west-1.wcar.aws.wcar-i.net"
VIN="${1:-VIN000SOFTCARTEST}"
SERVICE_TYPE="${2:-ECALL}"
ROUTING_CALL_CENTER_ID="22"
POSITION1="57.702834,11.977007"
POSITION2="57.703500,11.978500"

echo "========================================"
echo " VCC Soft-car ECALL Flow Simulator"
echo "========================================"
echo "  BASE_URL     : $BASE_URL"
echo "  VIN          : $VIN"
echo "  SERVICE_TYPE : $SERVICE_TYPE"
echo "========================================"
echo ""

# ─── STEP 1: Start new case ──────────────────────────────────────────────────
echo "▶ STEP 1: Starting new $SERVICE_TYPE case..."

RESPONSE=$(curl -s -X POST \
  "$BASE_URL/vehicles/$VIN/services?serviceType=$SERVICE_TYPE&routingCallCenterId=$ROUTING_CALL_CENTER_ID&position1=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$POSITION1'))")&destination=C3" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "  Response: $RESPONSE"

# Extract serviceId — expected to be a plain UUID string in the response
SERVICE_ID=$(echo "$RESPONSE" | tr -d '"' | tr -d ' ')

if [[ -z "$SERVICE_ID" || "$SERVICE_ID" == *"error"* || "$SERVICE_ID" == *"Error"* ]]; then
  echo "❌ Failed to extract serviceId from response. Aborting."
  exit 1
fi

echo "  ✅ serviceId: $SERVICE_ID"
echo ""
sleep 2

# ─── STEP 2: Send position update ────────────────────────────────────────────
echo "▶ STEP 2: Sending position update..."

UPDATE_RESPONSE=$(curl -s -X PUT \
  "$BASE_URL/vehicles/$VIN/services/$SERVICE_ID/sendupdate?serviceTypeFallback=$SERVICE_TYPE&position1=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$POSITION2'))")&destination=C3")

echo "  Response: $UPDATE_RESPONSE"
echo "  ✅ Position update sent"
echo ""
sleep 2

# ─── STEP 3: Terminate acknowledge ───────────────────────────────────────────
echo "▶ STEP 3: Sending terminate acknowledgement..."

TERMINATE_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/vehicles/$VIN/services/$SERVICE_ID/terminateack?serviceTypeFallback=$SERVICE_TYPE&terminateReason=cancelledInVehicle&destination=C3" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "  Response: $TERMINATE_RESPONSE"
echo "  ✅ Terminate acknowledged"
echo ""

# ─── Summary ─────────────────────────────────────────────────────────────────
echo "========================================"
echo " ✅ Flow complete"
echo "  VIN        : $VIN"
echo "  serviceId  : $SERVICE_ID"
echo "  Type       : $SERVICE_TYPE"
echo "  Swagger UI : $BASE_URL/swagger-ui/index.html#/"
echo "========================================"
