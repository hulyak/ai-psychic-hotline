import { NextRequest, NextResponse } from 'next/server';
import { STTService } from '@/services/STTService';
import { Config } from '@/services/Config';
import { Logger } from '@/services/Logger';
import { validateAudioFile } from '@/utils/sanitize';

const config = Config.getInstance();
const logger = Logger.getInstance();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check if STT feature is enabled
    if (!config.isSTTEnabled()) {
      logger.warn('STT request received but feature is disabled');
      return NextResponse.json(
        { error: 'Voice input is not available at this time.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio provided.' },
        { status: 400 }
      );
    }

    // Validate audio file
    const validation = validateAudioFile(audioFile);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid audio file.' },
        { status: 400 }
      );
    }

    // Get timeout from environment or use default (30 seconds)
    const timeout = parseInt(process.env.STT_TIMEOUT || '30000', 10);
    
    const sttService = new STTService(config.stt!.apiKey, timeout);
    
    const sttStartTime = Date.now();
    const transcription = await sttService.transcribe(audioFile);
    const sttDuration = Date.now() - sttStartTime;
    
    logger.externalApiCall('openai-whisper', 'transcribe', sttDuration, true);
    
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/transcribe', 'POST', duration, 200);

    return NextResponse.json({ text: transcription });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error('Transcription failed', error, { endpoint: '/api/transcribe' });
    
    // Return user-friendly error message in character
    const errorMessage = error.message.includes('spirits') 
      ? error.message 
      : 'The spirits could not understand your words.';
    
    logger.apiRequest('/api/transcribe', 'POST', duration, 500);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
