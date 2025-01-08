# advanced-font-manager (WIP)

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

## Documentation

see [API documentation](https://docamz.github.io/advanced-font-manager/)
demo: comming soon

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
- [ ] Validations system
- [ ] Add Rules examples
- [ ] Add unit tests

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
