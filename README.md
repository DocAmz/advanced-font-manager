# advanced-font-manager

A TypeScript library for managing web font loading with support for multiple sources, validation, and error handling.
Initially developed to solve canvas rendering issues with custom fonts in React applications, this library provides a simple API for loading fonts from URLs, files, or buffer data. It also includes built-in validation and error handling, event-driven architecture, and font face lifecycle management. Environment-agnostic and easy to integrate with any web application. (resolver is an experimental feature, use with caution and report any issues)

Based on the [FontFace API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) and [FontFaceSet API](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet).
Uses [opentype.js](https://opentype.js.org/) for parsing font files.

## Installation

```bash
npm install advanced-font-manager
```

## Features

- Load fonts from URLs, files, or buffer data
- Built-in validation and error handling
- Event-driven architecture
- TypeScript support
- Configurable debug levels
- Font face lifecycle management

## Usage

```typescript
import { FontLoader } from 'advanced-font-manager';

// Initialize with options
const loader = new FontLoader({
  debugLevel: 'info',
  useResolvers: true
});

// Load fonts from URL
await loader.loadFromUrl({
  fonts: [{
    url: 'https://fonts.com/roboto.ttf',
    family: 'Roboto'
  }]
});

// Load from file
await loader.loadFromFile({
  fonts: [{
    file: fontFile,
    family: 'OpenSans'
  }]
});

// Load from buffer
await loader.loadFromBuffer({
  fonts: [{
    buffer: fontBuffer,
    family: 'Lato'
  }]
});
```

## API Reference

### FontLoader

#### Constructor

```typescript
new FontLoader(options?: FontLoaderOptions, rules?: ValidationRule[])
```

#### Methods

- `loadFromUrl({ fonts, params }): Promise<void>`
- `loadFromFile({ fonts, params }): Promise<void>`
- `loadFromBuffer({ fonts, params }): Promise<void>`
- `getFontFaces(): FontFace[]`
- `getLoadedFontFaces(): Set<string>`
- `getFailedFontFaces(): FontFace[]`
- `getFontFaceErrors(family: string): FontLoadError | null`
- `isLoaded(family: string): boolean`
- `isParsed(family: string): boolean`
- `isErrored(family: string): boolean`
- `unloadFontFaces(): void`
- `unloadFontFace(family: string): void`
- `unloadFontFaceByURL(url: string): void`

### Events

Use `on()` and `off()` to subscribe/unsubscribe to font loading events:

```typescript
loader.on('fontLoaded', (family) => {
  console.log(`Font ${family} loaded successfully`);
});
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
