import { Logger } from '../Logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const logger1 = Logger.getInstance();
      const logger2 = Logger.getInstance();

      expect(logger1).toBe(logger2);
    });
  });

  describe('info', () => {
    it('should log info message with structured format', () => {
      const logger = Logger.getInstance();
      logger.info('Test message', { key: 'value' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.level).toBe('INFO');
      expect(loggedData.message).toBe('Test message');
      expect(loggedData.key).toBe('value');
      expect(loggedData.timestamp).toBeDefined();
    });
  });

  describe('error', () => {
    it('should log error with error details', () => {
      const logger = Logger.getInstance();
      const error = new Error('Test error');
      logger.error('Error occurred', error, { context: 'test' });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(loggedData.level).toBe('ERROR');
      expect(loggedData.message).toBe('Error occurred');
      expect(loggedData.errorMessage).toBe('Test error');
      expect(loggedData.errorName).toBe('Error');
      expect(loggedData.context).toBe('test');
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      const logger = Logger.getInstance();
      logger.warn('Warning message', { severity: 'low' });

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][0]);

      expect(loggedData.level).toBe('WARN');
      expect(loggedData.message).toBe('Warning message');
      expect(loggedData.severity).toBe('low');
    });
  });

  describe('timing', () => {
    it('should log performance timing', () => {
      const logger = Logger.getInstance();
      logger.timing('database-query', 150, { query: 'SELECT' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.level).toBe('TIMING');
      expect(loggedData.operation).toBe('database-query');
      expect(loggedData.duration).toBe(150);
      expect(loggedData.query).toBe('SELECT');
    });
  });

  describe('apiRequest', () => {
    it('should log API request details', () => {
      const logger = Logger.getInstance();
      logger.apiRequest('/api/fortune', 'POST', 250, 200, { cardCount: 3 });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.level).toBe('API_REQUEST');
      expect(loggedData.endpoint).toBe('/api/fortune');
      expect(loggedData.method).toBe('POST');
      expect(loggedData.duration).toBe(250);
      expect(loggedData.statusCode).toBe(200);
      expect(loggedData.success).toBe(true);
      expect(loggedData.cardCount).toBe(3);
    });
  });

  describe('externalApiCall', () => {
    it('should log external API call details', () => {
      const logger = Logger.getInstance();
      logger.externalApiCall('anthropic', 'generate-fortune', 1500, true, { model: 'claude' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.level).toBe('EXTERNAL_API');
      expect(loggedData.service).toBe('anthropic');
      expect(loggedData.operation).toBe('generate-fortune');
      expect(loggedData.duration).toBe(1500);
      expect(loggedData.success).toBe(true);
      expect(loggedData.model).toBe('claude');
    });
  });

  describe('PII Sanitization', () => {
    it('should not log question field', () => {
      const logger = Logger.getInstance();
      logger.info('User request', { question: 'Will I find love?', cardCount: 3 });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.question).toBeUndefined();
      expect(loggedData.cardCount).toBe(3);
    });

    it('should not log fortune field', () => {
      const logger = Logger.getInstance();
      logger.info('Fortune generated', { fortune: 'The cards reveal...', duration: 1000 });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.fortune).toBeUndefined();
      expect(loggedData.duration).toBe(1000);
    });

    it('should not log transcript field', () => {
      const logger = Logger.getInstance();
      logger.info('Transcription complete', { transcript: 'User speech', success: true });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.transcript).toBeUndefined();
      expect(loggedData.success).toBe(true);
    });
  });

  describe('Child Logger', () => {
    it('should include default metadata in all logs', () => {
      const logger = Logger.getInstance();
      const childLogger = logger.child({ component: 'FortuneService' });

      childLogger.info('Processing request', { requestId: '123' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(loggedData.component).toBe('FortuneService');
      expect(loggedData.requestId).toBe('123');
    });
  });
});
