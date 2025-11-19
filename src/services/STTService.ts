import OpenAI from 'openai';

/**
 * Speech-to-Text Service using OpenAI Whisper
 * Provides audio transcription with timeout and error handling
 */
export class STTService {
  private openai: OpenAI;
  private timeout: number;

  /**
   * @param apiKey OpenAI API key
   * @param timeout Timeout in milliseconds (default: 30000ms = 30s)
   */
  constructor(apiKey: string, timeout: number = 30000) {
    this.openai = new OpenAI({ apiKey });
    this.timeout = timeout;
  }

  /**
   * Transcribe audio to text using Whisper API with timeout
   * @param audioBlob Audio file blob (supports webm, mp3, wav, etc.)
   * @returns Transcribed text
   * @throws Error if transcription fails or times out
   */
  async transcribe(audioBlob: Blob): Promise<string> {
    try {
      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Transcription timeout'));
        }, this.timeout);
      });

      // Create the transcription promise
      const transcriptionPromise = this.performTranscription(audioBlob);

      // Race between transcription and timeout
      const transcription = await Promise.race([
        transcriptionPromise,
        timeoutPromise,
      ]);

      return transcription;
    } catch (error: any) {
      console.error('STT transcription error:', error);
      
      if (error.message === 'Transcription timeout') {
        throw new Error('The spirits took too long to hear your words.');
      }
      
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  /**
   * Perform the actual transcription using OpenAI Whisper
   * @private
   */
  private async performTranscription(audioBlob: Blob): Promise<string> {
    // Convert blob to File object for OpenAI API
    const file = new File([audioBlob], 'audio.webm', { 
      type: audioBlob.type || 'audio/webm' 
    });
    
    const transcription = await this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });

    return transcription.text;
  }
}
