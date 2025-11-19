# Design Document

## Overview

The AI Psychic Hotline is implemented as a single-page web application (SPA) with a RESTful backend service. The architecture separates concerns between UI rendering, business logic, and external API integrations. The system orchestrates tarot card selection, LLM-based fortune generation, and optional STT/TTS services to create a cohesive, spooky fortune-telling experience.

### Design Goals

- **Clear separation of concerns**: UI rendering vs. business logic vs. external API integration
- **Hackathon-friendly**: Small, well-structured codebase that's easy to understand and demo
- **Extensible**: Easy to add new spreads, themes, or AI personas
- **Secure**: API keys protected server-side, no PII storage
- **Resilient**: Graceful degradation when external services fail

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (SPA)                │
│  ┌─────────────────────────────────┐   │
│  │  React Components               │   │
│  │  - AppShell                     │   │
│  │  - QuestionInputPanel           │   │
│  │  - TarotSpreadView              │   │
│  │  - FortuneView                  │   │
│  │  - ErrorBanner                  │   │
│  └─────────────────────────────────┘   │
│              │ HTTPS/JSON               │
└──────────────┼──────────────────────────┘
               │
┌──────────────┼──────────────────────────┐
│              ▼                           │
│        Backend (Node.js)                │
│  ┌─────────────────────────────────┐   │
│  │  Controllers                    │   │
│  │  - ReadingController            │   │
│  │  - STTController (optional)     │   │
│  │  - TTSController (optional)     │   │
│  └─────────────────────────────────┘   │
│              │                           │
│  ┌─────────────────────────────────┐   │
│  │  Services                       │   │
│  │  - TarotDeck                    │   │
│  │  - FortuneService               │   │
│  │  - STTService (optional)        │   │
│  │  - TTSService (optional)        │   │
│  └─────────────────────────────────┘   │
│              │                           │
└──────────────┼───────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌─────┐ ┌─────┐
│  LLM   │ │ STT │ │ TTS │
│  API   │ │ API │ │ API │
└────────┘ └─────┘ └─────┘
```

### Technology Stack

**Frontend:**
- React (or Next.js in SPA mode)
- CSS-in-JS or Tailwind for styling
- Fetch API or Axios for HTTP requests
- Browser Web Audio API for TTS playback

**Backend:**
- Node.js with Express or Fastify
- Environment variables for configuration
- JSON file storage for tarot deck data

**External Services:**
- LLM API (e.g., OpenAI GPT-4, Anthropic Claude)
- STT API (e.g., OpenAI Whisper, browser Web Speech API)
- TTS API (e.g., ElevenLabs, OpenAI TTS, browser Web Speech API)

## Components and Interfaces

### Frontend Components

#### AppShell
**Responsibility:** Provides global layout, background, and spooky theme styling

**Props:** None (root component)

**State:**
- Current view state (input, loading, display, error)

**Key Features:**
- Dark theme with Halloween color palette (purples, blacks, oranges)
- Animated background (optional: floating particles, fog effects)
- Responsive layout for mobile and desktop

#### QuestionInputPanel
**Responsibility:** Captures user question via text or voice

**Props:**
- `onSubmit: (question: string) => void`
- `isLoading: boolean`
- `voiceEnabled: boolean`

**State:**
- `questionText: string`
- `isRecording: boolean`

**Key Features:**
- Textarea for question input
- "Summon the Spirits" submit button (disabled when empty or loading)
- Optional "Speak Your Question" button for voice input
- Input validation (non-empty check)

#### TarotSpreadView
**Responsibility:** Displays selected tarot cards in a spread layout

**Props:**
- `cards: Array<{ id: string, name: string, orientation: 'upright' | 'reversed', imageUrl: string }>`

**Key Features:**
- Card images displayed in a horizontal or arc layout
- Card flip animation on reveal
- Orientation indicator (upright/reversed)
- Responsive grid for mobile

#### FortuneView
**Responsibility:** Displays AI-generated fortune and controls

**Props:**
- `fortune: string`
- `onNewReading: () => void`
- `onPlayAudio: () => void` (optional)
- `ttsEnabled: boolean`

**Key Features:**
- Fortune text with mystical typography
- "New Reading" button
- Optional "Hear Your Fortune" button for TTS
- Fade-in animation

#### ErrorBanner
**Responsibility:** Displays user-friendly error messages

**Props:**
- `message: string`
- `onRetry: () => void`

**Key Features:**
- Dismissible banner
- Retry button
- Themed error styling (not harsh red, but mystical purple/orange)

### Backend Modules

#### TarotDeck
**Responsibility:** Manages tarot deck data and card selection

**Interface:**
```typescript
interface Card {
  id: string;
  name: string;
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
}

