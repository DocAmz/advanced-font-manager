import { fontResolver } from './../resolver/fontResolver';
import * as op from "opentype.js";
import { UrlWithStringQuery } from "node:url";
import { FontErrorHandler } from "../errors/FontErrorHandler";
import { normalizeFontFaceDescriptors } from "../mixins/normalize.mixin";
import { sanitizeFamilyName, sanitizeUrl } from "../mixins/sanitize.mixin";
import { fontFacesOptions } from "../types/fonts";
import { FontLoaderEvents, loadParameters } from "../types/loader";
import { Logger, LogLevel } from "../utils/logger";
import { EventEmitter } from "../services/eventService";
import { ValidationRule } from '../types/validations';

export class BaseLoader {
    private eventEmitter: EventEmitter;
    private originalBuffers: Map<string, ArrayBuffer>;
    private logger: Logger;
    private loadedFontFacesList: Set<string>;
    private fontResolver: fontResolver;

    /**
     *  List of font faces that have been parsed
     * @type {Map<string, op.Font>}
     * @private
     * @memberof FontLoader
     * */
    parsedFontFaces: Map<string, op.Font>;
    errorHandler: FontErrorHandler;

    constructor(debugLevel?: LogLevel) {
        this.originalBuffers = new Map();
        this.parsedFontFaces = new Map();
        this.loadedFontFacesList = new Set();
        this.errorHandler = new FontErrorHandler();
        this.fontResolver = new fontResolver();
        this.logger = new Logger({
        minLevel: debugLevel || "info",
        prefix: "Loader",
        timestamp: true,
        colors: true,
        });
        this.eventEmitter = new EventEmitter();
    }

