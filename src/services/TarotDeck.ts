import { Card, DrawnCard } from '@/types/tarot';
import * as fs from 'fs';
import * as path from 'path';

interface TarotDeckData {
  cards: Card[];
}

export class TarotDeck {
  private cards: Card[] = [];
  private deckPath: string;

  constructor(deckPath: string) {
    this.deckPath = deckPath;
  }

  /**
   * Load and validate the tarot deck from JSON file
   */
  loadDeck(): void {
    try {
      const fullPath = path.join(process.cwd(), this.deckPath);
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const deckData: TarotDeckData = JSON.parse(fileContent);

      // Validate deck data
      if (!deckData.cards || !Array.isArray(deckData.cards)) {
        throw new Error('Invalid deck format: missing cards array');
      }

      // Validate each card has required fields
      for (const card of deckData.cards) {
        if (!card.id || !card.name || !card.uprightMeaning || !card.reversedMeaning || !card.imageUrl) {
          throw new Error(`Invalid card format: ${JSON.stringify(card)}`);
        }
      }

      this.cards = deckData.cards;
      console.log(`Loaded ${this.cards.length} cards from tarot deck`);
    } catch (error) {
      console.error('Failed to load tarot deck:', error);
      throw new Error(`Failed to load tarot deck: ${error}`);
    }
  }

  /**
   * Draw a specified number of cards randomly without replacement
   * Each card is assigned a random orientation (upright or reversed)
   * @param count Number of cards to draw (3-5)
   * @returns Array of drawn cards with orientations
   */
  drawCards(count: number): DrawnCard[] {
    if (count < 3 || count > 5) {
      throw new Error('Card count must be between 3 and 5');
    }

    if (this.cards.length === 0) {
      throw new Error('Deck not loaded. Call loadDeck() first.');
    }

    if (count > this.cards.length) {
      throw new Error(`Cannot draw ${count} cards from deck of ${this.cards.length}`);
    }

    // Create a copy of the deck to draw from
    const availableCards = [...this.cards];
    const drawnCards: DrawnCard[] = [];

    // Draw cards without replacement
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const card = availableCards.splice(randomIndex, 1)[0];
      
      // Randomly assign orientation
      const orientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';
      
      drawnCards.push({
        card,
        orientation
      });
    }

    return drawnCards;
  }

  /**
   * Get the total number of cards in the deck
   */
  getCardCount(): number {
    return this.cards.length;
  }
}
