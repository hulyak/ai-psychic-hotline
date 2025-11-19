/**
 * Configuration service for loading and validating environment variables
 */
export class Config {
  private static instance: Config | null = null;

  // LLM Configuration
  public readonly llm: {
    apiKey: string;
    model: string;
    timeout: number;
  };

  // STT Configuration (optional)
  public readonly stt?: {
    apiKey: string;
    enabled: boolean;
  };

  // TTS Configuration (optional)
  public readonly tts?: {
    apiKey: string;
    enabled: boolean;
  };

  // Tarot Configuration
  public readonly tarot: {
    deckPath: string;
    minCards: number;
    maxCards: number;
  };

  // OpenAI Configuration (for STT, TTS, DALL-E)
  public readonly openai?: {
    apiKey: string;
  };

  private constructor() {
    // Validate and load required configuration
    this.llm = this.loadLLMConfig();
    this.tarot = this.loadTarotConfig();
    
    // Load optional configurations
    this.openai = this.loadOpenAIConfig();
    this.stt = this.loadSTTConfig();
    this.tts = this.loadTTSConfig();
  }

  /**
   * Get singleton instance of Config
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Validate configuration on application startup
   * Throws error if required configuration is missing
   */
  public static validate(): void {
    try {
      Config.getInstance();
    } catch (error: any) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
  }

  /**
   * Load and validate LLM configuration
   */
  private loadLLMConfig() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    const model = process.env.LLM_MODEL || 'claude-3-5-sonnet-20241022';
    const timeout = parseInt(process.env.LLM_TIMEOUT || '5000', 10);

    if (isNaN(timeout) || timeout <= 0) {
      throw new Error('LLM_TIMEOUT must be a positive number');
    }

    return { apiKey, model, timeout };
  }

  /**
   * Load and validate tarot configuration
   */
  private loadTarotConfig() {
    const deckPath = process.env.TAROT_DECK_PATH || './data/tarot.json';
    const minCards = parseInt(process.env.MIN_CARDS || '3', 10);
    const maxCards = parseInt(process.env.MAX_CARDS || '5', 10);

    if (isNaN(minCards) || minCards <= 0) {
      throw new Error('MIN_CARDS must be a positive number');
    }

    if (isNaN(maxCards) || maxCards <= 0) {
      throw new Error('MAX_CARDS must be a positive number');
    }

    if (minCards > maxCards) {
      throw new Error('MIN_CARDS cannot be greater than MAX_CARDS');
    }

    return { deckPath, minCards, maxCards };
  }

  /**
   * Load OpenAI configuration (optional)
   */
  private loadOpenAIConfig() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return undefined;
    }

    return { apiKey };
  }

  /**
   * Load STT configuration (optional)
   */
  private loadSTTConfig() {
    const enabled = process.env.STT_ENABLED === 'true';
    if (!enabled) {
      return undefined;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('STT_ENABLED is true but OPENAI_API_KEY is not set. STT will be disabled.');
      return undefined;
    }

    return { apiKey, enabled };
  }

  /**
   * Load TTS configuration (optional)
   */
  private loadTTSConfig() {
    const enabled = process.env.TTS_ENABLED === 'true';
    if (!enabled) {
      return undefined;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('TTS_ENABLED is true but OPENAI_API_KEY is not set. TTS will be disabled.');
      return undefined;
    }

    return { apiKey, enabled };
  }

  /**
   * Check if STT is enabled and configured
   */
  public isSTTEnabled(): boolean {
    return this.stt?.enabled === true;
  }

  /**
   * Check if TTS is enabled and configured
   */
  public isTTSEnabled(): boolean {
    return this.tts?.enabled === true;
  }

  /**
   * Check if OpenAI features are available
   */
  public isOpenAIAvailable(): boolean {
    return this.openai !== undefined;
  }
}
