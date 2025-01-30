# Advanced font manager (WIP)

![NPM Version](https://img.shields.io/npm/v/advanced-font-manager)
![NPM Downloads](https://img.shields.io/npm/d18m/advanced-font-manager)
![NPM Last Update](https://img.shields.io/npm/last-update/advanced-font-manager)

A TypeScript library for managing web font loading with support for multiple sources, validation, and error handling.
Initially developed to solve canvas rendering issues with custom fonts in React applications, this library provides a simple API for loading fonts from URLs, files, or buffer data. It also includes built-in validation and error handling, event-driven architecture, and font face lifecycle management. Environment-agnostic and easy to integrate with any web application. (resolver is an experimental feature, use with caution and report any issues)

Based on the [FontFace API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) and [FontFaceSet API](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet).
Uses [opentype.js](https://opentype.js.org/) for parsing font files.

## Installation

```bash
npm install advanced-font-manager
```

## Documentation

1. see [API documentation](https://docamz.github.io/advanced-font-manager/)
2. demo: comming soon

## Features

- Load fonts from URLs, files, or buffer data
- Built-in validation and error handling
- Event-driven architecture
- TypeScript support
- Configurable debug levels
- Font face lifecycle management

## Todo

- [x] Working Loader
- [x] Font Face Lifecycle
- [x] Logging system (debug levels)
- [ ] getters for parsed fonts data
- [ ] WIP Error Handling system (basic error already implemented)
- [ ] Font Face Observer w/ Events
- [ ] Add new normalizer (family, weight, url, path)
- [ ] Add new sanitizer (path, style)
- [ ] WIP Font Resolver (#1)
- [ ] Caches system
- [ ] Validations system
- [ ] Add Rules examples
- [ ] Add unit tests

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
