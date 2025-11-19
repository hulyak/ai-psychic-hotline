import { NextRequest, NextResponse } from 'next/server';
import { CardImageService } from '@/services/CardImageService';
import { Config } from '@/services/Config';
import { Logger } from '@/services/Logger';
import { sanitizeText } from '@/utils/sanitize';

const config = Config.getInstance();
const logger = Logger.getInstance();

// Cache service instance
let cardImageService: CardImageService | null = null;

function getCardImageService(): CardImageService {
  if (!cardImageService) {
    if (!config.isOpenAIAvailable()) {
      throw new Error('OpenAI not configured');
    }
    cardImageService = new CardImageService(config.openai!.apiKey);
  }
  return cardImageService;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { cardName, orientation } = body;

    if (!cardName || typeof cardName !== 'string') {
      return NextResponse.json(
        { error: 'Card name is required.' },
        { status: 400 }
      );
    }

    // Sanitize card name
    const sanitizedCardName = sanitizeText(cardName);
    
    if (sanitizedCardName.length === 0 || sanitizedCardName.length > 100) {
      return NextResponse.json(
        { error: 'Invalid card name.' },
        { status: 400 }
      );
    }

    if (orientation !== 'upright' && orientation !== 'reversed') {
      return NextResponse.json(
        { error: 'Invalid orientation.' },
        { status: 400 }
      );
    }

    const service = getCardImageService();
    
    const dalleStartTime = Date.now();
    const imageUrl = await service.generateCardImage(sanitizedCardName, orientation);
    const dalleDuration = Date.now() - dalleStartTime;
    
    logger.externalApiCall('openai-dalle', 'generate-card', dalleDuration, true, {
      cardName: sanitizedCardName,
      orientation
    });
    
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/generate-card', 'POST', duration, 200);

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error('Card generation failed', error, { endpoint: '/api/generate-card' });
    logger.apiRequest('/api/generate-card', 'POST', duration, 500);
    
    return NextResponse.json(
      { error: 'The card images remain hidden in shadow.' },
      { status: 500 }
    );
  }
}
