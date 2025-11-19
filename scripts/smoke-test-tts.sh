#!/bin/bash

# TTS Smoke Test
# Tests the /api/speak endpoint with sample fortune text

echo "🔊 TTS Smoke Test"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ Dev server not running on localhost:3000"
  echo "   Run: npm run dev"
  exit 1
fi

# Test TTS endpoint
echo "Testing: TTS with sample fortune..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/speak \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The cards whisper of change approaching. Trust your intuition.",
    "voice": "onyx"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  # Check if response is audio (binary data)
  if [ -n "$BODY" ]; then
    echo "✅ PASSED - TTS endpoint returned audio"
    echo "   HTTP Status: $HTTP_CODE"
    echo "   Response size: $(echo "$BODY" | wc -c) bytes"
  else
    echo "❌ FAILED - Empty response"
    exit 1
  fi
else
  echo "❌ FAILED - HTTP $HTTP_CODE"
  echo "   Response: $BODY"
  exit 1
fi

echo ""
echo "============================================================"
echo "TTS smoke test completed successfully"
echo "============================================================"
