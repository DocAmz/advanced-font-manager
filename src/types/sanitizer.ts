export type SanitizerResult = {
  success: boolean;
  font?: ArrayBuffer
  message: string;
  stats?: {
    totalMetrics: number;
    validMetrics: number;
    fixedMetrics: number;
    totalGlyphs: number;
    validGlyphs: number;
    fixedGlyphs: number;
    removedGlyphs: number;
    totalFontParams: number;
    validFontParams: number;
    fixedFontParams: number;
  };
  errors?: string[]
}

export type FontMetrics = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  ascender: number;
  descender: number;
  unitsPerEm: number;
}