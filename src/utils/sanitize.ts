/**
 * Sanitize user input to prevent injection attacks and malicious content
 */

/**
 * Sanitize text input by removing potentially dangerous characters and patterns
 * while preserving legitimate punctuation and unicode characters
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove null bytes (replace with space to preserve word boundaries)
  let sanitized = input.replace(/\0/g, ' ');
  
  // Remove control characters except newlines, tabs, and carriage returns
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove potential script injection patterns
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, ' '); // Remove event handlers like onclick=
  
  // Remove potential SQL injection patterns (though we don't use SQL)
  sanitized = sanitized.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '');
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Trim
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Validate that text doesn't contain suspicious patterns
 */
export function validateTextSafety(input: string): { safe: boolean; reason?: string } {
  if (typeof input !== 'string') {
    return { safe: false, reason: 'Input must be a string' };
  }
  
  // Check for excessive length
  if (input.length > 10000) {
    return { safe: false, reason: 'Input too long' };
  }
  
  // Check for repeated characters (potential DoS)
  const repeatedPattern = /(.)\1{50,}/;
  if (repeatedPattern.test(input)) {
    return { safe: false, reason: 'Suspicious repeated characters' };
  }
  
  // Check for excessive special characters
  const specialCharCount = (input.match(/[<>{}[\]\\|`]/g) || []).length;
  if (specialCharCount > input.length * 0.3) {
    return { safe: false, reason: 'Too many special characters' };
  }
  
  // Check for potential command injection
  const commandPatterns = [
    /\$\(.*\)/,  // Command substitution
    /`.*`/,      // Backtick execution
    /\|\s*\w+/,  // Pipe to command
    /&&\s*\w+/,  // Command chaining
    /;\s*\w+/    // Command separator
  ];
  
  for (const pattern of commandPatterns) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'Suspicious command pattern detected' };
    }
  }
  
  return { safe: true };
}

/**
 * Sanitize and validate user question input
 */
export function sanitizeQuestion(question: string): { sanitized: string; error?: string } {
  // First validate safety
  const validation = validateTextSafety(question);
  if (!validation.safe) {
    return { 
      sanitized: '', 
      error: 'Your question contains invalid characters. Please rephrase and try again.' 
    };
  }
  
  // Sanitize the input
  const sanitized = sanitizeText(question);
  
  // Check if sanitization removed too much content
  if (sanitized.length < question.length * 0.5 && question.length > 10) {
    return { 
      sanitized: '', 
      error: 'Your question contains invalid characters. Please rephrase and try again.' 
    };
  }
  
  return { sanitized };
}

/**
 * Sanitize file names to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') {
    return '';
  }
  
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '');
  
  // Remove special characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }
  
  return sanitized;
}

/**
 * Validate audio file size and type
 */
export function validateAudioFile(file: Blob): { valid: boolean; error?: string } {
  // Check file size (max 25MB for Whisper API)
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Audio file is too large. Maximum size is 25MB.' };
  }
  
  // Check minimum size (at least 1KB)
  if (file.size < 1024) {
    return { valid: false, error: 'Audio file is too small.' };
  }
  
  // Check file type
  const validTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'audio/m4a',
    'audio/mp4'
  ];
  
  if (file.type && !validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid audio format.' };
  }
  
  return { valid: true };
}
