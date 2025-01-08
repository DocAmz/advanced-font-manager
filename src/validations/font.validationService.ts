import * as op from 'opentype.js';
import { SanitizerResult } from "../types/sanitizer";
import { FontValidationRule, ValidationRule } from "../types/validations";

export class FontValidationService {

  private FontValidationRules: Map<string, ValidationRule>;

  constructor() {
    this.FontValidationRules = new Map();
  }

  public async validateFont(font: op.Font, rules: ValidationRule[]): Promise<SanitizerResult> {
    return new Promise((resolve, reject) => {

      rules.forEach((rule: ValidationRule, i) => {
        if (rule.type === 'font') {
          this.FontValidationRules.set(`font-validitaion-${i + 1}`, rule);
        }
      });
      this.FontValidationRules.forEach((rule: ValidationRule, key: string) => {
        console.log(`Font Validation Rule: ${key}`);

        const { check, fix, severity } = rule.rule as FontValidationRule

        if(check(font)) {
          console.log(`Font Validation Rule: ${key} passed`);
        } else {
          console.log(`Font Validation Rule: ${key} failed`);

          if(fix) {
            const newFont = fix(font);
            if(newFont) {
              console.log(`Font Validation Rule: ${key} fixed`);
            }
          }
        }
      })
      const result: SanitizerResult = {
        success: false,
        message: 'Font is not valid',
        errors: []
      }
      resolve(result);
    });
  }

  getGlyphData(font: op.Font) {

    // @ts-ignore fix later
    return font.glyphs.glyphs.map((glyph: op.Glyph) => {
      return {
        name: glyph.name,
        unicode: glyph.unicode,
        advanceWidth: glyph.advanceWidth,
        xMin: glyph.xMin,
        xMax: glyph.xMax,
        yMin: glyph.yMin,
        yMax: glyph.yMax,
  }
  })}
}