class TarotDeck {
  private cards: Card[];
  
  constructor(deckPath: string);
  loadDeck(): void;
  drawCards(count: number): Array<{
    card: Card;
    orientation: 'upright' | 'reversed';
  }>;
}
```

**Key Features:**
- Loads tarot deck from `tarot.json`
- Random card selection without replacement
- Random orientation assignment
- Validates deck data on load

#### FortuneService
**Responsibility:** Generates fortunes using LLM API

**Interface:**
```typescript
interface FortuneRequest {
  question: string;
  cards: Array<{
    name: string;
    orientation: 'upright' | 'reversed';
    meaning: string;
  }>;
}

class FortuneService {
  constructor(apiKey: string, model: string);
  
  async generateFortune(request: FortuneRequest): Promise<string>;
  private buildPrompt(request: FortuneRequest): string;
  private callLLM(prompt: string): Promise<string>;
}
```

**Key Features:**
- Constructs LLM prompt with question, cards, and tone instructions
- Calls LLM API with timeout (5 seconds)
- Parses and cleans LLM response
- Error handling with retries

**Prompt Template:**
```
You are a mystical psychic with an eerie, cryptic voice. A seeker has asked: "{question}"

The cards drawn are:
{card_list}

Provide a fortune that:
- Is 3-4 sentences long
- Uses spooky, mysterious language
- References the cards and their meanings
- Addresses the seeker's question
- Ends with an ominous hint or warning

Do not break character. Do not use modern slang.
```

#### ReadingController
**Responsibility:** Handles HTTP requests for fortune generation

**Endpoints:**
- `POST /api/fortune`

**Interface:**
```typescript
interface FortuneRequestBody {
  question: string;
}

interface FortuneResponse {
  cards: Array<{
    id: string;
    name: string;
    orientation: 'upright' | 'reversed';
    imageUrl: string;
  }>;
  fortune: string;
}

class ReadingController {
  async createReading(req: Request, res: Response): Promise<void>;
}
```

**Flow:**
1. Validate question (non-empty)
2. Draw 3-5 cards using TarotDeck
3. Build fortune request with card meanings
4. Call FortuneService.generateFortune()
5. Return cards and fortune
6. Handle errors (400 for validation, 502 for LLM failure)

#### STTService (Optional)
**Responsibility:** Transcribes audio to text

**Interface:**
```typescript
class STTService {
  constructor(apiKey: string);
  
  async transcribe(audioBlob: Buffer): Promise<string>;
}
```

**Endpoint:**
- `POST /api/stt` (accepts multipart/form-data)

**Key Features:**
- Accepts audio blob from frontend
- Calls STT API (e.g., OpenAI Whisper)
- Returns transcript text
- Timeout and error handling

#### TTSService (Optional)
**Responsibility:** Converts fortune text to audio

**Interface:**
```typescript
class TTSService {
  constructor(apiKey: string);
  
