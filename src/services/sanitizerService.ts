import { FontMetrics, SanitizerResult } from '../types/sanitizer';
import { ValidationRule } from '../types/validations';
import { GlyphValidationService } from '../validations/glyph.validationService';
import { MetricsValidationService } from '../validations/metrics.validationService';
import { FontValidationService } from './../validations/font.validationService';
import * as opentype from 'opentype.js';

export class SanitizerService {
  private GliphValidationService: GlyphValidationService | undefined = undefined
  private FontValidationService: FontValidationService | undefined = undefined
  private MetricsValidationService: MetricsValidationService | undefined = undefined
  private metrics: FontMetrics | undefined = undefined;
  private errors: string[] = []

  private stats = {
    totalMetrics: 0,
    validMetrics: 0,
    fixedMetrics: 0,

    totalGlyphs: 0,
    validGlyphs: 0,
    fixedGlyphs: 0,
    removedGlyphs: 0,

    totalFontParams: 0,
    validFontParams: 0,
    fixedFontParams: 0,
  }


  constructor() {
    this.GliphValidationService = new GlyphValidationService()
    this.FontValidationService = new FontValidationService()
    this.MetricsValidationService = new MetricsValidationService()
  }

  public async sanitize(font: opentype.Font, rules: ValidationRule[]): Promise<SanitizerResult> {

    let result: SanitizerResult = {
      success: false,
      message: 'Font is not valid',
      errors: ['failed to initialize validation services']
    }

    // Reset all values
    this.resetDefaults()
    if(!FontValidationService || !GlyphValidationService || !MetricsValidationService) {
      return {
        success: false,
        message: 'Validation services are not available',
        errors: [
          'Validation services are not available'
        ]
      }
    }



    const fontMetrics = this.FontValidationService?.validateFont(font, rules.filter(rule => rule.type === 'font'))
    if (!fontMetrics) {

      let error = ['Font validation failed']

      result = {
        success: false,
        message: error[0],
        errors: result.errors ? [...result.errors, ...error] : ['Font metrics are not valid']
      }
      return result
    }

    this.metrics = {
      xMin: font.tables.head.xMin,
      xMax: font.tables.head.xMax,
      yMin: font.tables.head.yMin,
      yMax: font.tables.head.yMax,
      ascender: font.ascender,
      descender: font.descender,
      unitsPerEm: font.unitsPerEm
    }

    this.stats.totalFontParams = 1
    this.stats.validFontParams = 1

    const glyphData = this.FontValidationService?.getGlyphData(font)
    if (!glyphData) {

      let error = ['Failed to get glyph data']

      result = {
        success: false,
        message: error[0],
        errors: result.errors ? [...result.errors, ...error] : ['Failed to get glyph data']
      }
      return result
    }

    const glyphs = this.GliphValidationService?.validateGlyphs(Array.from(glyphData.values()), this.metrics, rules.filter(rule => rule.type === 'glyph'))
    if (!glyphs) {

      let error = ['Glyphs are not valid']

      result = {
        success: false,
        message: error[0],
        errors: result.errors ? [...result.errors, ...error] : ['Glyphs are not valid']
      }
      return result
    }

    this.stats.totalGlyphs = Array.from(glyphData).length
    this.stats.validGlyphs = Array.from(glyphData).length

    const metrics = this.MetricsValidationService?.validateMetrics(this.metrics, rules.filter(rule => rule.type === 'metrics'))
    if (!metrics) {

      let error = ['Metrics are not valid']

      result = {
        success: false,
        message: error[0],
        errors: result.errors ? [...result.errors, ...error] : ['Metrics are not valid']
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



  private createSubsetFont(originalFont: opentype.Font, validGlyphs: Map<number, opentype.Glyph>): opentype.Font {
    if (!originalFont) {
      return originalFont
    }

    if(!this.metrics) {
      return originalFont
    }

    const subset = new opentype.Font({
      familyName: originalFont.names.fontFamily.en,
      styleName: originalFont.names.fontSubfamily.en,
      unitsPerEm: this.metrics.unitsPerEm,
      ascender: this.metrics.ascender,
      descender: this.metrics.descender,
      glyphs: Array.from(validGlyphs.values())
    })

    subset.tables = {
      ...subset.tables,
      os2: originalFont.tables.os2,
      head: originalFont.tables.head,
      hhea: originalFont.tables.hhea,
      name: originalFont.tables.name
    }

    return subset

  }

  private resetDefaults() {
    this.errors = []
    this.stats = {
      totalMetrics: 0,
      validMetrics: 0,
      fixedMetrics: 0,

      totalGlyphs: 0,
      validGlyphs: 0,
      fixedGlyphs: 0,
      removedGlyphs: 0,

      totalFontParams: 0,
      validFontParams: 0,
      fixedFontParams: 0,
    }
    this.metrics = undefined
  }

}