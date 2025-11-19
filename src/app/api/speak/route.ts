import { NextRequest, NextResponse } from 'next/server';
import { VoiceService, VoiceType } from '@/services/VoiceService';
import { Config } from '@/services/Config';
import { Logger } from '@/services/Logger';
import { sanitizeText } from '@/utils/sanitize';

const config = Config.getInstance();
const logger = Logger.getInstance();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    if (!config.isOpenAIAvailable()) {
      logger.warn('TTS request received but OpenAI is not configured');
      return NextResponse.json(
        { error: 'The spirits cannot speak at this time.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, voice = 'onyx' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided.' },
        { status: 400 }
      );
    }

    // Sanitize text input
    const sanitizedText = sanitizeText(text);
    
    if (sanitizedText.length === 0) {
      return NextResponse.json(
        { error: 'Invalid text provided.' },
        { status: 400 }
      );
    }

    // Limit text length for TTS (4096 characters for OpenAI TTS)
    if (sanitizedText.length > 4096) {
      return NextResponse.json(
        { error: 'Text is too long for speech synthesis.' },
        { status: 400 }
      );
    }

    const voiceService = new VoiceService(config.openai!.apiKey);
    
    const ttsStartTime = Date.now();
    const audioBlob = await voiceService.speak(sanitizedText, voice as VoiceType);
    const ttsDuration = Date.now() - ttsStartTime;
    
    logger.externalApiCall('openai-tts', 'synthesize', ttsDuration, true, {
      voice,
      textLength: sanitizedText.length
    });

    // Convert blob to buffer for response
    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/speak', 'POST', duration, 200, {
      voice,
      audioSize: buffer.length
    });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error('TTS failed', error, { endpoint: '/api/speak' });
    logger.apiRequest('/api/speak', 'POST', duration, 500);
    
    return NextResponse.json(
      { error: 'The spirits remain silent.' },
      { status: 500 }
    );
  }
}
