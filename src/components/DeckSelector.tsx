'use client';

import { DeckType } from '@/types/tarot';
import { DECK_CONFIGS } from '@/config/decks';

interface DeckSelectorProps {
  selectedDeck: DeckType;
  onSelectDeck: (deck: DeckType) => void;
}

export default function DeckSelector({ selectedDeck, onSelectDeck }: DeckSelectorProps) {
  const decks = Object.values(DECK_CONFIGS);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium" style={{ color: '#94a3b8' }}>
        Choose Your Deck
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelectDeck(deck.id)}
            className="p-4 rounded-lg text-left transition-all"
            style={{
              background: selectedDeck === deck.id 
                ? 'rgba(249, 115, 22, 0.2)' 
                : 'rgba(15, 23, 42, 0.6)',
              border: selectedDeck === deck.id
                ? '2px solid #f97316'
                : '2px solid rgba(249, 115, 22, 0.3)',
              boxShadow: selectedDeck === deck.id
                ? '0 0 20px rgba(249, 115, 22, 0.4)'
                : 'none'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{deck.icon}</span>
              <span className="font-semibold" style={{ color: '#e2e8f0' }}>
                {deck.name}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              {deck.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
