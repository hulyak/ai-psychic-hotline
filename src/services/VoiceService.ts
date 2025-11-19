import OpenAI from 'openai';

export type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export class VoiceService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Convert text to speech using OpenAI TTS
   * @param text Text to convert to speech
   * @param voice Voice type (onyx and fable are deeper/spookier)
   * @returns Audio blob
   */
  async speak(text: string, voice: VoiceType = 'onyx'): Promise<Blob> {
    try {
      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice,
        input: text,
        speed: 0.9, // Slightly slower for eerie effect
      });

      const arrayBuffer = await response.arrayBuffer();
      return new Blob([arrayBuffer], { type: 'audio/mpeg' });
    } catch (error: any) {
      console.error('TTS error:', error);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }
}
