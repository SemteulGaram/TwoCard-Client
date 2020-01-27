import inspect from 'object-inspect'

export const Level = {
  VERBOSE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};

export const ReverseLevel = Object.keys(Level);

export interface LoggerInterface {
  verbose (...args: any[]): void;
  debug (...args: any[]): void;
  info (...args: any[]): void;
  warn (...args: any[]): void;
  error (...args: any[]): void;
  v (...args: any[]): void;
  d (...args: any[]): void;
  i (...args: any[]): void;
  w (...args: any[]): void;
  e (...args: any[]): void;
}

export class Logger {
  static Level = Level;
  static ReverseLevel = ReverseLevel;
  static consoleLogLevel: number = Level.DEBUG;

  static createLogger (tag: string): LoggerInterface {
    const logger = {
      verbose: (...args: any[]) => { this._base(Level.VERBOSE, tag, args) },
      debug: (...args: any[]) => { this._base(Level.DEBUG, tag, args) },
      info: (...args: any[]) => { this._base(Level.INFO, tag, args) },
      warn: (...args: any[]) => { this._base(Level.WARN, tag, args) },
      error: (...args: any[]) => { this._base(Level.ERROR, tag, args) },
      v: (...args: any[]) => { this._base(Level.VERBOSE, tag, args) },
      d: (...args: any[]) => { this._base(Level.DEBUG, tag, args) },
      i: (...args: any[]) => { this._base(Level.INFO, tag, args) },
      w: (...args: any[]) => { this._base(Level.WARN, tag, args) },
      e: (...args: any[]) => { this._base(Level.ERROR, tag, args) },
    }

    return logger
  }

  static _base (type: number, tag: string, args: any[]): void {
    if (type >= this.consoleLogLevel) {
      console.log(this._buildTimeString() + '>' + tag + '>'
        + ReverseLevel[type] + '> ' + args.map(v => {
          return (typeof v === 'object' && v !== null) ? inspect(v) : v
        }).join(' ')
      )
    }
  }

  static _buildTimeString (): string {
    const date = new Date()
    return date.getHours().toString().padStart(2, '0') + ':'
      + date.getMinutes().toString().padStart(2, '0') + ':'
      + date.getSeconds().toString().padStart(2, '0') + '.'
      + date.getMilliseconds().toString().padStart(4, '0')
  }
}