    async load(fontFaces: FontFace[], params?: loadParameters, resolve = true, rules?: ValidationRule[]): Promise<void> {

        // Check if fonts are provided
        if (!fontFaces?.length) {
            // Emit event and log
            this.eventEmitter.emit("fontLoadError", {
                family: 'noFamily',
                error: 'No fonts provided to load' as any,
            });
            this.logger.warn("No fonts provided to load, Exit");
            return;
        }

        // Emit start event
        this.eventEmitter.emit("fontLoadStart", { fonts: fontFaces });

        const loadResults = await Promise.allSettled(

        fontFaces.map(async (fontFace) => {
            try {


            this.eventEmitter.emit("fontLoadProgress", {
                family: fontFace.family,
                status: "loading",
            });

            this.logger.info(`Loading font: ${fontFace.family}`);
            if(document.fonts.has(fontFace)) {
                this.logger.info(`Font already loaded: ${fontFace.family}, exiting early`);
                return;
            }


            // Load font with timeout
            const loadedFont = await Promise.race([
                fontFace.load(),
                new Promise<never>((_, reject) => {
                setTimeout(() => {
                    const timeoutError = new Error(
                    `Font loading timeout: ${fontFace.family}`
                    );
                    this.eventEmitter.emit("fontLoadTimeout", {
                    family: fontFace.family,
                    error: timeoutError,
                    });
                    this.errorHandler.addFailedFont(
                    fontFace.family,
                    timeoutError.message
                    );
                    reject(timeoutError);
                }, params?.timeOut || 5000);
                }),
            ]);


            // Try to add font to document
            try {
                document.fonts.add(loadedFont);
                this.eventEmitter.emit("fontAdded", {
                family: fontFace.family,
                font: loadedFont,
                });
                this.loadedFontFacesList.add(fontFace.family);

            } catch (error) {
                const addError = new Error(`Failed to add font to document: ${fontFace.family}`);
                if(resolve) {
                    this.logger.error(`Failed to load font: ${fontFace.family}, resolver called, ${addError.message}`);
                } else {
                    this.logger.error(addError.message);
                    this.errorHandler.addFailedFont(fontFace.family, addError.message);
                    throw addError;
                }
            }
            this.logger.info(`Font loaded successfully: ${fontFace.family}`);
            this.eventEmitter.emit("fontLoadComplete", {
                family: fontFace.family,
                font: loadedFont,
                status: "success",
            });

            return loadedFont;

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                // font resolver here *********
                //if(resolve) {
                    this.logger.error(`Failed to load font: ${fontFace.family}, ${errorMessage}, resolver called`);
                    this.logger.info(`Resolving font: ${fontFace.family}`, this.originalBuffers);

                    this.logger.info("Checking originalBuffers keys:", [...this.originalBuffers.keys()]);
                    this.logger.info("Attempting to retrieve buffer for:", fontFace.family);

                    const buffer = this.originalBuffers.get(fontFace.family);
                    if (!buffer) {
                        this.logger.error(`Buffer not found for family: ${fontFace.family}`);
                    } else {
                        this.logger.info(`Retrieved buffer for ${fontFace.family}`, buffer);
                    }

                    if(!buffer) {
                        this.logger.error(`Failed to resolve font: ${fontFace.family}, buffer not found`);
                        this.errorHandler.addFailedFont(fontFace.family, "Buffer not found");
                        this.eventEmitter.emit("fontLoadError", {
                            family: fontFace.family,
                            error: new Error("Buffer not found"),
                        });
                        return;
                    }

                    await this.fontResolver.resolveFont(buffer, error, rules ? rules : []).then(async (result) => {
                        this.logger.info(`Font resolved: ${fontFace.family}`, result);
                        if(result.success) {
                            this.logger.info(`Font resolved successfully: ${fontFace.family}`);
                            const font =  result.font ? new FontFace(fontFace.family, result.font) : null;
                            this.eventEmitter.emit("fontResolved", {
                                family: fontFace.family,
                                status: "resolved",
                            });
                            if(!font) return // better handling here ********
                            try {
                                await this.load([font], params, false)
                            } catch (error) {
                                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                                this.logger.error(`Failed to load resolved font: ${fontFace.family}, ${errorMessage}`);
                                this.errorHandler.addFailedFont(fontFace.family, errorMessage);
                                this.eventEmitter.emit("fontLoadError", {
                                    family: fontFace.family,
                                    error: errorMessage as any,
                                });
                            }
                        } else {
                            this.logger.error(`Failed to resolve font: ${fontFace.family}, ${result.message}`);
                            this.errorHandler.addFailedFont(fontFace.family, result.message);
                            this.eventEmitter.emit("fontLoadError", {
                                family: fontFace.family,
                                error: new Error(result.message),
                            });
                        }
                    });
                //} else {
                //    this.logger.error(`Font loading failed: ${fontFace.family} - ${errorMessage}`);
                //    this.errorHandler.addFailedFont(fontFace.family, errorMessage);
                //    this.eventEmitter.emit("fontLoadError", {
                //        family: fontFace.family,
                //        error: error instanceof Error ? error : new Error(errorMessage),
                //    });
                //}
            }
        })
        );

        // Process results [success]
        const successfulLoads = loadResults.filter(
            (result): result is PromiseFulfilledResult<FontFace> =>
                result.status === "fulfilled"
            );
        // Process results [failures]
        const failedLoads = loadResults.filter(
            (result): result is PromiseRejectedResult => result.status === "rejected"
        );

        // Emit final status
        this.eventEmitter.emit("fontLoadFinished", {
            total: fontFaces.length,
            succeeded: successfulLoads.length,
            failed: failedLoads.length,
            failedFamilies: failedLoads.map((result) => {
                const error = result.reason;
                return error instanceof Error ? error.message : "Unknown error";
            }),
        });

        if (failedLoads.length > 0) {
            this.logger.warn(`Font loading completed with ${failedLoads.length} failures`);
        } else {
            this.logger.info("All fonts loaded successfully");
        }
    }

    unload(font: string) {
        if (this.loadedFontFacesList.has(font)) {
            this.loadedFontFacesList.delete(font);
            this.logger.info(`Font removed from loader: ${font}`);
        } else {
            this.logger.error(`Failed to remove font: ${font}`);
        }
    }