  async synthesize(text: string, voice: string): Promise<string>;
}
```

**Endpoint:**
- `POST /api/tts` (returns audio URL or stream)

**Key Features:**
- Accepts fortune text
- Calls TTS API with eerie voice profile
- Returns audio URL or streams audio
- Caches audio for session (optional)

#### Config
**Responsibility:** Manages application configuration

**Interface:**
```typescript
interface Config {
  llm: {
    apiKey: string;
    model: string;
    timeout: number;
  };
  stt?: {
    apiKey: string;
    enabled: boolean;
  };
  tts?: {
    apiKey: string;
    voice: string;
    enabled: boolean;
  };
  tarot: {
    deckPath: string;
    minCards: number;
    maxCards: number;
  };
}
```

**Key Features:**
- Loads from environment variables
- Validates required fields on startup
- Provides defaults for optional fields

#### Logger
**Responsibility:** Logs requests, errors, and performance metrics

**Interface:**
```typescript
class Logger {
  info(message: string, meta?: object): void;
  error(message: string, error: Error, meta?: object): void;
  timing(operation: string, duration: number): void;
}
```

**Key Features:**
- Structured logging (JSON format)
- No PII in logs (question text excluded by default)
- Timestamps and request IDs
- Performance timing for API calls

## Data Models

### Card
```typescript
interface Card {
  id: string;              // e.g., "tower", "moon"
  name: string;            // e.g., "The Tower", "The Moon"
  uprightMeaning: string;  // Description of upright meaning
  reversedMeaning: string; // Description of reversed meaning
  imageUrl: string;        // Path or URL to card image
}
```

### Reading Response
```typescript
interface ReadingResponse {
  cards: Array<{
    id: string;
    name: string;
    orientation: 'upright' | 'reversed';
    imageUrl: string;
  }>;
  fortune: string;
}
```

### Tarot Deck Data (tarot.json)
```json
{
  "cards": [
    {
      "id": "fool",
      "name": "The Fool",
      "uprightMeaning": "New beginnings, innocence, spontaneity, free spirit",
      "reversedMeaning": "Recklessness, taken advantage of, inconsideration",
      "imageUrl": "/cards/fool.png"
    },
    {
      "id": "tower",
      "name": "The Tower",
      "uprightMeaning": "Sudden upheaval, broken pride, disaster",
      "reversedMeaning": "Disaster avoided, delayed disaster, fear of suffering",
      "imageUrl": "/cards/tower.png"
    }
  ]
}
```

## Error Handling

### Error Categories

1. **Validation Errors (400)**
   - Empty question
   - Invalid request format
   - Response: `{ "error": "Please enter a question to consult the spirits." }`

2. **External Service Errors (502)**
   - LLM API timeout or failure
   - STT/TTS service unavailable
   - Response: `{ "error": "The spirits are silent. Please try again." }`

3. **Server Errors (500)**
   - Unexpected exceptions
   - Deck loading failure
   - Response: `{ "error": "The veil between worlds has torn. Please try again later." }`

### Error Handling Strategy

**Frontend:**
- Display errors in ErrorBanner component
- Provide retry button for recoverable errors
- Degrade gracefully (e.g., hide TTS button if service fails)
- Maintain user's question text on error

**Backend:**
- Wrap all external API calls in try-catch with timeouts
- Log errors with context (no PII)
- Return user-friendly messages (no stack traces)
- Implement exponential backoff for retries (internal only)

## Testing Strategy

### Unit Tests

**Frontend:**
- Component rendering tests (React Testing Library)
- User interaction tests (button clicks, form submission)
- State management tests
- Error state rendering

**Backend:**
- TarotDeck card selection logic (no duplicates, correct count)
- FortuneService prompt construction
- Input validation in controllers
- Error handling paths

### Integration Tests

- End-to-end reading flow (question → cards → fortune)
- STT integration (audio → transcript)
- TTS integration (text → audio)
- Error scenarios (API failures, timeouts)

### Manual Testing

- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness
- Voice input on different devices
- Audio playback quality
- Loading states and animations
- Error message clarity

### Performance Testing

- Reading generation time (target: < 5 seconds)
- LLM API latency
- Frontend bundle size
- Image loading optimization

## Security Considerations

1. **API Key Protection**
   - Store all API keys in environment variables
   - Never expose keys to frontend
   - Use server-side proxy for all external API calls

2. **Input Validation**
   - Sanitize user questions before sending to LLM
   - Limit question length (e.g., 500 characters)
   - Validate audio file size and format for STT

3. **HTTPS**
   - Enforce HTTPS in production
   - Use secure headers (CORS, CSP)

4. **Privacy**
   - No persistent storage of user questions
   - No logging of PII
   - Session-only data retention

5. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Prevent abuse of expensive LLM calls

## Deployment Considerations

### Environment Variables
```
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4
LLM_TIMEOUT=5000

