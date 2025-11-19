# Sound Assets

This directory contains ambient and UI sound effects for the AI Psychic Hotline.

## Required Files

### ambient.mp3
- **Purpose**: Background ambient soundscape
- **Characteristics**: 
  - Low-volume hum or distant wind
  - Subtle, non-intrusive
  - Loops seamlessly
  - Creates séance atmosphere
- **Recommended sources**:
  - Freesound.org (search: "ambient drone", "wind ambience", "dark atmosphere")
  - YouTube Audio Library (filter: ambient, dark)
  - Generate with: https://mynoise.net/NoiseMachines/windNoiseGenerator.php

### card-flip.mp3
- **Purpose**: Card reveal sound effect
- **Characteristics**:
  - Soft, quick sound (< 1 second)
  - Paper/card shuffling sound
  - Not too loud or jarring
- **Recommended sources**:
  - Freesound.org (search: "card flip", "paper shuffle")
  - Record your own card shuffling
  - Use online SFX generators

## How to Add Sounds

1. Download or create the audio files
2. Convert to MP3 format (for browser compatibility)
3. Place in this directory with exact names: `ambient.mp3` and `card-flip.mp3`
4. Keep file sizes small (< 1MB each)

## Fallback Behavior

If sound files are missing:
- The app will still work normally
- Console will show warnings but won't break
- Users won't hear audio (graceful degradation)

## Audio Implementation

- **Ambient audio**: Starts on first user click (browser autoplay rules)
- **Card flip**: Plays when cards are revealed
- **Volume**: Ambient at 30%, card flip at 50%
- **User control**: Can be muted via browser controls

## License Notes

Ensure any audio files used are:
- Royalty-free or properly licensed
- Attributed if required
- Suitable for commercial use (if applicable)
