import {
  sanitizeText,
  sanitizeQuestion,
  validateTextSafety,
  sanitizeFileName,
  validateAudioFile
} from '../sanitize';

describe('sanitizeText', () => {
  it('should remove null bytes', () => {
    const input = 'Hello\0World';
    const result = sanitizeText(input);
    expect(result).toBe('Hello World');
  });

  it('should remove script tags', () => {
    const input = 'Hello <script>alert("xss")</script> World';
    const result = sanitizeText(input);
    expect(result).toBe('Hello World');
  });

  it('should remove javascript: protocol', () => {
    const input = 'Click javascript:alert("xss")';
    const result = sanitizeText(input);
    expect(result).toBe('Click alert("xss")');
  });

  it('should remove event handlers', () => {
    const input = 'Hello onclick=alert("xss") World';
    const result = sanitizeText(input);
    expect(result).not.toContain('onclick=');
    expect(result).toContain('Hello');
    expect(result).toContain('World');
  });

  it('should preserve legitimate text', () => {
    const input = 'What does my future hold?';
    const result = sanitizeText(input);
    expect(result).toBe('What does my future hold?');
  });

  it('should handle empty strings', () => {
    const result = sanitizeText('');
    expect(result).toBe('');
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    const result = sanitizeText(input);
    expect(result).toBe('Hello World');
  });
});

describe('validateTextSafety', () => {
  it('should accept safe text', () => {
    const result = validateTextSafety('What does my future hold?');
    expect(result.safe).toBe(true);
  });

  it('should reject text with excessive repeated characters', () => {
    const input = 'a'.repeat(100);
    const result = validateTextSafety(input);
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('repeated');
  });

  it('should reject text with too many special characters', () => {
    const input = '<><><><><><><><><><><><><><><><><><>';
    const result = validateTextSafety(input);
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('special characters');
  });

  it('should reject command injection patterns', () => {
    const patterns = [
      '$(whoami)',
      '`ls -la`',
      'test | cat',
      'test && rm -rf',
      'test; whoami'
    ];

    patterns.forEach(pattern => {
      const result = validateTextSafety(pattern);
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('command');
    });
  });

  it('should reject excessively long text', () => {
    const input = 'a'.repeat(10001);
    const result = validateTextSafety(input);
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('too long');
  });
});

describe('sanitizeQuestion', () => {
  it('should sanitize and return valid questions', () => {
    const input = 'What does my future hold?';
    const result = sanitizeQuestion(input);
    expect(result.sanitized).toBe('What does my future hold?');
    expect(result.error).toBeUndefined();
  });

  it('should reject unsafe questions', () => {
    const input = '$(whoami)';
    const result = sanitizeQuestion(input);
    expect(result.sanitized).toBe('');
    expect(result.error).toBeDefined();
  });

  it('should reject questions with too much removed content', () => {
    const input = '<script>alert("xss")</script><script>alert("xss")</script>';
    const result = sanitizeQuestion(input);
    expect(result.sanitized).toBe('');
    expect(result.error).toBeDefined();
  });
});

describe('sanitizeFileName', () => {
  it('should remove path traversal attempts', () => {
    const input = '../../../etc/passwd';
    const result = sanitizeFileName(input);
    expect(result).not.toContain('..');
    expect(result).not.toContain('/');
  });

  it('should remove special characters', () => {
    const input = 'file<>:"|?*.txt';
    const result = sanitizeFileName(input);
    expect(result).toMatch(/^[a-zA-Z0-9._-]+$/);
  });

  it('should preserve valid filenames', () => {
    const input = 'my-file_123.txt';
    const result = sanitizeFileName(input);
    expect(result).toBe('my-file_123.txt');
  });

  it('should limit filename length', () => {
    const input = 'a'.repeat(300);
    const result = sanitizeFileName(input);
    expect(result.length).toBeLessThanOrEqual(255);
  });
});

describe('validateAudioFile', () => {
  it('should accept valid audio files', () => {
    const blob = new Blob(['audio data'], { type: 'audio/mpeg' });
    Object.defineProperty(blob, 'size', { value: 1024 * 100 }); // 100KB
    
    const result = validateAudioFile(blob);
    expect(result.valid).toBe(true);
  });

  it('should reject files that are too large', () => {
    const blob = new Blob(['audio data'], { type: 'audio/mpeg' });
    Object.defineProperty(blob, 'size', { value: 26 * 1024 * 1024 }); // 26MB
    
    const result = validateAudioFile(blob);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });

  it('should reject files that are too small', () => {
    const blob = new Blob(['x'], { type: 'audio/mpeg' });
    Object.defineProperty(blob, 'size', { value: 100 }); // 100 bytes
    
    const result = validateAudioFile(blob);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too small');
  });

  it('should reject invalid file types', () => {
    const blob = new Blob(['data'], { type: 'application/pdf' });
    Object.defineProperty(blob, 'size', { value: 1024 * 100 });
    
    const result = validateAudioFile(blob);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid audio format');
  });

  it('should accept various audio formats', () => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'];
    
    validTypes.forEach(type => {
      const blob = new Blob(['audio data'], { type });
      Object.defineProperty(blob, 'size', { value: 1024 * 100 });
      
      const result = validateAudioFile(blob);
      expect(result.valid).toBe(true);
    });
  });
});
