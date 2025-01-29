export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'reset';

export interface LoggerOptions {
    minLevel:   LogLevel;
    prefix?:    string;
    timestamp?: boolean;
    colors?:    boolean;
}

export class Logger {
  private config: LoggerOptions;
  private readonly colors: Record<LogLevel, string> = {
    info:   '\x1b[32m',
    warn:   '\x1b[33m',
    error:  '\x1b[31m',
    debug:  '\x1b[36m',
    reset:  '\x1b[0m'
  }

  constructor(config: LoggerOptions) {
    this.config = {
      timestamp: true,
      colors: true,
      ...config
    }
  }

  private getTimestamp(): string {
    if (!this.config.timestamp) return '';
    return `[${new Date().toISOString()}]`;
  }

  private getPrefix(): string {
    if (!this.config.prefix) return '';
    return `[${this.config.prefix}]`;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp   = this.getTimestamp();
    const prefix      = this.getPrefix();
    const levelStr    = `[${level.toUpperCase()}]`;

    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return arg;
    }).join(' ');

    if(this.config.colors) {
      return `${timestamp} ${prefix} ${this.colors[level]}${levelStr} ${message}${this.colors.reset} ${formattedArgs}`;
    }

    return `${timestamp} ${prefix} ${levelStr} ${message} ${formattedArgs}`;
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    const levels: LogLevel[] = ['info', 'warn', 'error', 'debug'];
    return levels.indexOf(messageLevel) >= levels.indexOf(this.config.minLevel);
  }

  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('debug')) return;
    console.debug(this.formatMessage('debug', message), ...args);
  }

  info(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    console.info(this.formatMessage('info', message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog('warn')) return;
    console.warn(this.formatMessage('warn', message), ...args);
  }

  error(message: string, ...args: any[]): void {
    if (!this.shouldLog('error')) return;
    console.error(this.formatMessage('error', message), ...args);
  }

}
