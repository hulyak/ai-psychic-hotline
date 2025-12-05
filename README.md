# 🔮 AI Psychic Hotline

> *Ask a question. Draw the cards. Hear what the spirits say.*

A spooky, immersive fortune-telling web app that combines tarot card readings with AI-generated fortunes, voice interaction, 3D atmospheric effects, and movie recommendations. Built for a Halloween hackathon using spec-driven development with Kiro.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

## ✨ Features

### Core Experience
- 🎴 **Tarot Card Readings** - Draw 3-5 cards from a complete Major Arcana deck
- 🌙 **Three Mystical Realms** - Love, Fate, or Shadows, each with distinct tone and personality
- 🤖 **AI-Generated Fortunes** - Personalized readings using Claude AI that reference your cards
- 🎙️ **Voice Input** - Speak your question using Whisper speech-to-text
- 🔊 **Spooky Voice Output** - Hear fortunes read aloud in eerie voices using OpenAI TTS
- 🎬 **Movie Oracle** - Get horror/thriller movie recommendations matching your reading's themes

### Immersive Atmosphere
- 🌫️ **3D Volumetric Fog** - Vanta.js fog effects with custom orange/green color palette
- 🎵 **Ambient Soundscape** - Low-volume atmospheric audio with card flip sound effects
- 🎨 **Dark Mystical UI** - Candlelit séance aesthetic (no purple!)
- ✨ **Smooth Animations** - Card reveals, transitions, and interactive elements

### Advanced Features
- 🎭 **Multiple Personas** - Choose from Mystic, Wise Witch, Corporate Oracle, or Kind Therapist
- 📚 **Multiple Decks** - Tarot or Career Guidance deck
- ⚖️ **Fate Meter** - Accept or defy your omen with consequences
- 🖼️ **AI-Generated Card Art** - Optional DALL-E 3 generated unique tarot card images
- 📤 **Share Readings** - Export and share your fortune

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for Whisper, TTS, DALL-E)
- Anthropic API key (for Claude)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-psychic-hotline.git
cd ai-psychic-hotline

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional (defaults provided)
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_TIMEOUT=5000
MIN_CARDS=3
MAX_CARDS=5
TAROT_DECK_PATH=./data/tarot.json
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to experience the mystical journey.

### Build for Production

```bash
npm run build
npm start
```

## 🎮 How to Use

1. **Select Your Realm** - Choose Love (💕), Fate (⚡), or Shadows (🌑)
2. **Ask Your Question** - Type or speak your question to the spirits
3. **Draw the Cards** - Watch as 3-5 tarot cards are revealed
4. **Receive Your Fortune** - Read or listen to your personalized mystical reading
5. **Get a Movie Recommendation** - Discover a film that matches your reading's energy
6. **Face Your Fate** - Choose to accept or defy the omen

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 4, Custom CSS, Vanta.js + Three.js
- **AI/APIs**: Anthropic Claude, OpenAI (Whisper, TTS, DALL-E 3)
- **Testing**: Jest 30, React Testing Library
- **Quality**: Custom MCP tools for domain-specific validation

### Project Structure

```
ai-psychic-hotline/
├── .kiro/
│   ├── specs/              # Spec-driven development docs
│   │   └── ai-psychic-hotline/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   ├── steering/           # Project guidance docs
│   │   ├── colors.md       # Color palette (no purple!)
│   │   ├── psychic-persona.md
│   │   └── engineering.md
│   ├── hooks/              # Automation hooks
│   └── mcp/                # Custom MCP server
│       └── psychic-hotline-server.js
├── src/
│   ├── app/
│   │   ├── api/            # Next.js API routes
│   │   │   ├── fortune/
│   │   │   ├── speak/
│   │   │   └── transcribe/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # React components
│   ├── services/           # Business logic
│   │   ├── FortuneService.ts
│   │   ├── TarotDeck.ts
│   │   ├── VoiceService.ts
│   │   └── WhisperService.ts
│   └── types/              # TypeScript types
├── data/
│   ├── tarot.json          # Tarot card definitions
│   ├── career.json         # Career guidance deck
│   └── movies.json         # Movie database
├── public/
│   ├── cards/              # Tarot card SVG images
│   └── sounds/             # Audio files
└── scripts/
    ├── test-fortune-api.js
    └── test-with-mcp-tools.js
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# CI mode (single run)
npm run test:ci

# Fortune API smoke test
node scripts/test-fortune-api.js

# MCP quality validation
node scripts/test-with-mcp-tools.js
```

