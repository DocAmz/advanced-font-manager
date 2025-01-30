import * as op from 'opentype.js';
import { ValidationRule } from '../types/validations';
import { SanitizerService } from '../services/sanitizerService';
import { SanitizerResult } from '../types/sanitizer';

export class fontResolver {
  private sanitizer: SanitizerService

  constructor() {
    this.sanitizer = new SanitizerService();
  }

  // sanitize with the rules and return a new font
  // build a result with the new font and the stats
  // logs and error management

  async resolveFont(
    originalFont: ArrayBuffer,
    error: any,
    rules: ValidationRule[]
  ): Promise<SanitizerResult> {


    let transpileError = [error];
    let result: SanitizerResult = {
      success: false,
      message: 'Font is not valid',
      errors: transpileError
    }


    try {

      const font = op.parse(originalFont);
      result = await this.sanitizer.sanitize(font, rules);

    } catch (error) {
      transpileError.push(error);
    }

    return result
  }
}
