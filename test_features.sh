#!/bin/bash

# 🧪 EcoSaathi Feature Testing Script
# Tests City Eco Score + WhatsApp Bot Integration
# Usage: bash test_features.sh

API_BASE="http://localhost:5000/api"
JWT_TOKEN="${1:-your_jwt_token_here}"

echo "🌿 EcoSaathi Feature Test Suite"
echo "================================\n"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: City Eco Score
echo -e "${YELLOW}Test 1: City Eco Score${NC}"
echo "GET /api/spots/stats/eco-score"
echo "---"

SCORE=$(curl -s "$API_BASE/spots/stats/eco-score?city=Tirupati")
echo "$SCORE" | jq '.' 2>/dev/null || echo "$SCORE"

echo ""
echo -e "${GREEN}✓ City Eco Score test complete${NC}\n"

# Test 2: Bot Registration
echo -e "${YELLOW}Test 2: Bot Registration${NC}"
echo "POST /api/bot/register"
echo "---"

BOT_REG=$(curl -s -X POST "$API_BASE/bot/register" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preferred_time": "21:00"}')

echo "$BOT_REG" | jq '.' 2>/dev/null || echo "$BOT_REG"

echo ""
echo -e "${GREEN}✓ Bot registration test complete${NC}\n"

# Test 3: Get Bot Status
echo -e "${YELLOW}Test 3: Get Bot Status${NC}"
echo "GET /api/bot/status"
echo "---"

BOT_STATUS=$(curl -s "$API_BASE/bot/status" \
  -H "Authorization: Bearer $JWT_TOKEN")

echo "$BOT_STATUS" | jq '.' 2>/dev/null || echo "$BOT_STATUS"

echo ""
echo -e "${GREEN}✓ Bot status test complete${NC}\n"

# Test 4: Simulate Webhook Message
echo -e "${YELLOW}Test 4: Webhook Message (Simulate WhatsApp)${NC}"
echo "POST /api/bot/webhook"
echo "---"

WEBHOOK=$(curl -s -X POST "$API_BASE/bot/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "919876543210",
            "text": { "body": "Y" }
          }]
        }
      }]
    }]
  }')

echo "$WEBHOOK" | jq '.' 2>/dev/null || echo "$WEBHOOK"

echo ""
echo -e "${GREEN}✓ Webhook test complete${NC}\n"

# Test 5: Get Insights
echo -e "${YELLOW}Test 5: Get Bot Insights${NC}"
echo "GET /api/bot/insights"
echo "---"

INSIGHTS=$(curl -s "$API_BASE/bot/insights" \
  -H "Authorization: Bearer $JWT_TOKEN")

echo "$INSIGHTS" | jq '.' 2>/dev/null || echo "$INSIGHTS"

echo ""
echo -e "${GREEN}✓ Insights test complete${NC}\n"

# Test 6: Update Preferences
echo -e "${YELLOW}Test 6: Update Bot Preferences${NC}"
echo "PATCH /api/bot/preferences"
echo "---"

PREFS=$(curl -s -X PATCH "$API_BASE/bot/preferences" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preferred_time": "22:00"}')

echo "$PREFS" | jq '.' 2>/dev/null || echo "$PREFS"

echo ""
echo -e "${GREEN}✓ Preferences update test complete${NC}\n"

# Summary
echo "================================"
echo -e "${GREEN}All tests completed!${NC}"
echo ""
echo "💡 Tips:"
echo "  - Replace 'your_jwt_token_here' with actual JWT token"
echo "  - Make sure backend is running on :5000"
echo "  - Check MongoDB is connected"
echo ""