STT_ENABLED=true
STT_API_KEY=...

TTS_ENABLED=true
TTS_API_KEY=...
TTS_VOICE=eerie_male

TAROT_DECK_PATH=./data/tarot.json
MIN_CARDS=3
MAX_CARDS=5

NODE_ENV=production
PORT=3000
```

### Static Assets
- Tarot card images stored in `/public/cards/`
- Optimized for web (WebP format, < 100KB each)
- CDN deployment for production (optional)

### Hosting Options
- Frontend: Vercel, Netlify, or static hosting
- Backend: Vercel serverless functions, Railway, or Render
- Combined: Next.js full-stack deployment

## Movie Oracle Extension

### Overview
The Movie Oracle feature provides personalized horror/thriller movie recommendations based on the themes and energy of each tarot reading. This creates a bridge between the mystical reading experience and tangible entertainment suggestions.

### Data Model

**Movie Entry:**
```typescript
interface Movie {
  id: string;              // e.g., "hereditary", "midsommar"
  title: string;           // e.g., "Hereditary"
  year: number;            // e.g., 2018
  tags: string[];          // e.g., ["grief", "family", "curse", "trauma"]
  oneSentenceBlurb: string; // Non-spoilery description
}
```

**Movie Database (data/movies.json):**
- 10-15 curated horror/thriller/supernatural films
- Each with thematic tags matching tarot themes
- Focus on atmospheric, psychological horror

### Matching Logic

**MovieOracle Service:**
```typescript
class MovieOracle {
  matchMovieToReading(reading: {
    question: string;
    cards: Card[];
    fortune: string;
    mode?: 'love' | 'fate' | 'shadows';
  }): Movie | null;
}
```

**Theme Extraction Strategy:**
1. **Realm-based themes**: Map selected realm to core themes
   - Love → relationships, betrayal, obsession
   - Fate → transformation, power, inevitability
   - Shadows → fear, darkness, secrets

2. **Card-based themes**: Extract themes from major arcana
   - The Tower → upheaval, destruction, chaos
   - The Lovers → relationships, choice, duality
   - Death → transformation, endings, rebirth

3. **Fortune text analysis**: Lightweight keyword matching
   - Scan fortune for thematic keywords
   - Weight matches by frequency

4. **Scoring algorithm**: Calculate overlap between reading themes and movie tags
   - Return highest-scoring movie
   - Return null if no good match (score threshold)

### API Integration

**Extended Response Type:**
```typescript
interface ReadingResponse {
  cards: Array<{...}>;
  fortune: string;
  movieRecommendation?: {
    id: string;
    title: string;
    year: number;
    oneSentenceBlurb: string;
  };
}
```

**Backend Flow:**
1. Generate fortune as usual
2. Call MovieOracle.matchMovieToReading()
3. Include recommendation in response if match found
4. Frontend conditionally displays movie card

### UI Component

**MovieOracle Component:**
- Displayed below fortune panel when recommendation exists
- Header: "This reading feels like..."
- Movie title + year
- One-sentence blurb
- Styled to match altar UI (dark background, orange/green accents)
- Subtle border and shadow effects

## Fate Meter Feature

### Overview
The Fate Meter adds an interactive choice element after each reading, allowing users to "accept" or "defy" their fortune. This creates engagement and adds a playful consequence system.

### User Flow

1. **Fortune Display**: User receives their reading
2. **Choice Prompt**: "How will you face this omen?"
3. **Two Options**:
   - "Accept the Omen" (blessed path)
   - "Defy the Omen" (rebellious path)
4. **Consequence**: Fate meter updates + extra sentence appended

### State Management

**Frontend State:**
```typescript
interface FateMeterState {
  choice: 'accept' | 'defy' | null;
  extraSentence: string;
}
```

**Choice Consequences:**
- **Accept**: 
  - Meter: "Fate meter: Blessed (for now…)"
  - Sentence: "The spirits nod in quiet approval of your resolve."
- **Defy**: 
  - Meter: "Fate meter: Tempting the spirits…"
  - Sentence: "The spirits watch with a crooked smile as you defy their warning."

### Implementation Details

**Frontend-Only Logic:**
- No backend API changes required
- Extra sentence appended to fortune display only
- State resets on new reading

**UI Component (FateMeter):**
- Pill-style buttons with hover effects
- Orange/green accent colors (no purple)
- Clear visual feedback on selection
- Fate meter label displayed after choice
- Smooth transitions and animations

### Visual Design

**Button Styles:**
- "Accept": Primary button (orange gradient)
- "Defy": Secondary button (green outline)
- Hover states: Scale up slightly, glow effect
- Disabled state after selection

**Fate Meter Display:**
- Small badge or label near fortune
- Icon indicator (✨ for blessed, ⚡ for defying)
- Subtle animation on appearance

## Multiple Decks Support

### Overview
The system supports multiple card decks beyond the traditional tarot deck, allowing users to receive guidance from different symbolic systems (e.g., Career Guidance Deck, Self-Care Oracle).

### Data Model

**DeckInfo Interface:**
```typescript
interface DeckInfo {
  id: DeckType;           // e.g., 'tarot', 'career', 'product', 'self-care'
  name: string;           // e.g., "Career Guidance Deck"
  description: string;    // Brief description of deck purpose
  icon: string;           // Icon or emoji for UI
  dataPath: string;       // Path to deck JSON file
}

