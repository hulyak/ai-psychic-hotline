# Type Extensions - Decks & Personas

## Overview

This document describes the TypeScript type extensions added to support multiple card decks and AI persona presets. These types are defined in `src/types/tarot.ts` and documented in the main spec files.

## Deck Types

### DeckType

```typescript
export type DeckType = 'tarot' | 'career';
```

Identifies the type of card deck being used for readings.

**Values:**
- `'tarot'` - Traditional Major Arcana tarot deck (default)
- `'career'` - Career-focused guidance deck

**Usage:**
```typescript
const deckType: DeckType = 'career';
```

### DeckInfo Interface

```typescript
export interface DeckInfo {
  id: DeckType;
  name: string;
  description: string;
  icon: string;
  dataPath: string;
}
```

Metadata about a card deck.

**Fields:**
- `id` - Unique deck identifier (DeckType)
- `name` - Display name (e.g., "Career Guidance Deck")
- `description` - Brief description of deck purpose
- `icon` - Icon or emoji for UI display
- `dataPath` - Path to deck JSON file (e.g., "./data/career.json")

**Example:**
```typescript
const careerDeck: DeckInfo = {
  id: 'career',
  name: 'Career Guidance Deck',
  description: 'Professional guidance and career insights',
  icon: '💼',
  dataPath: './data/career.json'
};
```

## Persona Types

### PersonaType

```typescript
export type PersonaType = 'mystic' | 'wise-witch' | 'corporate-oracle' | 'kind-therapist';
```

Identifies the AI persona preset for fortune generation.

**Values:**
- `'mystic'` - Default eerie psychic (current behavior)
- `'wise-witch'` - Nurturing grandmother witch
- `'corporate-oracle'` - Business-focused executive coach
- `'kind-therapist'` - Compassionate therapeutic guide

**Usage:**
```typescript
const persona: PersonaType = 'wise-witch';
```

### PersonaPreset Interface

```typescript
export interface PersonaPreset {
  id: PersonaType;
  name: string;
  description: string;
  systemPrompt: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}
```

Configuration for an AI persona preset.

**Fields:**
- `id` - Unique persona identifier (PersonaType)
- `name` - Display name (e.g., "The Wise Witch")
- `description` - Brief persona description
- `systemPrompt` - LLM system prompt defining persona voice
- `voice` - OpenAI TTS voice to use for this persona

**Example:**
```typescript
const wiseWitch: PersonaPreset = {
  id: 'wise-witch',
  name: 'The Wise Witch',
  description: 'A nurturing grandmother witch offering mystical guidance',
  systemPrompt: 'You are a wise and nurturing witch who speaks with warmth and ancient wisdom. Your guidance is mystical but comforting, like a grandmother sharing secrets of the old ways.',
  voice: 'fable'
};
```

## Persona Configurations

### Mystic (Default)

```typescript
{
  id: 'mystic',
  name: 'The Mystic',
  description: 'An eerie psychic with cryptic visions',
  systemPrompt: 'You are a mystical psychic fortune teller. Speak directly to the reader with mysterious, cryptic language.',
  voice: 'onyx'
}
```

**Characteristics:**
- Voice: Deep, spooky (onyx)
- Tone: Eerie, cryptic, mysterious
- Style: Current default behavior

### Wise Witch

```typescript
{
  id: 'wise-witch',
  name: 'The Wise Witch',
  description: 'A nurturing grandmother witch',
  systemPrompt: 'You are a wise and nurturing witch who speaks with warmth and ancient wisdom.',
  voice: 'fable'
}
```

**Characteristics:**
- Voice: Warm, wise (fable)
- Tone: Nurturing, mystical, comforting
- Style: Grandmother offering guidance

### Corporate Oracle

```typescript
{
  id: 'corporate-oracle',
  name: 'The Corporate Oracle',
  description: 'An executive coach with mystical insights',
  systemPrompt: 'You are a business-focused oracle who combines practical career advice with mystical card symbolism.',
  voice: 'echo'
}
```

**Characteristics:**
- Voice: Professional, clear (echo)
- Tone: Business-focused, practical
- Style: Executive coach with mystical edge

### Kind Therapist

