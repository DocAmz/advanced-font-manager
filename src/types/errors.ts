// Type definitions for FontErrorHandler
// Project: advanced-font-loader

export interface FontLoadError {
  type:
    | 'timeout'
    | 'network'
    | 'format'
    | 'security'
    | 'validation'
    | 'sanitizer'
    | 'DOMException'
    | 'unknown';
  message: string;
  details?: string[];
  originalError?: any;
}