type DeckType = 'tarot' | 'career' | 'product' | 'self-care';
```

**Deck Data Files:**
- `data/tarot.json` - Traditional Major Arcana tarot deck (22 cards)
- `data/career.json` - Career-focused guidance cards (10 cards)
- `data/product-decision.json` - Product strategy and decision cards (20 cards)
- `data/self-care.json` - Wellness and mental health cards (15 cards)
- Each deck follows the same Card interface structure

### TarotDeck Service Extension

**Updated Interface:**
```typescript
class TarotDeck {
  private cards: Card[];
  private deckPath: string;
  
  constructor(deckPath: string);
  loadDeck(): void;
  drawCards(count: number): Array<{
    card: Card;
    orientation: 'upright' | 'reversed';
  }>;
  getCardCount(): number;
}
```

**Key Features:**
- Constructor accepts dynamic deck path
- Same card drawing logic works for all deck types
- Deck validation ensures consistent structure
- No changes to API contracts required

### Frontend Integration

**Deck Selection (Future):**
- Optional deck selector UI before realm selection
- Default to tarot deck if not specified
- Store selected deck in session state
- Pass deck type to backend via API request

**Current Implementation:**
- Types defined for future extensibility
- Career deck data file exists as example
- Backend can load any deck via TAROT_DECK_PATH env var
- No UI changes required yet

## Persona Presets

### Overview
The system supports multiple AI persona presets that change the fortune-telling style, tone, and voice characteristics. Each persona has a distinct personality and TTS voice.

### Data Model

**PersonaPreset Interface:**
```typescript
interface PersonaPreset {
  id: PersonaType;              // e.g., 'mystic', 'wise-witch'
  name: string;                 // e.g., "The Wise Witch"
  description: string;          // Brief persona description
  systemPrompt: string;         // LLM system prompt for this persona
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}

