export type RealmMode = 'love' | 'fate' | 'shadows';
export type DeckType = 'tarot' | 'career' | 'product' | 'self-care';
export type PersonaType = 'mystic' | 'wise-witch' | 'corporate-oracle' | 'kind-therapist';

export interface Realm {
  id: RealmMode;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface DeckInfo {
  id: DeckType;
  name: string;
  description: string;
  icon: string;
  dataPath: string;
}

export interface PersonaPreset {
  id: PersonaType;
  name: string;
  description: string;
  systemPrompt: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}

export interface Card {
  id: string;
  name: string;
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
}

export interface DrawnCard {
  card: Card;
  orientation: 'upright' | 'reversed';
}

export interface MovieRecommendation {
  id: string;
  title: string;
  year: number;
  oneSentenceBlurb: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  tags: string[];
  oneSentenceBlurb: string;
}

export interface ReadingResponse {
  cards: Array<{
    id: string;
    name: string;
    orientation: 'upright' | 'reversed';
    imageUrl: string;
  }>;
  fortune: string;
  movieRecommendation?: MovieRecommendation;
  voiceRecommendation?: string;
}

export interface FortuneRequest {
  question: string;
  mode: RealmMode;
  cards: Array<{
    name: string;
    orientation: 'upright' | 'reversed';
    meaning: string;
  }>;
}
