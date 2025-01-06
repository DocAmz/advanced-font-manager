# Advanced Font Manager Documentation

A TypeScript library for robust web font management with support for multiple loading methods, validation, and error handling.

## Quick Start

```typescript
import { FontLoader } from 'advanced-font-manager';

const loader = new FontLoader({ debugLevel: 'info' });

// Load a font from URL
await loader.loadFromUrl({
  fonts: [{ url: 'https://fonts.com/roboto.ttf', family: 'Roboto' }]
});
```

## Installation

```bash
npm install advanced-font-manager
# or
yarn add advanced-font-manager
```

## Core Concepts

The `FontLoader` class manages the complete lifecycle of web fonts:

- Loading from multiple sources (URL, File, Buffer)
- Validation and error handling
- Event-driven status updates
- Memory management and cleanup

## Loading Methods

### URL Loading

```typescript
await loader.loadFromUrl({
  fonts: [{
    url: string,
    family: string,
    options?: FontFaceDescriptors
  }],
  params?: LoaderParams
});
```

### File Loading

```typescript
await loader.loadFromFile({
  fonts: [{
    file: File,
    family: string,
    options?: FontFaceDescriptors
  }],
  params?: LoaderParams
});
```

### Buffer Loading

```typescript
await loader.loadFromBuffer({
  fonts: [{
    buffer: ArrayBuffer,
    family: string,
    options?: FontFaceDescriptors
  }],
  params?: LoaderParams
});
```

## Configuration

```typescript
interface FontLoaderOptions {
  debugLevel?: 'error' | 'warn' | 'info' | 'debug';
  useResolvers?: boolean;
  // Additional options inherited from DEFAULT_LOADER_OPTIONS
}
```

## Event System

```typescript
// Subscribe to events
loader.on('fontLoaded', (family: string) => {});
loader.on('fontError', (family: string, error: FontLoadError) => {});
loader.on('fontParsed', (family: string) => {});

// Unsubscribe
loader.off('fontLoaded', listener);
```

## Status Methods

```typescript
// Check font status
loader.isLoaded(family: string): boolean
loader.isParsed(family: string): boolean
loader.isErrored(family: string): boolean

// Get font information
loader.getFontFaces(): FontFace[]
loader.getLoadedFontFaces(): Set<string>
loader.getFailedFontFaces(): FontFace[]
loader.getFontFaceErrors(family: string): FontLoadError | null
```

## Cleanup Methods

```typescript
// Unload specific fonts
loader.unloadFontFace(family: string)
loader.unloadFontFaceByURL(url: string)

// Unload all fonts
loader.unloadFontFaces()

// Complete cleanup
loader.destroy()
```

## Error Handling

```typescript
try {
  await loader.loadFromUrl({
    fonts: [{ url: 'https://fonts.com/roboto.ttf', family: 'Roboto' }]
  });
} catch (error) {
  if (error instanceof FontLoadError) {
    console.error(`Failed to load font: ${error.message}`);
  }
}
```

## Best Practices

1. Always provide a font family name
2. Handle loading errors appropriately
3. Clean up unused fonts to prevent memory leaks
4. Use event listeners for complex loading scenarios
5. Set appropriate debug levels for your environment

## TypeScript Support

The library includes full TypeScript definitions. Key types:

```typescript
type FontLoaderEvents = 'fontLoaded' | 'fontError' | 'fontParsed';

interface ValidationRule {
  // Add your validation rules
}

interface FontLoadError {
  message: string;
  code: string;
}
```
