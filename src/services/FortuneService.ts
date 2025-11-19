import { FortuneRequest } from '@/types/tarot';
import Anthropic from '@anthropic-ai/sdk';

export class FortuneService {
  private anthropic: Anthropic;
  private model: string;
  private timeout: number;
  private systemPrompt?: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022', timeout: number = 5000, systemPrompt?: string) {
    this.anthropic = new Anthropic({ apiKey });
    this.model = model;
    this.timeout = timeout;
    this.systemPrompt = systemPrompt;
  }

  /**
   * Generate a fortune based on the user's question and drawn cards
   * @param request Fortune request containing question and cards
   * @returns Generated fortune text
   */
  async generateFortune(request: FortuneRequest): Promise<string> {
    const prompt = this.buildPrompt(request);
    const fortune = await this.callLLM(prompt);
    return this.cleanResponse(fortune);
  }

  /**
   * Build the LLM prompt with question, cards, and tone instructions
   * @param request Fortune request
   * @returns Formatted prompt string
   */
  private buildPrompt(request: FortuneRequest): string {
    const cardList = request.cards
      .map((card, index) => {
        return `${index + 1}. ${card.name} (${card.orientation}): ${card.meaning}`;
      })
      .join('\n');

    // Adjust tone based on realm
    const realmContext = this.getRealmContext(request.mode);

    return `You are a mystical psychic fortune teller. ${realmContext.persona}

Question: "${request.question}"

Cards drawn:
${cardList}

Provide a fortune that:
- Is EXACTLY 3-5 sentences (NO MORE)
- Maximum 100 words total
- Uses ${realmContext.tone} language
- References at least 2 cards by name
- Addresses the question directly
- ${realmContext.ending}

CRITICAL LENGTH REQUIREMENTS:
- Keep it concise and cryptic, NOT verbose
- Each sentence should be impactful
- Stop after 5 sentences maximum
- Aim for 80-100 words total

IMPORTANT STYLE RULES: 
- Do NOT use asterisks, parentheses, or stage directions
- Do NOT describe your tone or voice (no "*speaks in a low tone*" or similar)
- Do NOT use phrases like "Ah, the seeker" or "Your question echoes"
- Speak DIRECTLY to the reader
- Be mysterious but clear, cryptic but understandable`;
  }

  /**
   * Get realm-specific context for prompt generation
   */
  private getRealmContext(mode: string) {
    switch (mode) {
      case 'love':
        return {
          realmName: 'Realm of Love',
          persona: 'You speak of matters of the heart with deep emotion and romantic mysticism.',
          tone: 'romantic, emotional, and passionate',
          ending: 'End with a hopeful yet mysterious hint about connections and relationships'
        };
      case 'fate':
        return {
          realmName: 'Realm of Fate',
          persona: 'You speak of destiny and life paths with practical wisdom and gravitas.',
          tone: 'practical, wise, and destiny-focused',
          ending: 'End with a powerful statement about their path forward and choices'
        };
      case 'shadows':
        return {
          realmName: 'Realm of Shadows',
          persona: 'You speak of fears and darkness with haunting intensity.',
          tone: 'dark, ominous, and psychologically intense',
          ending: 'End with a chilling warning or revelation about hidden truths'
        };
      default:
        return {
          realmName: 'the spirits',
          persona: 'You speak with mysterious wisdom.',
          tone: 'spooky, mysterious',
          ending: 'End with an ominous hint or warning'
        };
    }
  }

  /**
   * Call the LLM API with the constructed prompt
   * @param prompt The prompt to send to the LLM
   * @returns The LLM's response text
   */
  private async callLLM(prompt: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const message = await this.anthropic.messages.create(
        {
          model: this.model,
          max_tokens: 250,
          temperature: 0.9,
          system: this.systemPrompt || 'You are a mystical psychic fortune teller. Speak directly to the reader with mysterious, cryptic language. Be concise and impactful - maximum 100 words. Never use asterisks, stage directions, or describe your tone of voice. Focus only on delivering the fortune itself.',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
        },
        {
          signal: controller.signal as any
        }
      );

      clearTimeout(timeoutId);

      const response = message.content[0];
      if (!response || response.type !== 'text') {
        throw new Error('No response from LLM');
      }

      return response.text;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('LLM request timed out');
      }
      console.error('LLM API error:', error);
      throw new Error(`Failed to generate fortune: ${error.message}`);
    }
  }

  /**
   * Clean and format the LLM response
   * @param response Raw LLM response
   * @returns Cleaned fortune text
   */
  private cleanResponse(response: string): string {
    // Remove any leading/trailing whitespace
    let cleaned = response.trim();
    
    // Remove any quotes that might wrap the response
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Remove roleplay actions and emotes in asterisks or parentheses
    cleaned = cleaned.replace(/\*[^*]+\*/g, ''); // Remove *actions*
    cleaned = cleaned.replace(/\([^)]*tone[^)]*\)/gi, ''); // Remove (tone descriptions)
    cleaned = cleaned.replace(/\([^)]*voice[^)]*\)/gi, ''); // Remove (voice descriptions)
    cleaned = cleaned.replace(/\([^)]*whisper[^)]*\)/gi, ''); // Remove (whisper descriptions)
    
    // Remove common roleplay prefixes
    cleaned = cleaned.replace(/^(Ah,?\s*)/i, '');
    cleaned = cleaned.replace(/^(The seeker who comes to me from the Realm of \w+\.?\s*)/i, '');
    cleaned = cleaned.replace(/^(Your (?:heart's|soul's)? question echoes (?:through|thro)[^.]*\.?\s*)/i, '');
    
    // Clean up any double spaces or extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }
}
