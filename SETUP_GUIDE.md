# AI Psychic Hotline - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys

Add your API keys to `.env.local`:

```bash
# Required: For fortune generation
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Required: For voice, TTS, and DALL-E features
OPENAI_API_KEY=sk-your-openai-key-here
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to http://localhost:3000

## Getting API Keys

### Anthropic API Key (Required)

**Step-by-Step:**

1. **Sign Up**
   - Go to [console.anthropic.com](https://console.anthropic.com/)
   - Click "Sign Up" (or "Sign In" if you have an account)
   - Complete registration with email verification

2. **Add Credits**
   - Navigate to "Billing" in the console
   - Add payment method
   - Purchase credits (minimum $5)
   - Note: New accounts may get free trial credits

3. **Create API Key**
   - Go to "API Keys" section
   - Click "Create Key"
   - Give it a name (e.g., "AI Psychic Hotline")
   - Copy the key immediately (you won't see it again!)

4. **Add to Project**
   - Open `.env.local` in your project
   - Add: `ANTHROPIC_API_KEY=sk-ant-your-key-here`
   - Save the file
   - Restart your dev server

**Cost Estimate:**
- Claude 3.5 Sonnet: ~$0.003-0.015 per reading
- $5 credit = ~300-1500 readings
- Monitor usage in Anthropic console

**Security:**
- Never commit API keys to git
- Don't share keys publicly
- Rotate keys if exposed
- Set up usage limits in console

### OpenAI API Key (Required for Voice/Image Features)

**Step-by-Step:**

1. **Sign Up**
   - Go to [platform.openai.com](https://platform.openai.com/)
   - Click "Sign Up" (or "Log In")
   - Complete registration

2. **Add Credits**
   - Navigate to "Billing" → "Payment methods"
   - Add payment method
   - Add credits or set up auto-recharge
   - Note: New accounts may get $5 free credit

3. **Create API Key**
   - Go to "API Keys" section
   - Click "Create new secret key"
   - Give it a name (e.g., "Psychic Hotline")
   - Copy the key immediately!

4. **Add to Project**
   - Open `.env.local`
   - Add: `OPENAI_API_KEY=sk-your-key-here`
   - Save and restart server

**Cost Estimate:**
- Whisper (STT): ~$0.006 per minute of audio
- TTS: ~$0.015 per 1000 characters
- DALL-E 3: ~$0.04 per image (expensive!)
- Typical reading without DALL-E: ~$0.01
- With DALL-E (3-5 cards): ~$0.13-0.21

**Features by API:**
- **Whisper**: Voice input (speech-to-text)
- **TTS**: Voice output (text-to-speech)
- **DALL-E 3**: AI-generated card images

**Security:**
- Keep keys secret
- Monitor usage in OpenAI dashboard
- Set spending limits
- Rotate keys if compromised

### API Key Best Practices

1. **Environment Variables**
   - Always use `.env.local` for local development
   - Use platform environment variables for production
   - Never hardcode keys in source code

2. **Git Safety**
   - Verify `.env.local` is in `.gitignore`
   - Check before committing: `git status`
   - Use `git secrets` tool to prevent key commits

3. **Monitoring**
   - Check usage daily during development
   - Set up billing alerts
   - Monitor for unusual activity
   - Review API logs regularly

4. **Key Rotation**
   - Rotate keys every 90 days
   - Rotate immediately if exposed
   - Update all environments when rotating

5. **Access Control**
   - Use separate keys for dev/staging/prod
   - Limit key permissions if possible
   - Don't share keys between projects

## Features & Requirements

| Feature | API Required | Cost |
|---------|-------------|------|
| Fortune Generation | Anthropic | ~$0.003-0.015 per reading |
| Voice Input (Whisper) | OpenAI | ~$0.006 per minute |
| Voice Output (TTS) | OpenAI | ~$0.015 per 1000 chars |
| AI Card Images (DALL-E) | OpenAI | ~$0.04 per image |
| Movie Recommendations | None | Free |

## Troubleshooting

### "The spirits cannot speak at this time"
**Problem**: TTS not working

**Solution**: 
1. Check `OPENAI_API_KEY` is set in `.env.local`
2. Verify the key is valid and has credits
3. Restart the dev server after adding the key

### "The spirits cannot hear you"
**Problem**: Voice input not working

**Solution**:
1. Check `OPENAI_API_KEY` is set in `.env.local`
2. Grant microphone permissions in your browser
3. Ensure you're using HTTPS or localhost

### "The veil between worlds has torn"
**Problem**: Fortune generation failing

**Solution**:
1. Check `ANTHROPIC_API_KEY` is set in `.env.local`
2. Verify the key is valid and has credits
3. Check server logs for detailed error messages

### "Card images remain hidden in shadow"
**Problem**: DALL-E generation failing

**Solution**:
1. Check `OPENAI_API_KEY` is set in `.env.local`
2. Verify you have sufficient API credits
3. DALL-E 3 is expensive - consider using default cards

## Environment Variables Reference

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...        # Claude API key
OPENAI_API_KEY=sk-...               # OpenAI API key

# Optional - LLM Configuration
LLM_MODEL=claude-3-5-sonnet-20241022  # Claude model
LLM_TIMEOUT=5000                      # API timeout (ms)

# Optional - Tarot Configuration
TAROT_DECK_PATH=./data/tarot.json   # Path to tarot deck
MIN_CARDS=3                          # Min cards per reading
MAX_CARDS=5                          # Max cards per reading

# Optional - Server
NODE_ENV=development
PORT=3000
```

