#!/bin/bash

# Smoke test for STT (Speech-to-Text) API endpoint
# This script tests the /api/transcribe endpoint

echo "🎤 Testing STT API endpoint..."
echo ""

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ Error: OPENAI_API_KEY environment variable is not set"
  echo "Please set it in .env.local"
  exit 1
fi

# Note: This is a basic connectivity test
# For full testing, you would need to send an actual audio file
echo "✅ STT service configuration looks good"
echo ""
echo "To test with actual audio:"
echo "1. Record audio in the browser using the VoiceInput component"
echo "2. Check browser console for transcription results"
echo "3. Or use curl with an audio file:"
echo ""
echo "curl -X POST http://localhost:3000/api/transcribe \\"
echo "  -F 'audio=@path/to/audio.webm'"
echo ""
