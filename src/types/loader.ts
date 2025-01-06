// Type definitions for fontLoader
// Project: advanced-font-loader

import { fontFacesOptions } from "./fonts";

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
      options?: fontFacesOptions;
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

export type FontLoaderEvents =
  | "fontLoadError"
  | "fontLoadProgress"
  | "fontLoadComplete"
  | "fontLoadStart"
  | "fontAdded"
  | "fontRemoved"
  | "fontParsed"
  | "fontLoadTimeout"
  | "fontLoadNetworkError"
  | "fontLoadFormatError"
  | "fontLoadSecurityError"
  | "fontLoadValidationError"
  | "fontLoadDOMException"
  | "fontLoadUnknownError"
  | "fontLoadSuccess"
  | "fontLoadWarning"
  | "fontLoadInfo"
  | "fontLoadDebug"
  | "fontLoadCacheHit"
  | "fontLoadCacheMiss"
  | "fontLoadCacheAdd"
  | "fontLoadCacheRemove"
  | "fontLoadCacheClear"
  | "fontLoadCacheHitError"
  | "fontLoadCacheMissError"
  | "fontLoadCacheAddError"
  | "fontLoadCacheRemoveError"
  | "fontLoadCacheClearError"
  | "fontLoadCacheHitWarning"
  | "fontLoadCacheMissWarning"
  | "fontLoadCacheAddWarning"
  | "fontLoadCacheRemoveWarning"
  | "fontLoadCacheClearWarning"
  | "fontLoadCacheHitInfo"
  | "fontLoadCacheMissInfo"
  | "fontLoadCacheAddInfo"
  | "fontLoadCacheRemoveInfo"
  | "fontLoadCacheClearInfo"
  | "fontLoadCacheHitDebug"
  | "fontLoadCacheMissDebug"
  | "fontLoadCacheAddDebug"
  | "fontLoadCacheRemoveDebug"
  | "fontLoadCacheClearDebug"
  | "fontLoadCacheHitSuccess"
  | "fontLoadCacheMissSuccess"
  | "fontLoadCacheAddSuccess"
  | "fontLoadCacheRemoveSuccess"
  | "fontLoadCacheClearSuccess"
  | "fontLoadCacheHitComplete"
  | "fontLoadCacheMissComplete"
  | "fontLoadCacheAddComplete"
  | "fontLoadCacheRemoveComplete"
  | "fontLoadCacheClearComplete"
  | "fontLoadCacheHitStart"
  | "fontLoadCacheMissStart"
  | "fontLoadCacheAddStart"
  | "fontLoadCacheRemoveStart"
  | "fontLoadCacheClearStart"
  | "fontLoadCacheHitProgress"
  | "fontLoadCacheMissProgress"
  | "fontLoadCacheAddProgress"
  | "fontLoadCacheRemoveProgress"
  | "fontLoadCacheClearProgress"
  | "fontLoadCacheHitTimeout"
  | "fontLoadCacheMissTimeout"
  | "fontLoadCacheAddTimeout"
  | "fontLoadCacheRemoveTimeout"
  | "fontLoadCacheClearTimeout"
  | "fontLoadCacheHitNetworkError"
  | "fontLoadCacheMissNetworkError"
  | "fontLoadCacheAddNetwork";
