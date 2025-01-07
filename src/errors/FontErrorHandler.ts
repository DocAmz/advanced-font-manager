import { FontLoadError } from "../types/errors";

export class FontErrorHandler {
  failedFonts: Map<string, FontLoadError>;

  constructor() {
    this.failedFonts = new Map();
  }

  addFailedFont(fontName: string, error: any) {
    this.failedFonts.set(fontName, this.categorizeError(error));
  }

  getError(fontFamily: string): FontLoadError | null {
    return this.failedFonts.get(fontFamily) || null;
  }

  hasError(fontFamily: string): boolean {
    const error = this.failedFonts.get(fontFamily);
    return error ? true : false;
  }

  destroy() {
    this.failedFonts.clear();
  }

  categorizeError(error: any): FontLoadError {
    const errorMessage = error?.message || String(error);

    if (errorMessage.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Font loading timed out',
        details: [errorMessage]
      };
    }

    if (errorMessage.includes('illegal string')) {
      return {
        type: 'DOMException',
        message: 'DOM Exception while loading font',
        details: [errorMessage],
        originalError: error
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'network',
        message: 'Network error while loading font',
        details: [errorMessage]
      };
    }

    if (errorMessage.includes('format') || errorMessage.includes('invalid font')) {
      return {
        type: 'format',
        message: 'Ivalid font format or corrupted font',
        details: [errorMessage]
      };
    }

    if (errorMessage.includes('security') || errorMessage.includes('CORS')) {
      return {
        type: 'security',
        message: 'Security error while loading font',
        details: [errorMessage]
      };
    }

    if (errorMessage.includes('validation')) {
      return {
        type: 'validation',
        message: 'Font failed validation checks',
        details: ['The font file is invalid'],
        originalError: error
      };
    }

    if (errorMessage.includes('sanitizer')) {
      return {
        type: 'sanitizer',
        message: 'Font was blocked for security reasons',
        details: ['The font file appears to be corrupted or invalid.'],
        originalError: error
      };
    }

    return {
      type: 'unknown',
      message: 'An unknown error occurred while loading font',
      details: [errorMessage],
      originalError: error
    };
  }

}