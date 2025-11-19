'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './TarotSpreadView.css';

interface Card {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
  imageUrl: string;
}

interface TarotSpreadViewProps {
  cards: Card[];
}

export default function TarotSpreadView({ cards }: TarotSpreadViewProps) {
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);

  useEffect(() => {
    setRevealedCards(new Array(cards.length).fill(false));

    // Play card flip sound for each card reveal
    cards.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });

        // Play card flip sound
        if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
          try {
            const audio = new Audio('/sounds/card-flip.mp3');
            audio.volume = 0.5;
            const playPromise = audio.play();
            if (playPromise && playPromise.catch) {
              playPromise.catch(() => {
                // Silently fail if audio can't play
              });
            }
          } catch (e) {
            // Silently fail in test environments
          }
        }
      }, index * 300);
    });
  }, [cards]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="tarot-spread-container">
      <h2 className="tarot-spread-title">
        The Cards Have Spoken
      </h2>

      <div className="tarot-cards-grid">
        {cards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className={`tarot-card-wrapper ${revealedCards[index] ? 'revealed' : ''}`}
            style={{
              transitionDelay: `${index * 150}ms`
            }}
          >
            <div className="tarot-card-container">
              {/* Card image */}
              <div
                className={`tarot-card-image ${card.orientation === 'reversed' ? 'reversed' : ''}`}
              >
                <div className="tarot-card-border">
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="tarot-card-img"
                    unoptimized
                  />
                </div>
                <div className="tarot-card-glow" />
              </div>

              {/* Card info */}
              <div className={`tarot-card-info ${card.orientation === 'reversed' ? 'reversed' : ''}`}>
                <h3 className="tarot-card-name">
                  {card.name}
                </h3>
                <div className="tarot-card-orientation">
                  <div
                    className={`tarot-orientation-dot ${card.orientation}`}
                  />
                  <p className={`tarot-orientation-text ${card.orientation}`}>
                    {card.orientation === 'upright' ? 'Upright' : 'Reversed'}
                  </p>
                  <div
                    className={`tarot-orientation-dot ${card.orientation}`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
