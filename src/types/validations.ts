// Type definitions for Validations
// Project: advanced-font-loader

import * as op from "opentype.js";

export type ValidationRule = {
  type: 'metrics' | 'glyph' | 'font' | 'names' | 'tables'
  rule: MetricsValidationRule | GlyphValidationRule;
  message?: string;
}

export interface FontValidationRule {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export interface TablesValidationRule {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export interface NamesValidationRule {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export interface MetricsValidationRule {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export interface GlyphValidationRule {
  check: (glyph: op.Glyph) => boolean;
  fix?: (glyph: op.Glyph) => op.Glyph | null;
  severity: "error" | "warning";
}
