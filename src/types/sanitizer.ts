export interface SanitizerResult {
  success: boolean;
  font?: ArrayBuffer
  message: string;
  stats?: {
    totalGlyphs: number
    validGlyphs: number
    fixedGlyphs: number
    removedGlyphs: number
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