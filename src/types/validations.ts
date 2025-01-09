// Type definitions for Validations
// Project: advanced-font-loader

import * as op from "opentype.js";
import { Prettify } from "./utility";

export type ValidationRule = {
  type: 'metrics' | 'glyph' | 'font' | 'names' | 'tables'
  rule: MetricsValidationRule | GlyphValidationRule | FontValidationRule | NamesValidationRule | TablesValidationRule
  message?: string;
}

export type FontValidationRule  ={
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export type TablesValidationRule = {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export type NamesValidationRule = {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export type MetricsValidationRule = {
  check: (font: op.Font) => boolean;
  fix?: (font: op.Font) => op.Font | null;
  severity: "error" | "warning";
}

export type GlyphValidationRule = {
  check: (glyph: op.Glyph) => boolean;
  fix?: (glyph: op.Glyph) => op.Glyph | null;
  severity: "error" | "warning";
}
