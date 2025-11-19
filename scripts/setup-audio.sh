#!/bin/bash

# Audio Setup Helper Script
# Helps users find and set up audio files for the AI Psychic Hotline

echo "🔊 AI Psychic Hotline - Audio Setup Helper"
echo ""
echo "This script will help you set up ambient and sound effect audio files."
echo ""

SOUNDS_DIR="public/sounds"

# Check if sounds directory exists
if [ ! -d "$SOUNDS_DIR" ]; then
  echo "Creating sounds directory..."
  mkdir -p "$SOUNDS_DIR"
fi

# Check for ambient.mp3
if [ -f "$SOUNDS_DIR/ambient.mp3" ]; then
  echo "✅ ambient.mp3 found"
  SIZE=$(du -h "$SOUNDS_DIR/ambient.mp3" | cut -f1)
  echo "   Size: $SIZE"
else
  echo "❌ ambient.mp3 not found"
  echo ""
  echo "   Recommended sources for ambient audio:"
  echo "   1. Freesound.org - Search: 'ambient drone', 'wind ambience', 'dark atmosphere'"
  echo "   2. YouTube Audio Library - Filter: ambient, dark"
  echo "   3. MyNoise.net - Wind Noise Generator (export as MP3)"
  echo ""
  echo "   Characteristics needed:"
  echo "   - Low-volume hum or distant wind"
  echo "   - Loops seamlessly (no obvious start/end)"
  echo "   - 30-60 seconds minimum"
  echo "   - MP3 format"
  echo "   - < 1MB file size"
  echo ""
fi

# Check for card-flip.mp3
if [ -f "$SOUNDS_DIR/card-flip.mp3" ]; then
  echo "✅ card-flip.mp3 found"
  SIZE=$(du -h "$SOUNDS_DIR/card-flip.mp3" | cut -f1)
  echo "   Size: $SIZE"
else
  echo "❌ card-flip.mp3 not found"
  echo ""
  echo "   Recommended sources for card flip sound:"
  echo "   1. Freesound.org - Search: 'card flip', 'paper shuffle'"
  echo "   2. Record your own card shuffling"
  echo "   3. Zapsplat.com - Card sounds"
  echo ""
  echo "   Characteristics needed:"
  echo "   - Quick sound (< 1 second)"
  echo "   - Soft paper/card shuffling"
  echo "   - MP3 format"
  echo "   - < 100KB file size"
  echo ""
fi

echo ""
echo "============================================================"
echo "Note: The app will work without audio files (graceful degradation)"
echo "Audio enhances the experience but is not required."
echo "============================================================"
echo ""
echo "After adding audio files, restart the dev server:"
echo "  npm run dev"