type PersonaType = 'mystic' | 'wise-witch' | 'corporate-oracle' | 'kind-therapist';
```

**Persona Examples:**
1. **Mystic** (default)
   - Voice: 'onyx' (deep, spooky)
   - Tone: Eerie, cryptic, mysterious
   - System prompt: Current psychic persona

2. **Wise Witch**
   - Voice: 'fable' (warm, wise)
   - Tone: Nurturing but mystical
   - System prompt: Grandmother witch offering guidance

3. **Corporate Oracle**
   - Voice: 'echo' (professional, clear)
   - Tone: Business-focused, practical
   - System prompt: Executive coach with mystical insights

4. **Kind Therapist**
   - Voice: 'nova' (gentle, supportive)
   - Tone: Compassionate, healing
   - System prompt: Therapeutic guidance with card symbolism

### FortuneService Extension

**Updated Interface:**
```typescript
class FortuneService {
  private anthropic: Anthropic;
  private model: string;
  private timeout: number;
  private systemPrompt?: string;  // Optional custom system prompt
  
  constructor(
    apiKey: string, 
    model: string, 
    timeout: number,
    systemPrompt?: string
  );
  
  async generateFortune(request: FortuneRequest): Promise<string>;
  private buildPrompt(request: FortuneRequest): string;
  private callLLM(prompt: string): Promise<string>;
}
```

**Key Features:**
- Constructor accepts optional system prompt override
- Realm-specific tone still applied in buildPrompt()
- System prompt sets overall persona voice
- Backward compatible (defaults to current behavior)

### VoiceService Extension

**Updated Interface:**
```typescript
class VoiceService {
  private openai: OpenAI;
  
  constructor(apiKey: string);
  
