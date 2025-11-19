import OpenAI from 'openai';

export class CardImageService {
  private openai: OpenAI;
  private cache: Map<string, string> = new Map();

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Generate a tarot card image using DALL-E
   * @param cardName Name of the tarot card
   * @param orientation Card orientation
   * @returns Image URL
   */
  async generateCardImage(cardName: string, orientation: 'upright' | 'reversed'): Promise<string> {
    const cacheKey = `${cardName}-${orientation}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const prompt = this.buildPrompt(cardName, orientation);
      
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1792', // Tall format for tarot cards
        quality: 'standard',
        style: 'vivid',
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No image data returned from DALL-E');
      }

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E');
      }

      // Cache the result
      this.cache.set(cacheKey, imageUrl);
      
      return imageUrl;
    } catch (error: any) {
      console.error('DALL-E generation error:', error);
      throw new Error(`Failed to generate card image: ${error.message}`);
    }
  }

  /**
   * Build DALL-E prompt for tarot card generation
   */
  private buildPrompt(cardName: string, orientation: 'upright' | 'reversed'): string {
    const orientationNote = orientation === 'reversed' 
      ? 'The card should have a subtle indication it is reversed, perhaps through darker tones or inverted symbolism.'
      : '';

    return `A mystical tarot card titled "${cardName}". 
Dark, atmospheric, gothic art style with rich symbolism. 
Deep blacks and dark blues with accents of glowing orange and lime green. 
Ornate border with occult symbols. 
Vintage mystical aesthetic, like an ancient fortune-telling card.
${orientationNote}
No text or words on the card.
Vertical portrait orientation.`;
  }

  /**
   * Clear the image cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
