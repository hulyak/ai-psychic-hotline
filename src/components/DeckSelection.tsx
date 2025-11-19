'use client';

import { DeckType } from '@/types/tarot';
import { DECK_CONFIGS } from '@/config/decks';
import './DeckSelection.css';

interface DeckSelectionProps {
  onSelectDeck: (deckType: DeckType) => void;
}

export default function DeckSelection({ onSelectDeck }: DeckSelectionProps) {
  const decks = Object.values(DECK_CONFIGS);

  return (
    <div className="deck-selection-container">
      <div className="deck-grid">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelectDeck(deck.id)}
            className="deck-card"
          >
            <div className="deck-icon">{deck.icon}</div>
            <h3 className="deck-name">{deck.name}</h3>
            <p className="deck-description">{deck.description}</p>
            <div className="deck-card-glow" />
          </button>
        ))}
      </div>
    </div>
  );
}