## Testing Features

### Test Fortune Generation
1. Select a realm (Love, Fate, or Shadows)
2. Type a question
3. Click "Summon Reading"
4. Should see cards and fortune in ~2-3 seconds

### Test Voice Input
1. Click the microphone button
2. Speak your question clearly
3. Should transcribe automatically
4. Requires `OPENAI_API_KEY`

### Test Voice Output
1. Complete a reading
2. Click "Hear the Spirits"
3. Should play audio in ~1-2 seconds
4. Requires `OPENAI_API_KEY`

### Test DALL-E Cards
1. Check "Generate unique card images with DALL-E"
2. Submit your question
3. Wait 15-30 seconds for unique cards
4. Requires `OPENAI_API_KEY` and costs ~$0.12-0.20

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests once (CI)
npm run test:ci

# Lint code
npm run lint
```

## Browser Requirements

- **Modern browser**: Chrome, Firefox, Safari, or Edge (latest)
- **Microphone access**: For voice input feature
- **JavaScript enabled**: Required for all features
- **HTTPS or localhost**: Required for microphone access

## Cost Estimates

### Typical Reading (without DALL-E)
- Fortune generation: ~$0.003-0.015
- Voice input (30 sec): ~$0.003
- Voice output (100 chars): ~$0.0015
- **Total**: ~$0.01 per reading

### With DALL-E (3-5 cards)
- Add $0.12-0.20 per reading
- **Total**: ~$0.13-0.21 per reading

## Customizing Tarot Decks

### Understanding Deck Structure

Tarot decks are stored as JSON files in the `data/` directory. Each deck follows this structure:

```json
{
  "cards": [
    {
      "id": "fool",
      "name": "The Fool",
      "uprightMeaning": "New beginnings, innocence, spontaneity, free spirit",
      "reversedMeaning": "Recklessness, taken advantage of, inconsideration",
      "imageUrl": "/cards/fool.svg"
    }
  ]
}
```

### Modifying Existing Decks

**To Edit Card Meanings:**

1. Open `data/tarot.json` (or other deck file)
2. Find the card you want to modify
3. Edit `uprightMeaning` or `reversedMeaning`
4. Save the file
5. Restart the server (changes are cached)

**Example - Making The Tower Less Scary:**
```json
{
  "id": "tower",
  "name": "The Tower",
  "uprightMeaning": "Necessary change, breakthrough, revelation",
  "reversedMeaning": "Avoiding change, fear of transformation",
  "imageUrl": "/cards/tower.svg"
}
```

### Creating a New Deck

**Step 1: Create Deck File**

Create `data/my-deck.json`:
```json
{
  "cards": [
    {
      "id": "card-1",
      "name": "Card Name",
      "uprightMeaning": "Positive meaning here",
      "reversedMeaning": "Challenging meaning here",
      "imageUrl": "/cards/card-1.svg"
    }
  ]
}
```

**Step 2: Add Card Images**

1. Create SVG or PNG images for each card
2. Place in `public/cards/` directory
3. Name them to match `imageUrl` in JSON
4. Recommended size: 300x500px

**Step 3: Register Deck**

Edit `src/config/decks.ts`:
```typescript
export const DECK_PRESETS: Record<DeckType, DeckInfo> = {
  // ... existing decks
  'my-deck': {
    id: 'my-deck',
    name: 'My Custom Deck',
    description: 'Description of your deck',
    icon: '🎴',
    dataPath: './data/my-deck.json'
  }
};
```

**Step 4: Update Types**

Edit `src/types/tarot.ts`:
```typescript
export type DeckType = 'tarot' | 'career' | 'product' | 'self-care' | 'my-deck';
```

**Step 5: Test**

```bash
# Restart server
npm run dev

