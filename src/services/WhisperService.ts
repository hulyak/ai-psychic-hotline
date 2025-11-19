import OpenAI from 'openai';

export class WhisperService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Transcribe audio to text using Whisper API
   * @param audioBlob Audio file blob
   * @returns Transcribed text
   */
  async transcribe(audioBlob: Blob): Promise<string> {
    try {
      const file = new File([audioBlob], 'audio.webm', { type: audioBlob.type });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'en',
      });

      return transcription.text;
    } catch (error: any) {
      console.error('Whisper transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }
}
