---
inclusion: always
---

# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── fortune/       # Fortune generation endpoint
│   ├── __tests__/         # Page-level tests
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Home page (main app)
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components
├── services/              # Business logic and external integrations
└── types/                 # TypeScript type definitions

data/                      # Static data files
├── tarot.json            # Tarot card definitions
└── movies.json           # Movie database for recommendations

public/
└── cards/                # Tarot card SVG images
```

## Architecture Patterns

### Component Organization

- Components are colocated with their CSS files (e.g., `FateMeter.tsx` + `FateMeter.css`)
- Use `'use client'` directive for client-side interactive components
- Server components by default in App Router

### Service Layer

Services encapsulate business logic and external dependencies:

- **TarotDeck**: Card drawing logic, deck loading from JSON
- **FortuneService**: LLM integration for fortune generation (Anthropic Claude)
- **MovieOracle**: Movie recommendation matching algorithm
- **VoiceService**: Text-to-speech using OpenAI TTS
- **WhisperService**: Speech-to-text using OpenAI Whisper
- **CardImageService**: AI-generated tarot card images using DALL-E 3

Services are instantiated in API routes, not in components.

### Type Definitions

All types centralized in `src/types/`:
- `tarot.ts` - Core domain types (Card, Realm, Fortune, etc.)
- `vanta.d.ts` - Third-party library type declarations

### API Routes

- `/api/fortune` (POST) - Main fortune generation endpoint
- `/api/speak` (POST) - Text-to-speech conversion
- `/api/transcribe` (POST) - Voice-to-text transcription
- `/api/generate-card` (POST) - DALL-E card image generation
- Request validation with descriptive error messages
- Structured JSON logging (no PII)
- Error handling with user-friendly messages that stay in character

### State Management

- Local component state with `useState` (no global state library)
- View state machine pattern in main page component
- Props drilling for simple component tree

### Styling Conventions

- Tailwind for layout and utilities
- CSS modules/files for complex component-specific styles
- CSS custom properties in `globals.css` for theming
- Inline styles for dynamic values (e.g., colors, shadows)

### Data Files

- JSON files in `data/` directory loaded server-side
- Tarot deck loaded once on first API request
- Movies loaded into memory for fast matching

## File Naming

- React components: PascalCase (e.g., `AppShell.tsx`)
- Services: PascalCase (e.g., `FortuneService.ts`)
- Types: camelCase (e.g., `tarot.ts`)
- API routes: lowercase (e.g., `route.ts`)
- CSS files: match component name (e.g., `FateMeter.css`)
