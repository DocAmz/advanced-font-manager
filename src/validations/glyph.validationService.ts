import * as op from 'opentype.js';
import { ValidationRule } from '../types/validations';
import { FontMetrics, SanitizerResult } from '../types/sanitizer';

export class GlyphValidationService {
  validateGlyphs(glyphs: op.Glyph[], metrics: FontMetrics, rules: ValidationRule[]): SanitizerResult {
    return {
      success: false,
      message: 'Glyphs are not valid',
      errors: []
    }
  }
}