    createFromUrl(
        family: string,
        url: string,
        options?: fontFacesOptions
    ): FontFace | null {
        try {
        let fontUrl, fontFamily, fontDescriptors;

        fontUrl = sanitizeUrl(url);

        if (!fontUrl) {
            this.errorHandler.addFailedFont(family, "Invalid URL");
            return null;
        }

        fontFamily = sanitizeFamilyName(family);

        if (!fontFamily) {
            this.errorHandler.addFailedFont(family, "Invalid Family");
            return null;
        }

        if (options) {
            fontDescriptors = normalizeFontFaceDescriptors(
            options as Partial<FontFaceDescriptors>
            ) as Partial<FontFaceDescriptors>;
            if (!fontDescriptors) {
            fontDescriptors = {};
            }
        }

        const fontFace = new FontFace(
            fontFamily,
            `url(${fontUrl})`,
            fontDescriptors
        );

        this.setOriginalBuffer(family, fontUrl);

        return fontFace;
        } catch (error) {
        this.errorHandler.addFailedFont(family, error);
        return null;
        }
    }

    async createFromFile(
        file: File,
        family: string,
        options?: fontFacesOptions
    ): Promise<FontFace | null> {
        const buffer = await file.arrayBuffer();
        const fontFace = await this.createFromBuffer(buffer, family, options);
        return fontFace;
    }

    async createFromBuffer(
        buffer: ArrayBuffer,
        family: string,
        options?: fontFacesOptions
    ): Promise<FontFace | null> {
        try {

        let fontBuffer, fontFamily, fontDescriptors;

        fontBuffer = buffer;

        if (!buffer) {
            this.errorHandler.addFailedFont(family, "Invalid Buffer");
            return null;
        }
        fontFamily = sanitizeFamilyName(family);
        if (!fontFamily) {
            this.errorHandler.addFailedFont(family, "Invalid Family");
            return null;
        }
        if (options) {
            fontDescriptors = normalizeFontFaceDescriptors(
            options as Partial<FontFaceDescriptors>
            ) as Partial<FontFaceDescriptors>;
            if (!fontDescriptors) {
            fontDescriptors = {};
            }
        }
        const font = op.parse(buffer);
        if (!font) throw new Error('Invalid font data in ArrayBuffer');

        const fontFace = new FontFace(fontFamily, fontBuffer, fontDescriptors);

        try {
            await this.setOriginalBuffer(family, buffer);
        } catch (error) {
            this.logger.error(`Failed to set buffer for family: ${family}`);
            this.errorHandler.addFailedFont(family, error);
        } finally {
            this.logger.info(`Buffer set successfully for family: ${family}`);
            return fontFace;
        }
        } catch (error: any) {
        this.logger.error(`Failed to parse font buffer for family ${family}: ${error.message}`);
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
        if (!arrayBuffer) {
            this.logger.error(`Failed to parse font: ${family}`);
            return;
        }
        const font = op.parse(arrayBuffer);
        this.parsedFontFaces.set(family, font);
        this.logger.info(`Font parsed : ${family}`);
        } catch (error) {
        this.logger.error(`Failed to parse fonts: ${error}`);
        }
    }

    async setOriginalBuffer(familyName: string, font: string | ArrayBuffer) {
        try {
            let buffer;
            if (typeof font === "string") {
                this.logger.info(`Fetching buffer for family: ${familyName} from URL: ${font}`);
                const response = await fetch(font);
                buffer = await response.arrayBuffer();
            } else {
                this.logger.info(`Setting buffer for family: ${familyName} from provided ArrayBuffer`);
                buffer = font;
            }

            this.originalBuffers.set(familyName, buffer);
            this.logger.info(`Buffer set successfully for family: ${familyName}`);
        } catch (error: any) {
            this.logger.error(`Failed to set buffer for family: ${familyName}, Error: ${error.message}`);
        }
    }

    hasBeenParsed(family: string): boolean {
        return this.parsedFontFaces.has(family);
    }

    getFont(family: string): op.Font | null {
        return this.parsedFontFaces.get(family) || null;
    }

    on<K extends keyof FontLoaderEvents>(
        eventName: K,
        handler: (data: FontLoaderEvents[K]) => void
    ): void {
        this.eventEmitter.on(eventName, handler);
    }

    off<K extends keyof FontLoaderEvents>(
        eventName: K,
        handler: (data: FontLoaderEvents[K]) => void
    ): void {
        this.eventEmitter.off(eventName, handler);
    }

}
