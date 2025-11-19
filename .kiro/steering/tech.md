---
inclusion: always
---

# Tech Stack

## Framework & Core

- **Next.js 16** (App Router) - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript 5.9** - Type-safe JavaScript with strict mode enabled
- **Node.js** - Runtime environment

## Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom CSS** - Component-specific styles in `.css` files alongside components
- **Vanta.js + Three.js** - 3D animated backgrounds (smoke/fog effects)

## AI & APIs

- **Anthropic Claude API** - Fortune generation using `claude-3-5-sonnet-20241022`
- **@anthropic-ai/sdk** - Official Anthropic SDK
- **OpenAI API** - Voice-to-text (Whisper), text-to-speech, and image generation (DALL-E 3)
- **openai** - Official OpenAI SDK

## Testing

- **Jest 30** - Test framework
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests

## Build & Development

- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **SWC** - Fast TypeScript/JavaScript compiler (Next.js default)

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Building
npm run build            # Production build
npm start                # Start production server

# Testing
npm test                 # Run tests in watch mode
npm run test:ci          # Run tests once (CI mode)

# Linting
npm run lint             # Run Next.js linter
```

## Environment Variables

Required in `.env.local`:
- `ANTHROPIC_API_KEY` - Claude API key for fortune generation
- `OPENAI_API_KEY` - OpenAI API key for Whisper, TTS, and DALL-E
- `LLM_MODEL` - Model name (default: claude-3-5-sonnet-20241022)
- `LLM_TIMEOUT` - API timeout in ms (default: 5000)
- `MIN_CARDS` - Minimum cards to draw (default: 3)
- `MAX_CARDS` - Maximum cards to draw (default: 5)
- `TAROT_DECK_PATH` - Path to tarot JSON (default: ./data/tarot.json)

## TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (automatic runtime)
