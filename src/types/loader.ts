// Type definitions for fontLoader
// Project: advanced-font-loader

import { fontFacesOptions } from "./fonts";
import { Prettify } from "./utility";

export type FontLoaderOptions = {
  useResolvers?: boolean; // Should we use the resolvers to load the fonts
  disableWarnings?: boolean; // Should we disable warnings
  useCache?: boolean; // Should we use the cache
  debugLevel?: 'info' | 'warn' | 'error' | 'debug' // Minimum level of logs to display
};

export type loadParameters = {
  unitsPerEm?: number; // The number of units per em
  timeOut?: number; // The time out for loading the font
}

export type loadFromUrlProps = {
  fonts: [
    {
      url: string;
      family: string;
      options?: Prettify<fontFacesOptions>;
    }
  ];
  params?: loadParameters;
}

export type loadFromFileProps = {
  fonts: [
    {
      file: File;
      family: string;
      options?: fontFacesOptions;
    }
  ];
  params?: loadParameters;
}
export type loadFromBufferProps = {
  fonts: [
    {
      buffer: ArrayBuffer;
      family: string;
      options?: fontFacesOptions;
    }
  ];
  params?: loadParameters;
}

export interface FontLoadEvent {
  family: string;
  font?: FontFace;
  status?: 'loading' | 'success' | 'error' | 'resolved';
  error?: Error;
}

export interface FontLoadSummary {
  total: number;
  succeeded: number;
  failed: number;
  failedFamilies: string[];
}

export type FontLoaderEvents = {
  fontLoadStart: { fonts: FontFace[] };
  fontLoadProgress: Prettify<FontLoadEvent>;
  fontLoadTimeout: Prettify<FontLoadEvent>;
  fontLoadError: Prettify<FontLoadEvent>;
  fontLoadComplete: Prettify<FontLoadEvent>;
  fontLoadFinished: Prettify<FontLoadSummary>;
  fontAdded: Prettify<FontLoadEvent>;
}

// Type-safe event handler
export type EventHandler<K extends keyof EventMap> = (data: EventMap[K]) => void;


// Type for event map structure
export type EventMap = {
  fontLoadStart: { fonts: FontFace[] };
  fontLoadProgress: Prettify<FontLoadEvent>;
  fontLoadTimeout: Prettify<FontLoadEvent>;
  fontLoadError: Prettify<FontLoadEvent>;
  fontLoadComplete: Prettify<FontLoadEvent>;
  fontLoadFinished: Prettify<FontLoadSummary>;
  fontAdded: Prettify<FontLoadEvent>;
  fontResolved: Prettify<FontLoadEvent>;
}