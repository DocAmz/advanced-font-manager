import { FontMetrics, SanitizerResult } from '../types/sanitizer';
import { ValidationRule } from '../types/validations';
import { GlyphValidationService } from '../validations/glyph.validationService';
import { MetricsValidationService } from '../validations/metrics.validationService';
import { FontValidationService } from './../validations/font.validationService';
import * as opentype from 'opentype.js';

export class SanitizerService {
  private GliphValidationService:   GlyphValidationService | undefined      = undefined
  private FontValidationService:    FontValidationService | undefined       = undefined
  private MetricsValidationService: MetricsValidationService | undefined    = undefined
  private metrics:                  FontMetrics | undefined                 = undefined;
  private errors:                   Error[]                                 = []

  private font: opentype.Font | undefined = undefined

  private stats = {
    totalMetrics:     7,
    validMetrics:     0,
    fixedMetrics:     0,

    totalGlyphs:      0,
    validGlyphs:      0,
    fixedGlyphs:      0,
    removedGlyphs:    0,

    totalFontParams:  0,
    validFontParams:  0,
    fixedFontParams:  0,
  }


  constructor() {
    this.GliphValidationService     = new GlyphValidationService()
    this.FontValidationService      = new FontValidationService()
    this.MetricsValidationService   = new MetricsValidationService()
  }

  public async sanitize(font: opentype.Font, rules: ValidationRule[]): Promise<SanitizerResult> {
    let result: SanitizerResult = {
      success: false,
      font: font.toArrayBuffer(),
      message: 'Font is not valid',
      errors: []
    }
    // Reset all values
    this.resetDefaults()
    if(!FontValidationService || !GlyphValidationService || !MetricsValidationService) {
      return {
        success: false,
        message: 'Validation services are not available',
        errors: [
          new Error('Validation services are not available')
        ]
      }
    }



    const fontMetrics = this.FontValidationService?.validateFont(font, rules.filter(rule => rule.type === 'font'))
    if (!fontMetrics) {

      let message = 'Font validation failed'
      let error = [new Error(message)]

      result = {
        success: false,
        message: message,
        errors: result.errors ? [...result.errors, ...error] : error
      }
      return result
    }

    this.metrics = {
      xMin:         font.tables.head.xMin,
      xMax:         font.tables.head.xMax,
      yMin:         font.tables.head.yMin,
      yMax:         font.tables.head.yMax,
      ascender:     font.ascender,
      descender:    font.descender,
      unitsPerEm:   font.unitsPerEm
    }

    this.stats.totalFontParams = 1
    this.stats.validFontParams = 1

    const glyphData = this.FontValidationService?.getGlyphData(font)
    if (!glyphData) {

      let message = 'Failed to get glyph data'
      let error = [new Error(message)]

      result = {
        success: false,
        message: message,
        errors: result.errors ? [...result.errors, ...error] : error
      }
      return result
    }

    const glyphs = this.GliphValidationService?.validateGlyphs(Array.from(glyphData.values()), this.metrics, rules.filter(rule => rule.type === 'glyph'))
    if (!glyphs) {

      let message = 'Glyphs are not valid'
      let error   = [new Error(message)]

      result = {
        success:  false,
        message:  message,
        errors:   result.errors ? [...result.errors, ...error] : error
      }
      return result
    }

    this.stats.totalGlyphs = Array.from(glyphData).length
    this.stats.validGlyphs = Array.from(glyphData).length

    const metrics = this.MetricsValidationService?.validateMetrics(this.metrics, rules.filter(rule => rule.type === 'metrics'))
    if (!metrics) {
      let message = 'Metrics are not valid'
      let error   = [new Error(message)]

      result = {
        success:  false,
        message:  message,
        errors:   result.errors ? [...result.errors, ...error] : error
      }
      return result
    }

    this.stats.totalMetrics = Object.keys(this.metrics).length
    this.stats.validMetrics = Object.keys(this.metrics).length

    result = {
      success: true,
      message: 'Font is valid',
      font: this.createSubsetFont(font, glyphData).toArrayBuffer(),
      stats: this.stats,
      errors: result.errors ? [ ...this.errors, ...result.errors] : this.errors
    }

    return result
  }

  edit(font: opentype.Font, rules: ValidationRule[]) {
    this.resetDefaults()
    this.font = font
    this.metrics = {
      xMin: this.font.tables.head.xMin,
      xMax: this.font.tables.head.xMax,
      yMin: this.font.tables.head.yMin,
      yMax: this.font.tables.head.yMax,
      ascender: this.font.ascender,
      descender: this.font.descender,
      unitsPerEm: this.font.unitsPerEm
    }
    const originalFont  = this.font
    const glyphData     = this.FontValidationService?.getGlyphData(this.font)

    // const this.stats.totalFontParams = this.initFontParams(this.font)

    // const { newMetrics, errors, success } = this.MetricsValidationService?.editMetrics(this.metrics, rules.filter(rule => rule.type === 'metrics')) || { newMetrics: undefined, errors: [], success: false }

  }


  private createSubsetFont(originalFont: opentype.Font, validGlyphs: Map<number, opentype.Glyph>): opentype.Font {
    if (!originalFont) {
      return originalFont
    }

    if(!this.metrics) {
      return originalFont
    }

    if(!this.font) {
      return originalFont
    }

    const subset = new opentype.Font({
      familyName:   this.font.names.fontFamily.en,
      styleName:    this.font.names.fontSubfamily.en,
      unitsPerEm:   this.metrics.unitsPerEm,
      ascender:     this.metrics.ascender,
      descender:    this.metrics.descender,
      glyphs:       Array.from(validGlyphs.values())
    })

    subset.tables = {
      ...subset.tables,
      os2:  this.font.tables.os2,
      head: this.font.tables.head,
      hhea: this.font.tables.hhea,
      name: this.font.tables.name
    }

    return subset

  }

  private resetDefaults() {
    this.errors = []
    this.stats = {
      totalMetrics:   0,
      validMetrics:   0,
      fixedMetrics:   0,

      totalGlyphs:    0,
      validGlyphs:    0,
      fixedGlyphs:    0,
      removedGlyphs:  0,

      totalFontParams: 0,
      validFontParams: 0,
      fixedFontParams: 0,
    }
    this.metrics = undefined
  }

  initFontParams(font: opentype.Font): number {
    let total = 0
    if (font.ascender)          { total++ }
    if (font.descender)         { total++ }
    if (font.unitsPerEm)        { total++ }
    if (font.numGlyphs)         { total++ }
    if (font.numberOfHMetrics)  { total++ }
    if (font.outlinesFormat)    { total++ }
   // if (font.lin)

    return total
  }

}