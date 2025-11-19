import { Config } from '../Config';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset singleton instance using reflection
    (Config as any).instance = null;
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('LLM Configuration', () => {
    it('should load LLM configuration from environment variables', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.LLM_MODEL = 'test-model';
      process.env.LLM_TIMEOUT = '10000';

      const config = Config.getInstance();

      expect(config.llm.apiKey).toBe('test-key');
      expect(config.llm.model).toBe('test-model');
      expect(config.llm.timeout).toBe(10000);
    });

    it('should use default values for optional LLM settings', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';

      const config = Config.getInstance();

      expect(config.llm.model).toBe('claude-3-5-sonnet-20241022');
      expect(config.llm.timeout).toBe(5000);
    });

    it('should throw error if ANTHROPIC_API_KEY is missing', () => {
      delete process.env.ANTHROPIC_API_KEY;

      expect(() => Config.getInstance()).toThrow('ANTHROPIC_API_KEY environment variable is required');
    });
  });

  describe('Tarot Configuration', () => {
    it('should load tarot configuration from environment variables', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.TAROT_DECK_PATH = './custom/path.json';
      process.env.MIN_CARDS = '2';
      process.env.MAX_CARDS = '7';

      const config = Config.getInstance();

      expect(config.tarot.deckPath).toBe('./custom/path.json');
      expect(config.tarot.minCards).toBe(2);
      expect(config.tarot.maxCards).toBe(7);
    });

    it('should use default values for tarot settings', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';

      const config = Config.getInstance();

      expect(config.tarot.deckPath).toBe('./data/tarot.json');
      expect(config.tarot.minCards).toBe(3);
      expect(config.tarot.maxCards).toBe(5);
    });

    it('should throw error if MIN_CARDS is greater than MAX_CARDS', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.MIN_CARDS = '10';
      process.env.MAX_CARDS = '5';

      expect(() => Config.getInstance()).toThrow('MIN_CARDS cannot be greater than MAX_CARDS');
    });
  });

  describe('Optional Features', () => {
    it('should detect when OpenAI is available', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.OPENAI_API_KEY = 'openai-key';

      const config = Config.getInstance();

      expect(config.isOpenAIAvailable()).toBe(true);
      expect(config.openai?.apiKey).toBe('openai-key');
    });

    it('should detect when OpenAI is not available', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      delete process.env.OPENAI_API_KEY;

      const config = Config.getInstance();

      expect(config.isOpenAIAvailable()).toBe(false);
      expect(config.openai).toBeUndefined();
    });

    it('should detect when STT is enabled', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.OPENAI_API_KEY = 'openai-key';
      process.env.STT_ENABLED = 'true';

      const config = Config.getInstance();

      expect(config.isSTTEnabled()).toBe(true);
      expect(config.stt?.enabled).toBe(true);
    });

    it('should detect when TTS is enabled', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      process.env.OPENAI_API_KEY = 'openai-key';
      process.env.TTS_ENABLED = 'true';

      const config = Config.getInstance();

      expect(config.isTTSEnabled()).toBe(true);
      expect(config.tts?.enabled).toBe(true);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';

      const config1 = Config.getInstance();
      const config2 = Config.getInstance();

      expect(config1).toBe(config2);
    });
  });
});
