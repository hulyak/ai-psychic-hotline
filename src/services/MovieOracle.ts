import { Movie, RealmMode } from '@/types/tarot';
import * as fs from 'fs';
import * as path from 'path';

interface ReadingData {
  question: string;
  cards: Array<{ id: string; name: string; orientation: 'upright' | 'reversed' }>;
  fortune: string;
  mode?: RealmMode;
}

export class MovieOracle {
  private movies: Movie[] = [];

  constructor() {
    this.loadMovies();
  }

  private loadMovies(): void {
    try {
      const moviesPath = path.join(process.cwd(), 'data/movies.json');
      const fileContent = fs.readFileSync(moviesPath, 'utf-8');
      const data = JSON.parse(fileContent);
      this.movies = data.movies;
      console.log(`Loaded ${this.movies.length} movies for oracle`);
    } catch (error) {
      console.error('Failed to load movies:', error);
      this.movies = [];
    }
  }

  matchMovieToReading(reading: ReadingData): Movie | null {
    if (this.movies.length === 0) return null;

    const themes = this.extractThemes(reading);
    if (themes.length === 0) return null;

    // Score each movie based on theme overlap
    const scoredMovies = this.movies.map(movie => ({
      movie,
      score: this.calculateScore(movie, themes)
    }));

    // Sort by score and get the best match
    scoredMovies.sort((a, b) => b.score - a.score);

    // Return the best match if it has a decent score
    const bestMatch = scoredMovies[0];
    return bestMatch.score > 0 ? bestMatch.movie : null;
  }

  private extractThemes(reading: ReadingData): string[] {
    const themes = new Set<string>();

    // Add realm-based themes
    if (reading.mode) {
      switch (reading.mode) {
        case 'love':
          themes.add('relationships');
          themes.add('love');
          themes.add('betrayal');
          break;
        case 'fate':
          themes.add('transformation');
          themes.add('power');
          themes.add('ambition');
          break;
        case 'shadows':
          themes.add('fear');
          themes.add('darkness');
          themes.add('secrets');
          break;
      }
    }

    // Add card-based themes
    reading.cards.forEach(card => {
      const cardThemes = this.getCardThemes(card.name);
      cardThemes.forEach(theme => themes.add(theme));
    });

    // Add fortune text-based themes (simple keyword matching)
    const fortuneThemes = this.extractFortuneThemes(reading.fortune);
    fortuneThemes.forEach(theme => themes.add(theme));

    return Array.from(themes);
  }

  private getCardThemes(cardName: string): string[] {
    const cardThemeMap: Record<string, string[]> = {
      'The Fool': ['youth', 'transformation', 'innocence'],
      'The Magician': ['power', 'manipulation', 'creation'],
      'The High Priestess': ['mystery', 'secrets', 'intuition'],
      'The Empress': ['femininity', 'motherhood', 'creation'],
      'The Emperor': ['power', 'authority', 'masculinity'],
      'The Hierophant': ['faith', 'tradition', 'ritual'],
      'The Lovers': ['relationships', 'love', 'choice'],
      'The Chariot': ['ambition', 'control', 'victory'],
      'Strength': ['power', 'courage', 'inner strength'],
      'The Hermit': ['isolation', 'introspection', 'wisdom'],
      'Wheel of Fortune': ['fate', 'change', 'inevitability'],
      'Justice': ['responsibility', 'consequences', 'balance'],
      'The Hanged Man': ['sacrifice', 'transformation', 'perspective'],
      'Death': ['transformation', 'endings', 'change'],
      'Temperance': ['balance', 'moderation', 'healing'],
      'The Devil': ['temptation', 'obsession', 'bondage'],
      'The Tower': ['upheaval', 'destruction', 'chaos'],
      'The Star': ['hope', 'healing', 'guidance'],
      'The Moon': ['illusion', 'fear', 'subconscious'],
      'The Sun': ['joy', 'success', 'vitality'],
      'Judgement': ['rebirth', 'awakening', 'responsibility'],
      'The World': ['completion', 'fulfillment', 'achievement']
    };

    return cardThemeMap[cardName] || [];
  }

  private extractFortuneThemes(fortune: string): string[] {
    const themes: string[] = [];
    const fortuneLower = fortune.toLowerCase();

    const keywordMap: Record<string, string[]> = {
      'family': ['family', 'mother', 'father', 'child', 'parent', 'sibling'],
      'love': ['love', 'heart', 'romance', 'passion', 'relationship'],
      'death': ['death', 'die', 'grave', 'funeral', 'mortality'],
      'fear': ['fear', 'terror', 'afraid', 'frightened', 'scared'],
      'power': ['power', 'control', 'dominance', 'strength', 'authority'],
      'transformation': ['change', 'transform', 'become', 'evolve', 'metamorphosis'],
      'isolation': ['alone', 'lonely', 'isolated', 'solitude', 'abandoned'],
      'betrayal': ['betray', 'deceive', 'lie', 'cheat', 'unfaithful'],
      'madness': ['mad', 'insane', 'crazy', 'mental', 'sanity'],
      'curse': ['curse', 'cursed', 'hex', 'spell', 'doomed']
    };

    Object.entries(keywordMap).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => fortuneLower.includes(keyword))) {
        themes.push(theme);
      }
    });

    return themes;
  }

  private calculateScore(movie: Movie, themes: string[]): number {
    let score = 0;

    themes.forEach(theme => {
      if (movie.tags.includes(theme)) {
        score += 1;
      }
    });

    return score;
  }
}
