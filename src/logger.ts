import util from 'util'
import chalk from 'chalk'

export interface ILogger {
  verbose: (...any: any[]) => void;
  debug: (...any: any[]) => void;
  info: (...any: any[]) => void;
  warn: (...any: any[]) => void;
  error: (...any: any[]) => void;
  v: (...any: any[]) => void;
  d: (...any: any[]) => void;
  i: (...any: any[]) => void;
  w: (...any: any[]) => void;
  e: (...any: any[]) => void;
}

export const LogLevel = {
  VERBOSE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4
}

export const LogLevelReverse = Object.keys(LogLevel)

export const LogLevelFunction = [
  console.debug.bind(console),
  console.debug.bind(console),
  console.info.bind(console),
  console.warn.bind(console),
  console.error.bind(console),
]

export const LogLevelColor = [
  'gray',
  'gray',
  'white',
  'yellow',
  'red'
]

export class Logger {
  static LogLevel = LogLevel
  static LogLevelReverse = LogLevelReverse
  static LogLevelColor = LogLevelColor

  static consoleLogLevel = LogLevel.DEBUG

  static createLogger (tag: string): ILogger {
    return {
      verbose: (...args: any[]) => { this._base(LogLevel.VERBOSE, tag, args) },
      debug: (...args: any[]) => { this._base(LogLevel.DEBUG, tag, args) },
      info: (...args: any[]) => { this._base(LogLevel.INFO, tag, args) },
      warn: (...args: any[]) => { this._base(LogLevel.WARN, tag, args) },
      error: (...args: any[]) => { this._base(LogLevel.ERROR, tag, args) },
      v: (...args: any[]) => { this._base(LogLevel.VERBOSE, tag, args) },
      d: (...args: any[]) => { this._base(LogLevel.DEBUG, tag, args) },
      i: (...args: any[]) => { this._base(LogLevel.INFO, tag, args) },
      w: (...args: any[]) => { this._base(LogLevel.WARN, tag, args) },
      e: (...args: any[]) => { this._base(LogLevel.ERROR, tag, args) }
    };
  }

  static _base (level: number, tag: string, args: any[]) {
    if (level >= this.consoleLogLevel) {
      LogLevelFunction[level](chalk.cyan(this.buildTimeString() + '>')
        + chalk.green(tag + '>') + chalk[LogLevelColor[level]](
          LogLevelReverse[level] + '> ' + args.map(v => {
            return (typeof v === 'object' && v !== null) ? util.inspect(v) : v
          }).join(' ')
        )
      )
    }
  }

  static buildTimeString() {
    const date = new Date()
    return date.getHours().toString().padStart(2, '0') + ':'
      + date.getMinutes().toString().padStart(2, '0') + ':'
      + date.getSeconds().toString().padStart(2, '0') + '.'
      + date.getMilliseconds().toString().padStart(4, '0')
  }
}
