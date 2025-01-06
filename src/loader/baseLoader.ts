import * as op from 'opentype.js';
import { UrlWithStringQuery } from "node:url";
import { FontErrorHandler } from "../errors/FontErrorHandler";
import { normalizeFontFaceDescriptors } from "../mixins/normalize.mixin";
import { sanitizeFamilyName, sanitizeUrl } from "../mixins/sanitize.mixin";
import { fontFacesOptions } from "../types/fonts";
import { loadParameters } from "../types/loader";
import { Logger, LogLevel } from "../utils/logger";

export class BaseLoader {

    private originalBuffers: Map<string, ArrayBuffer>;
    private logger: Logger;

    /**
    *  List of font faces that have been parsed
    * @type {Map<string, op.Font>}
    * @private
    * @memberof FontLoader
    * */
    parsedFontFaces: Map<string, op.Font>
    errorHandler: FontErrorHandler;


    constructor(debugLevel?: LogLevel) {
        this.originalBuffers = new Map();
        this.parsedFontFaces = new Map();
        this.errorHandler = new FontErrorHandler();
        this.logger = new Logger({
            minLevel: debugLevel || 'info',
            prefix: 'Loader',
            timestamp: true,
            colors: true
        });

    }

    async load(fontFaces: FontFace[], params?: loadParameters) {
        if(!fontFaces || !fontFaces.length) {
            return;
        }
        const promises = fontFaces.map(async (fontFace) => {
            const loadedFont = await Promise.race([
                fontFace.load(),
                new Promise((_, reject) =>
                    {
                        setTimeout(() => reject(new Error("Font loading timeout")), params?.timeOut || 5000)
                        this.logger.warn(`Font loading timeout: ${fontFace.family}`)
                    }
                )
            ]);

            try {
                (document as any).fonts.add(loadedFont);
            }
            catch (error) {
                this.logger.error(`Failed add font to the DOM: ${fontFace.family}`);
            }
        });

        try {
            await Promise.all(promises);
        } catch (error) {
            this.logger.error(`Failed to load fonts: ${error}`);
        }

        this.logger.info('Fonts loaded');
    }

    unload(font: string) {
        try {
            (document as any).fonts.delete(font);
        } catch (error) {
            this.logger.error(`Failed to remove font: ${font}`);
        }
    }

    createFromUrl(family: string, url: string, options?: fontFacesOptions): FontFace | null {

        try {

            let fontUrl, fontFamily, fontDescriptors;

            fontUrl = sanitizeUrl(url);

            if(!fontUrl) {
                this.errorHandler.addFailedFont(family, 'Invalid URL');
                return null;
            }

            fontFamily = sanitizeFamilyName(family);

            if(!fontFamily) {
                this.errorHandler.addFailedFont(family, 'Invalid Family');
                return null;
            }

            if(options) {
                fontDescriptors = normalizeFontFaceDescriptors(options as Partial<FontFaceDescriptors>) as Partial<FontFaceDescriptors>
                if(!fontDescriptors) {
                    fontDescriptors = {}
                }
            }

            const fontFace = new FontFace(
                fontFamily,
                `url(${fontUrl})`,
                fontDescriptors
            );

            this.setOriginalBuffer(family, fontUrl);

            return fontFace
        } catch (error) {

            this.errorHandler.addFailedFont(family, error);
            return null;
        }
    }

    async createFromFile(file: File, family: string, options?: fontFacesOptions): Promise<FontFace | null> {
        const buffer = await file.arrayBuffer();
        const fontFace = this.createFromBuffer(buffer, family, options);
        return fontFace;
    }

    createFromBuffer(buffer: ArrayBuffer, family: string, options?: fontFacesOptions): FontFace | null {
        try {

            let fontBuffer, fontFamily, fontDescriptors;
            fontBuffer = buffer
            if(!buffer) {
                this.errorHandler.addFailedFont(family, 'Invalid URL');
                return null;
            }
            fontFamily = sanitizeFamilyName(family);
            if(!fontFamily) {
                this.errorHandler.addFailedFont(family, 'Invalid Family');
                return null;
            }
            if(options) {
                fontDescriptors = normalizeFontFaceDescriptors(options as Partial<FontFaceDescriptors>) as Partial<FontFaceDescriptors>
                if(!fontDescriptors) {
                    fontDescriptors = {}
                }
            }
            const fontFace = new FontFace(
                fontFamily,
                fontBuffer,
                fontDescriptors
            );

            this.setOriginalBuffer(family, buffer);

            return fontFace
        } catch (error) {
            this.errorHandler.addFailedFont(family, error);
            return null;
        }
    }

    destroy() {
        this.originalBuffers.clear();
        this.parsedFontFaces.clear();
        this.errorHandler.destroy();
    }

    parse(family: string) {
        try {
            const arrayBuffer = this.originalBuffers.get(family);
            if(!arrayBuffer) {
                this.logger.error(`Failed to parse font: ${family}`);
                return;
            }
            const font = op.parse(arrayBuffer);
            this.parsedFontFaces.set(family, font);
            this.logger.info(`Font parsed : ${ family }`);
        } catch (error) {
            this.logger.error(`Failed to parse fonts: ${error}`);
        }
    }

    async setOriginalBuffer(familyName: string, font: string | ArrayBuffer) {
        if(typeof font === 'string') {
            const url = font;
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            this.originalBuffers.set(familyName, buffer);
        } else {
            this.originalBuffers.set(familyName, font);
        }
    }

    hasBeenParsed(family: string): boolean {
        return this.parsedFontFaces.has(family);
    }
}