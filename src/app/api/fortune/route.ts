import { NextRequest, NextResponse } from 'next/server';
import { TarotDeck } from '@/services/TarotDeck';
import { FortuneService } from '@/services/FortuneService';
import { MovieOracle } from '@/services/MovieOracle';
import { CardImageService } from '@/services/CardImageService';
import { Config } from '@/services/Config';
import { Logger } from '@/services/Logger';
import { ReadingResponse, DeckType, PersonaType } from '@/types/tarot';
import { getDeckConfig } from '@/config/decks';
import { getPersonaPreset } from '@/config/personas';
import { sanitizeQuestion } from '@/utils/sanitize';

// Initialize configuration and logger
const config = Config.getInstance();
const logger = Logger.getInstance();

// Cache for loaded decks
const deckCache = new Map<string, TarotDeck>();
const movieOracle = new MovieOracle();
let cardImageService: CardImageService | null = null;

// Load or get cached deck
function getDeck(deckType: DeckType): TarotDeck {
  const deckConfig = getDeckConfig(deckType);
  
  if (!deckCache.has(deckType)) {
    const deck = new TarotDeck(deckConfig.dataPath);
    deck.loadDeck();
    deckCache.set(deckType, deck);
  }
  
  return deckCache.get(deckType)!;
}

// Get or create card image service
function getCardImageService(): CardImageService | null {
  if (!config.isOpenAIAvailable()) {
    return null;
  }
  if (!cardImageService) {
    cardImageService = new CardImageService(config.openai!.apiKey);
  }
  return cardImageService;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = await request.json();
    const { question, mode, generateImages = false, deckType, personaType } = body;

    // Validate question
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a question to consult the spirits.' },
        { status: 400 }
      );
    }

    // Sanitize input to prevent injection attacks
    const { sanitized: sanitizedQuestion, error: sanitizeError } = sanitizeQuestion(question);
    
    if (sanitizeError) {
      return NextResponse.json(
        { error: sanitizeError },
        { status: 400 }
      );
    }

    if (sanitizedQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Please enter a question to consult the spirits.' },
        { status: 400 }
      );
    }

    if (sanitizedQuestion.length > 500) {
      return NextResponse.json(
        { error: 'Your question is too long. Please keep it under 500 characters.' },
        { status: 400 }
      );
    }

    const trimmedQuestion = sanitizedQuestion;

    // Get deck and persona configurations
    const selectedDeckType: DeckType = deckType || 'tarot';
    const selectedPersonaType: PersonaType = personaType || 'mystic';
    const personaPreset = getPersonaPreset(selectedPersonaType);

    // Load appropriate deck
    const deck = getDeck(selectedDeckType);

    // Draw cards (random count between configured min-max)
    const cardCount = Math.floor(Math.random() * (config.tarot.maxCards - config.tarot.minCards + 1)) + config.tarot.minCards;
    
    const drawnCards = deck.drawCards(cardCount);

    // Validate mode
    const validModes = ['love', 'fate', 'shadows'];
    const realmMode = validModes.includes(mode) ? mode : 'fate';

    // Prepare fortune request
    const fortuneRequest = {
      question: trimmedQuestion,
      mode: realmMode,
      cards: drawnCards.map(dc => ({
        name: dc.card.name,
        orientation: dc.orientation,
        meaning: dc.orientation === 'upright' ? dc.card.uprightMeaning : dc.card.reversedMeaning
      }))
    };

    // Generate fortune
    const fortuneService = new FortuneService(
      config.llm.apiKey,
      config.llm.model,
      config.llm.timeout,
      personaPreset.systemPrompt
    );

    const fortuneStartTime = Date.now();
    const fortune = await fortuneService.generateFortune(fortuneRequest);
    const fortuneDuration = Date.now() - fortuneStartTime;
    
    logger.externalApiCall('anthropic', 'generate-fortune', fortuneDuration, true, {
      cardCount,
      mode: realmMode,
      personaType: selectedPersonaType
    });

    // Get movie recommendation
    const movieMatch = movieOracle.matchMovieToReading({
      question: trimmedQuestion,
      cards: drawnCards.map(dc => ({
        id: dc.card.id,
        name: dc.card.name,
        orientation: dc.orientation
      })),
      fortune,
      mode: realmMode
    });

    // Optionally generate DALL-E images for cards
    let cardImages = drawnCards.map(dc => dc.card.imageUrl);
    
    if (generateImages) {
      const imageService = getCardImageService();
      if (imageService) {
        try {
          const imageStartTime = Date.now();
          // Generate images in parallel
          const imagePromises = drawnCards.map(dc => 
            imageService.generateCardImage(dc.card.name, dc.orientation)
          );
          cardImages = await Promise.all(imagePromises);
          const imageDuration = Date.now() - imageStartTime;
          
          logger.externalApiCall('openai-dalle', 'generate-cards', imageDuration, true, {
            cardCount: drawnCards.length
          });
        } catch (error: any) {
          logger.error('Failed to generate card images', error, { cardCount: drawnCards.length });
          // Fall back to default images on error
        }
      }
    }

    // Prepare response
    const response: ReadingResponse = {
      cards: drawnCards.map((dc, index) => ({
        id: dc.card.id,
        name: dc.card.name,
        orientation: dc.orientation,
        imageUrl: cardImages[index]
      })),
      fortune,
      movieRecommendation: movieMatch ? {
        id: movieMatch.id,
        title: movieMatch.title,
        year: movieMatch.year,
        oneSentenceBlurb: movieMatch.oneSentenceBlurb
      } : undefined,
      voiceRecommendation: personaPreset.voice
    };

    // Log request (without PII)
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/fortune', 'POST', duration, 200, {
      cardCount,
      deckType: selectedDeckType,
      personaType: selectedPersonaType,
      mode: realmMode,
      hasMovieRecommendation: !!movieMatch,
      generatedImages: generateImages
    });

    return NextResponse.json(response);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Log error (without PII)
    logger.error('Fortune generation failed', error, {
      endpoint: '/api/fortune',
      duration
    });

    // Handle specific error types
    if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
      logger.apiRequest('/api/fortune', 'POST', duration, 502, {
        errorType: 'timeout'
      });
      return NextResponse.json(
        { error: 'The spirits are silent. Please try again.' },
        { status: 502 }
      );
    }

    if (error.message?.includes('API') || error.message?.includes('LLM')) {
      logger.apiRequest('/api/fortune', 'POST', duration, 502, {
        errorType: 'api_failure'
      });
      return NextResponse.json(
        { error: 'The spirits are silent. Please try again.' },
        { status: 502 }
      );
    }

    // Generic server error
    logger.apiRequest('/api/fortune', 'POST', duration, 500, {
      errorType: 'server_error'
    });
    return NextResponse.json(
      { error: 'The veil between worlds has torn. Please try again later.' },
      { status: 500 }
    );
  }
}
