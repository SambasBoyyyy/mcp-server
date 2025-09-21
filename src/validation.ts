export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateSymbol(symbol: string): string {
  if (!symbol || typeof symbol !== 'string') {
    throw new ValidationError('Symbol must be a non-empty string');
  }

  // Basic symbol validation - alphanumeric characters only
  if (!/^[A-Z0-9.]{1,10}$/i.test(symbol)) {
    throw new ValidationError('Invalid symbol format. Symbols should contain only letters, numbers, and dots (max 10 characters)');
  }

  // Convert to uppercase for consistency
  return symbol.toUpperCase();
}

export function validateKeywords(keywords: string): void {
  if (!keywords || typeof keywords !== 'string') {
    throw new ValidationError('Keywords must be a non-empty string');
  }

  if (keywords.trim().length < 2) {
    throw new ValidationError('Keywords must be at least 2 characters long');
  }

  if (keywords.length > 100) {
    throw new ValidationError('Keywords must be less than 100 characters');
  }
}

export function validateOutputSize(outputSize: string): void {
  if (outputSize && !['compact', 'full'].includes(outputSize)) {
    throw new ValidationError('Output size must be either "compact" or "full"');
  }
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    throw new ValidationError('Input must be a string');
  }
  
  // Remove potentially harmful characters and trim whitespace
  return input.trim().replace(/[<>\"'&]/g, '');
}

