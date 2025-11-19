import { DeckInfo, DeckType } from '@/types/tarot';

export const DECK_CONFIGS: Record<DeckType, DeckInfo> = {
  'tarot': {
    id: 'tarot',
    name: 'Traditional Tarot',
    description: 'Classic Major Arcana for mystical guidance',
    icon: '🔮',
    dataPath: './data/tarot.json'
  },
  'career': {
    id: 'career',
    name: 'Career Guidance',
    description: 'Professional insights and career wisdom',
    icon: '💼',
    dataPath: './data/career.json'
  },
  'product': {
    id: 'product',
    name: 'Product Decisions',
    description: 'Strategic guidance for product choices',
    icon: '🚀',
    dataPath: './data/product-decision.json'
  },
  'self-care': {
    id: 'self-care',
    name: 'Self-Care Oracle',
    description: 'Wellness and mental health guidance',
    icon: '🌸',
    dataPath: './data/self-care.json'
  }
};

export function getDeckConfig(deckType?: DeckType): DeckInfo {
  if (!deckType || !DECK_CONFIGS[deckType]) {
    return DECK_CONFIGS['tarot'];
  }
  return DECK_CONFIGS[deckType];
}