### MCP Quality Tools

Custom MCP server provides domain-specific quality validation:

- **validate_tarot_deck** - Validates deck structure and completeness
- **test_fortune_quality** - Tests fortunes against persona guidelines
- **check_card_images** - Verifies all card images exist
- **analyze_realm_consistency** - Tests tone consistency across realms

These tools caught quality issues that standard tests missed, resulting in a 33% reduction in fortune length and 90%+ compliance with guidelines.

## 🎨 Customization

### Adding New Realms
1. Update `src/types/tarot.ts` with new realm type
2. Add realm context in `src/services/FortuneService.ts`
3. Update persona guidelines in `.kiro/steering/psychic-persona.md`

### Adding New Personas
1. Define persona in `src/config/personas.ts`
2. Add system prompt and voice preference

### Audio Files
Place audio files in `public/sounds/`:
- `ambient.mp3` - Background atmosphere
- `card-flip.mp3` - Card reveal sound

## 🚀 Deployment

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
4. Deploy

### Environment Variables

Required:
```env
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

Optional (defaults provided):
```env
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_TIMEOUT=5000
MIN_CARDS=3
MAX_CARDS=5
```

## 📚 Documentation

- **[KIRO_USAGE.md](KIRO_USAGE.md)** - How Kiro was used to build this project
- **[docs/HACKATHON_SUBMISSION_FINAL.md](docs/HACKATHON_SUBMISSION_FINAL.md)** - Hackathon submission details
- **[.kiro/specs/](/.kiro/specs/)** - Complete specifications
- **[.kiro/steering/](/.kiro/steering/)** - Project guidance docs

## 🛠️ Development with Kiro

This project was built using **spec-driven development** with Kiro:

1. **Specs First** - Started with PRD, SRS, and SDD documents
2. **Kiro Spec Generation** - Kiro converted docs into structured specs
3. **Steering Docs** - Used steering docs to maintain consistency (especially colors!)
4. **MCP Tools** - Built custom quality validation tools
5. **Hooks** - Automated testing on file save

### Key Steering Docs

- **colors.md** - Enforces orange/green palette, bans purple
- **psychic-persona.md** - Fortune generation guidelines (3-6 sentences, max 120 words)
- **engineering.md** - Architecture patterns (service-driven design)
- **structure.md** - File organization and naming conventions

### Kiro Hooks

- **test-after-service-change** - Runs tests when service files are saved

## 🔧 Troubleshooting

### Common Issues

**Fortune Generation Fails**
- Check `ANTHROPIC_API_KEY` is set in `.env.local`
- Verify API key is valid and has credits
- Restart dev server after changing keys

**Voice Input Not Working**
- Grant microphone permissions in browser
- Check `OPENAI_API_KEY` is set
- Use HTTPS or localhost (required for microphone)

**Voice Output Not Playing**
- Check `OPENAI_API_KEY` and credits
- Ensure browser audio is not muted
- Click button after user interaction (autoplay policy)

**Cards Not Displaying**
- Verify `public/cards/` directory contains SVG files
- Check browser console for 404 errors
- Clear browser cache

**Build Errors**
- Delete `node_modules` and `.next` directories
- Run `npm install` again
- Check Node.js version (18+ required)

## 🔒 Security

- Input sanitization to prevent XSS
- Rate limiting (10 requests/min per IP)
- API keys stored server-side only
- CORS configuration for production
- HTTPS enforcement

Run security checks: `npm run verify-security`

## 🎯 Quality Metrics

- ✅ **Test Coverage**: 28/28 tests passing (including security tests)
- ✅ **Fortune Quality**: 5-6/6 MCP checks passing
- ✅ **Length Compliance**: 90%+ fortunes within 100-600 character limit
- ✅ **Card Images**: 22/22 images present
- ✅ **Deck Validation**: Complete Major Arcana
- ✅ **TypeScript**: Strict mode, no errors
- ✅ **Security**: All checks passing
- ✅ **Purple Incidents**: 0 (after steering doc) 🎉

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Kiro** - For spec-driven development and steering docs
- **Anthropic Claude** - For mystical fortune generation
- **OpenAI** - For Whisper, TTS, and DALL-E
- **Vanta.js** - For atmospheric 3D fog effects

## 🔗 Links

- [Kiro Documentation](https://kiro.ai/docs)
- [Hackathon Submission](docs/HACKATHON_SUBMISSION_FINAL.md)

---

*"The cards whisper of code well-written and tests that pass. Trust the process, for the spirits of good architecture guide your path."* 🕯️👻
