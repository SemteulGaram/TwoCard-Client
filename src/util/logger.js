class Logger {
  constructor () {
    this._useVerbose = false
  }

  get useVerbose () { return this._useVerbose }

  set useVerbose (v) {
    this.w('Logger.useVerbose: verbose mode activated.')
    this._useVerbose = v
  }

  v () { if (this._useVerbose) console.debug.apply(console, arguments) }
  d () { console.debug.apply(console, arguments) }
  i () { console.info.apply(console, arguments) }
  w () { console.warn.apply(console, arguments) }
  e () { console.error.apply(console, arguments) }
}

const globalLogger = new Logger()

export {
  Logger,
  globalLogger
}