# Test deck loading
node scripts/test-fortune-api.js
```

### Deck Design Guidelines

**Card Count:**
- Minimum: 10 cards (for variety)
- Recommended: 20-30 cards
- Traditional tarot: 22 Major Arcana

**Meanings:**
- Keep meanings concise (1-2 sentences)
- Upright = positive/neutral interpretation
- Reversed = challenging/shadow interpretation
- Use clear, understandable language

**Themes:**
- Stay consistent within a deck
- Consider your target audience
- Match tone to use case (mystical, professional, therapeutic)

**Images:**
- Use SVG for scalability
- Keep file sizes small (< 50KB)
- Ensure good contrast for dark backgrounds
- Test on mobile devices

### Example: Career Guidance Deck

The project includes `data/career.json` as an example:

```json
{
  "id": "promotion",
  "name": "The Promotion",
  "uprightMeaning": "Recognition, advancement, achievement of goals",
  "reversedMeaning": "Missed opportunities, lack of recognition, stagnation",
  "imageUrl": "/cards/promotion.svg"
}
```

**Use Cases:**
- Professional development questions
- Career path decisions
- Workplace challenges
- Leadership guidance

### Validating Your Deck

**Manual Validation:**
1. Check all `imageUrl` paths exist
2. Verify JSON is valid (use JSONLint)
3. Test each card appears in readings
4. Check meanings make sense in context

**Automated Validation:**
```bash
# Use MCP validation tool
node scripts/test-with-mcp-tools.js
```

This checks:
- All required fields present
- Image files exist
- No duplicate IDs
- Valid JSON structure

### Deck-Specific Fortunes

To customize fortune generation for your deck:

1. **Edit Fortune Prompts**
   - Open `src/services/FortuneService.ts`
   - Modify `buildPrompt()` method
   - Add deck-specific context

2. **Example:**
```typescript
private buildPrompt(request: FortuneRequest): string {
  let context = '';
  
  if (request.deckType === 'career') {
    context = 'Focus on professional growth and career guidance.';
  } else if (request.deckType === 'my-deck') {
    context = 'Your custom context here.';
  }
  
  return `${context}\n\nThe seeker asks: ${request.question}...`;
}
```

### Sharing Your Deck

To share your custom deck:

1. **Export Deck Files**
   - Copy `data/my-deck.json`
   - Copy card images from `public/cards/`
   - Include a README with deck description

2. **Document Deck**
   - Explain theme and purpose
   - List all cards with meanings
   - Provide usage examples
   - Include attribution for images

3. **License Considerations**
   - Ensure you have rights to images
   - Choose appropriate license (MIT, CC, etc.)
   - Credit original artists

## Next Steps

1. ✅ Add API keys to `.env.local`
2. ✅ Start dev server with `npm run dev`
3. ✅ Test basic fortune generation
4. ✅ Test voice features (optional)
5. ✅ Test DALL-E cards (optional, expensive)
6. 🎨 Customize decks (optional)
7. 🚀 Deploy to production when ready

## Production Deployment

Before deploying:
1. Set environment variables in your hosting platform
2. Consider rate limiting API endpoints
3. Add usage analytics for cost tracking
4. Consider caching DALL-E images
5. Set up error monitoring (e.g., Sentry)