  async synthesize(
    text: string, 
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
    speed?: number
  ): Promise<Buffer>;
}
```

**Key Features:**
- Voice parameter now optional with default
- Persona preset specifies which voice to use
- Speed parameter for voice customization
- Backward compatible with existing calls

### API Integration

**Extended Request Type:**
```typescript
interface FortuneRequestBody {
  question: string;
  mode: RealmMode;
  generateImages?: boolean;
  deckType?: DeckType;        // NEW: Optional deck selection
  personaType?: PersonaType;  // NEW: Optional persona selection
}
```

**Backend Flow:**
1. Extract deckType from request (default: 'tarot')
2. Load appropriate deck via TarotDeck(deckPath)
3. Extract personaType from request (default: 'mystic')
4. Load persona preset configuration
5. Initialize FortuneService with persona system prompt
6. Generate fortune with persona-specific tone
7. Return fortune with persona voice recommendation

**Extended Response Type:**
```typescript
interface ReadingResponse {
  cards: Array<{...}>;
  fortune: string;
  movieRecommendation?: {...};
  voiceRecommendation?: string;  // NEW: Suggested TTS voice
}
```

### Frontend Integration

**Persona Selection (Future):**
- Optional persona selector in settings or before reading
- Display persona name, description, and icon
- Store selected persona in session state
- Pass persona type to backend via API request
- Use recommended voice for TTS playback

**Current Implementation:**
- Types defined for future extensibility
- Backend can accept persona parameter
- No UI changes required yet
- Defaults to current mystic persona

## Atmospheric Experience

### Overview
The application creates an immersive séance atmosphere using 3D visual effects and ambient soundscape. This transforms the single-screen experience from a simple chat interface into a focused mystical space.

### 3D Fog Background

**Implementation:**
- **Library**: Vanta.js FOG effect with Three.js
- **Integration**: Client-side only (dynamic import to avoid SSR issues)
- **Configuration**:
  ```typescript
  {
    highlightColor: 0xf97316,  // Orange
    midtoneColor: 0xa3e635,    // Lime green
    lowlightColor: 0x020617,   // Dark slate
    baseColor: 0x0b1120,       // Custom dark blue-black
    blurFactor: 0.6,           // Subtle, not overwhelming
    speed: 1.5,                // Slow, meditative movement
    zoom: 0.8                  // Appropriate depth
  }
  ```

**Key Features:**
- Volumetric fog with slow, organic movement
- Low opacity to avoid obscuring content
- Colors match app palette (no purple)
- Responsive to mouse/touch movement
- Minimal performance impact

### Ambient Soundscape

**Audio Files:**
- `public/sounds/ambient.mp3` - Background atmosphere
- `public/sounds/card-flip.mp3` - Card reveal sound

**Ambient Audio Characteristics:**
- Low-volume hum or distant wind
- Seamless loop
- 30% volume (subtle, non-intrusive)
- Starts on first user interaction (browser autoplay compliance)

**Card Flip Sound:**
- Soft, quick sound (< 1 second)
- 50% volume
- Plays on each card reveal with 300ms stagger

**Implementation:**
```typescript
class SoundService {
  startAmbient(): void;
  stopAmbient(): void;
  playCardFlip(): void;
  setAmbientVolume(volume: number): void;
}
```

**Browser Compatibility:**
- Respects autoplay policies (requires user interaction)
- Graceful degradation if audio files missing
- Works with browser audio controls
- No errors if audio fails to load

### User Experience

**Atmosphere Goals:**
1. Create focused séance space feeling
2. Enhance mystical immersion without distraction
3. Maintain performance and accessibility
4. Respect user preferences (browser controls)

**Visual Hierarchy:**
- Fog provides depth without obscuring UI
- Content remains clearly readable
- Animations are smooth and non-jarring
- Colors reinforce brand identity

**Audio Design:**
- Ambient creates presence without demanding attention
- Card flips provide satisfying feedback
- Volume levels allow conversation/music
- User can mute via browser controls

### Performance Considerations

**3D Effects:**
- Vanta.js optimized for web performance
- Three.js loaded dynamically (code splitting)
- Effect destroyed on component unmount
- Minimal CPU/GPU usage

**Audio:**
- MP3 format for broad compatibility
- Small file sizes (< 1MB each)
- Preloaded but not auto-started
- Single audio context (efficient)

### Accessibility

**Visual:**
- Fog does not interfere with text contrast
- Content remains WCAG AA compliant
- No flashing or seizure-inducing effects

**Audio:**
- Optional (graceful degradation)
- User-controllable via browser
- No critical information conveyed only through sound
- Subtitles not needed (ambient only)

## Future Enhancements

1. **Deck Management UI**
   - Visual deck selector with previews
   - Deck-specific card art and themes
   - Custom deck upload (advanced)

2. **Persona Customization**
   - User-created persona presets
   - Tone sliders (Mild → Cryptic → Terrifying)
   - Voice preview before selection

3. **Reading History**
   - Optional user accounts
   - Save and share readings via permalink
   - Reading journal

4. **Advanced Spreads**
   - Celtic Cross (10 cards)
   - Past-Present-Future (3 cards)
   - Custom spread builder

5. **Internationalization**
   - Multi-language support
   - Localized card meanings

6. **Analytics**
   - Track popular questions (anonymized)
   - A/B test different prompts
   - Monitor API costs

7. **Enhanced Movie Oracle**
   - Larger movie database with more genres
   - User ratings and feedback
   - Streaming availability integration
   - Trailer links

8. **Fate Meter Progression**
   - Track fate choices across multiple readings
   - Unlock special fortunes based on fate path
   - Persistent fate score (with user accounts)

9. **Enhanced Atmosphere**
   - Multiple ambient soundscapes (per realm)
   - Spatial audio effects
   - Particle effects for card reveals
   - Customizable fog intensity
