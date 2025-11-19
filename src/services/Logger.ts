/**
 * Structured logging service for the application
 * Ensures no PII is logged and provides consistent log format
 */
export class Logger {
  private static instance: Logger | null = null;

  private constructor() {}

  /**
   * Get singleton instance of Logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log informational message
   * @param message Log message
   * @param meta Additional metadata (no PII)
   */
  public info(message: string, meta?: Record<string, any>): void {
    const logEntry = this.createLogEntry('INFO', message, meta);
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Log error message
   * @param message Error message
   * @param error Error object
   * @param meta Additional metadata (no PII)
   */
  public error(message: string, error: Error, meta?: Record<string, any>): void {
    const logEntry = this.createLogEntry('ERROR', message, {
      ...meta,
      errorMessage: error.message,
      errorName: error.name,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
    console.error(JSON.stringify(logEntry));
  }

  /**
   * Log warning message
   * @param message Warning message
   * @param meta Additional metadata (no PII)
   */
  public warn(message: string, meta?: Record<string, any>): void {
    const logEntry = this.createLogEntry('WARN', message, meta);
    console.warn(JSON.stringify(logEntry));
  }

  /**
   * Log performance timing
   * @param operation Operation name
   * @param duration Duration in milliseconds
   * @param meta Additional metadata (no PII)
   */
  public timing(operation: string, duration: number, meta?: Record<string, any>): void {
    const logEntry = this.createLogEntry('TIMING', `${operation} completed`, {
      ...meta,
      operation,
      duration,
      durationMs: duration
    });
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Log API request
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param duration Duration in milliseconds
   * @param statusCode HTTP status code
   * @param meta Additional metadata (no PII)
   */
  public apiRequest(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    meta?: Record<string, any>
  ): void {
    const logEntry = this.createLogEntry('API_REQUEST', `${method} ${endpoint}`, {
      ...meta,
      endpoint,
      method,
      duration,
      statusCode,
      success: statusCode >= 200 && statusCode < 300
    });
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Log external API call (LLM, STT, TTS, etc.)
   * @param service Service name (e.g., 'anthropic', 'openai-whisper')
   * @param operation Operation name (e.g., 'generate-fortune', 'transcribe')
   * @param duration Duration in milliseconds
   * @param success Whether the call succeeded
   * @param meta Additional metadata (no PII)
   */
  public externalApiCall(
    service: string,
    operation: string,
    duration: number,
    success: boolean,
    meta?: Record<string, any>
  ): void {
    const logEntry = this.createLogEntry('EXTERNAL_API', `${service}:${operation}`, {
      ...meta,
      service,
      operation,
      duration,
      success
    });
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Create structured log entry
   * @param level Log level
   * @param message Log message
   * @param meta Additional metadata
   */
  private createLogEntry(
    level: string,
    message: string,
    meta?: Record<string, any>
  ): Record<string, any> {
    const entry: Record<string, any> = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: process.env.NODE_ENV || 'development'
    };

    // Add metadata if provided, ensuring no PII
    if (meta) {
      const sanitizedMeta = this.sanitizeMetadata(meta);
      Object.assign(entry, sanitizedMeta);
    }

    return entry;
  }

  /**
   * Sanitize metadata to ensure no PII is logged
   * @param meta Metadata object
   */
  private sanitizeMetadata(meta: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    const piiKeys = ['question', 'fortune', 'transcript', 'text', 'audioData', 'imageData'];

    for (const [key, value] of Object.entries(meta)) {
      // Skip PII fields
      if (piiKeys.includes(key.toLowerCase())) {
        continue;
      }

      // Recursively sanitize nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeMetadata(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Create a child logger with default metadata
   * Useful for adding context to all logs from a specific component
   * @param defaultMeta Default metadata to include in all logs
   */
  public child(defaultMeta: Record<string, any>): ChildLogger {
    return new ChildLogger(this, defaultMeta);
  }
}

/**
 * Child logger that includes default metadata in all log calls
 */
class ChildLogger {
  constructor(
    private parent: Logger,
    private defaultMeta: Record<string, any>
  ) {}

  public info(message: string, meta?: Record<string, any>): void {
    this.parent.info(message, { ...this.defaultMeta, ...meta });
  }

  public error(message: string, error: Error, meta?: Record<string, any>): void {
    this.parent.error(message, error, { ...this.defaultMeta, ...meta });
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.parent.warn(message, meta);
  }

  public timing(operation: string, duration: number, meta?: Record<string, any>): void {
    this.parent.timing(operation, duration, { ...this.defaultMeta, ...meta });
  }

  public apiRequest(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    meta?: Record<string, any>
  ): void {
    this.parent.apiRequest(endpoint, method, duration, statusCode, { ...this.defaultMeta, ...meta });
  }

  public externalApiCall(
    service: string,
    operation: string,
    duration: number,
    success: boolean,
    meta?: Record<string, any>
  ): void {
    this.parent.externalApiCall(service, operation, duration, success, { ...this.defaultMeta, ...meta });
  }
}
