
import { EventEmitter } from 'events';
import { BaseLoader } from "./baseLoader";
import { FontLoadError } from '../types/errors';
import { ValidationRule } from '../types/validations';
import { DEFAULT_LOADER_OPTIONS } from './../defaults/loader.default';
import { FontLoaderEvents, FontLoaderOptions, loadFromBufferProps, loadFromFileProps, loadFromUrlProps } from "../types/loader";

/**
 * LOADER
 * @description The FontLoader class is responsible for loading font faces from various sources
 * @class FontLoader
 * @extends BaseLoader
 * @constructor FontLoader constructor options and rules for validation of font faces
 * @param {FontLoaderOptions} options
 * @param {ValidationRule[]} rules
 *
 *
 * @version 1.0.0
 *
 * @example const loader = new fontLoader({ debugLevel: 'info' })
 * @example loader.loadFromUrl({ fonts: [{ url: 'https://fonts.com/my-file.ttf', family: 'Roboto' }] })
 * @example loader.loadFromFile({ fonts: [{ file: file, family: 'Roboto' }] })
 * @example loader.loadFromBuffer({ fonts: [{ buffer: buffer, family: 'Roboto' }] })
 */
export class FontLoader extends BaseLoader {
  /**
   *  List of font faces to load
   * @type {FontFace[]}
   * @private
   * @memberof FontLoader
   */
  private fontFaces: FontFace[]

  /**
   *  List of font faces that have been loaded
   * @type {Set<string>}
   * @private
   * @memberof FontLoader
   * */
  private loadedFontFaces: Set<string>

  /**
   *  Options for the font loader
   * @type {FontLoaderOptions}
   * @private
   * @memberof FontLoader
   * */
  private options: FontLoaderOptions

  /**
   *  Event emitter for the font loader
   * @type {EventEmitter}
   * @private
   * @memberof FontLoader
   * */

  private eventEmitter: EventEmitter;



  constructor(options?: FontLoaderOptions, rules?: ValidationRule[]) {
    super(options?.debugLevel)
    this.fontFaces = []
    this.loadedFontFaces = new Set()
    this.options = options ? { ...options, ...DEFAULT_LOADER_OPTIONS } : DEFAULT_LOADER_OPTIONS
    this.eventEmitter = new EventEmitter();
  }

  public async loadFromUrl(args: loadFromUrlProps) {
    const { fonts, params } = args;
    fonts.forEach((font) => {
      const { url, family, options } = font;
      const fontFace = this.createFromUrl(family, url, options);
      if (fontFace) {
        this.fontFaces.push(fontFace);
      }
    });

    try {
      await this.load(this.fontFaces, params);
    } catch (error) {
      if(this.options.useResolvers) {
        console.error('should call resolver', error);
      } else {
        console.error('should not call resolver', error);
      }
    }
  }
  public async loadFromFile(args: loadFromFileProps) {
    const { fonts, params } = args
    fonts.forEach(async (font) => {
      const { file, family, options } = font;
      const fontFace = await this.createFromFile(file, family, options);
      if (fontFace) {
        this.fontFaces.push(fontFace);
      }
    });
    try {
      await this.load(this.fontFaces, params);
    } catch (error) {
      console.error(error);
    }
  }
  public async loadFromBuffer(args: loadFromBufferProps) {
    const { fonts, params } = args
    fonts.forEach((font) => {
      const { buffer, family, options } = font;
      const fontFace = this.createFromBuffer(buffer, family, options);
      if (fontFace) {
        this.fontFaces.push(fontFace);
      }
    });

    try {
      await this.load(this.fontFaces, params);
    } catch (error) {
      if(this.options.useResolvers) {
        console.error('should call resolver', error);
      } else {
        console.error('should not call resolver', error);
      }
    }
  }

  public on(event: FontLoaderEvents, listener: (...args: any[]) => void ) {}
  public off(event: FontLoaderEvents, listener: (...args: any[]) => void ) {}


  /**
   * Get the list of font faces
   * @returns {FontFace[]}
   */
  public getFontFaces(): FontFace[] {
    return this.fontFaces;
  }

  /**
   * Get the list of loaded font faces
   * @returns {Set<string>}
   */
  public getLoadedFontFaces(): Set<string> {
    return this.loadedFontFaces;
  }
  /**
   * Get the list of successfully parsed font faces
   * @returns {FontFace[]}
   */
  public getParsedFontFaces(): MapIterator<string> {
    return this.parsedFontFaces.keys();
  }

  /**
   * Get the list of failed font faces
   * @returns {FontFace[]}
   */
  public getFailedFontFaces(): FontFace[] {
    return this.fontFaces.filter((fontFace) => this.isErrored(fontFace.family));
  }

  /**
   * Get the list of font face errors for a given family
   * @param {string} family
   * @returns {FontLoadError}
   */
  public getFontFaceErrors(family: string): FontLoadError | null {
    return this.errorHandler.getError(family) || null;
  }

  public isLoaded(family: string) {
    return this.loadedFontFaces.has(family);
  }
  public isParsed(family: string) {
    return this.hasBeenParsed(family);
  }
  public isErrored(family: string) {
    return this.errorHandler.hasError(family);
  }

  public unloadFontFaces() {
    this.fontFaces.forEach((fontFace) => {
      this.unload(fontFace.family);
    })
  }

  public unloadFontFace(family: string) {
    this.unload(family);
  }
  public unloadFontFaceByURL(url: string) {
    this.unload(url);
  }
  /**
   * Unload a font face by file (TODO: Implement)
   * @param file
   * @deprecated
   */
  public unloadFontFaceByFile(file: File) {}

  /**
   * Unload a font face by buffer (TODO: Implement)
   * @param buffer
   * @deprecated
   */
  public unloadFontFaceByBuffer(buffer: ArrayBuffer) {}

  public parseFontFace(family: string) {
    this.parse(family);
  }

  public getFontFaceData(family: string): opentype.Font | null {
    return this.getFont(family);
  }

  public destroy() {}

}