```typescript
{
  id: 'kind-therapist',
  name: 'The Kind Therapist',
  description: 'A compassionate guide for healing',
  systemPrompt: 'You are a compassionate therapist who uses tarot symbolism to provide gentle, healing guidance.',
  voice: 'nova'
}
```

**Characteristics:**
- Voice: Gentle, supportive (nova)
- Tone: Compassionate, healing
- Style: Therapeutic card interpretation

## OpenAI TTS Voices

Reference for voice characteristics:

| Voice | Gender | Characteristics |
|-------|--------|----------------|
| alloy | Neutral | Balanced, versatile |
| echo | Male | Clear, professional |
| fable | Female | Warm, expressive |
| onyx | Male | Deep, authoritative |
| nova | Female | Gentle, friendly |
| shimmer | Female | Bright, energetic |

## Integration Examples

### Backend API Request

```typescript
interface FortuneRequestBody {
  question: string;
  mode: RealmMode;
  generateImages?: boolean;
  deckType?: DeckType;        // NEW
  personaType?: PersonaType;  // NEW
}

// Example request
const request = {
  question: "Should I change careers?",
  mode: "fate",
  generateImages: false,
  deckType: "career",
  personaType: "corporate-oracle"
};
```

### Backend API Response

```typescript
interface ReadingResponse {
  cards: Array<{...}>;
  fortune: string;
  movieRecommendation?: {...};
  voiceRecommendation?: string;  // NEW
}

// Example response
const response = {
  cards: [...],
  fortune: "The Opportunity card suggests...",
  movieRecommendation: {...},
  voiceRecommendation: "echo"  // Matches corporate-oracle persona
};
```

### Frontend State

```typescript
// Component state
const [selectedDeck, setSelectedDeck] = useState<DeckType>('tarot');
const [selectedPersona, setSelectedPersona] = useState<PersonaType>('mystic');

// API call
const response = await fetch('/api/fortune', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question,
    mode: selectedRealm,
    generateImages: false,
    deckType: selectedDeck,
    personaType: selectedPersona
  })
});

// Use voice recommendation for TTS
const { voiceRecommendation } = await response.json();
await playAudio(fortune, voiceRecommendation);
```

## Backward Compatibility

All new types are **optional extensions**:

```typescript
// Old API call (still works)
fetch('/api/fortune', {
  body: JSON.stringify({
    question: "What awaits me?",
    mode: "fate"
  })
});

// New API call (with extensions)
fetch('/api/fortune', {
  body: JSON.stringify({
    question: "What awaits me?",
    mode: "fate",
    deckType: "career",
    personaType: "corporate-oracle"
  })
});
```

**Default Behavior:**
- No deckType → uses 'tarot'
- No personaType → uses 'mystic'
- No voiceRecommendation → uses 'onyx'

## Implementation Checklist

When implementing these features:

### Backend
- [ ] Add deckType parameter handling in `/api/fortune`
- [ ] Add personaType parameter handling in `/api/fortune`
- [ ] Load deck based on deckType
- [ ] Configure FortuneService with persona systemPrompt
- [ ] Return voiceRecommendation in response
- [ ] Add validation for deckType and personaType values
- [ ] Update API documentation

### Frontend
- [ ] Create DeckSelector component
- [ ] Create PersonaSelector component
- [ ] Add deck/persona state management
- [ ] Pass parameters to API
- [ ] Use voiceRecommendation for TTS
- [ ] Add deck/persona preview/description UI
- [ ] Handle loading states

### Testing
- [ ] Unit tests for deck selection
- [ ] Unit tests for persona selection
- [ ] Integration tests for API parameters
- [ ] Test all deck/persona combinations
- [ ] Update smoke tests
- [ ] Test backward compatibility

### Data
- [ ] Create additional deck JSON files
- [ ] Define persona preset configurations
- [ ] Validate deck data structure
- [ ] Add deck/persona metadata

## References

- Main spec: `.kiro/specs/ai-psychic-hotline/design.md`
- Requirements: `.kiro/specs/ai-psychic-hotline/requirements.md`
- Type definitions: `src/types/tarot.ts`
- Career deck example: `data/career.json`
