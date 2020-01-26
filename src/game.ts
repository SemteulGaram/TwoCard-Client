import PX from './pixijs-wrapper'
import { Logger, LoggerInterface } from './utils/logger'
import { isDev } from './utils/misc'
import { StageBase } from './internals'
import StageIndex from './stage/stage-index'

Logger.consoleLogLevel = isDev ? Logger.Level.VERBOSE : Logger.Level.INFO

export class Game {
  log: LoggerInterface
  renderer: PIXI.Renderer
  ticker: PIXI.Ticker
  loader: PIXI.Loader
  currentStageName: keyof(Game['stages'])
  stages: {
    index: StageIndex
  }

  _lastTickAt: number

  constructor () {
    this.log = Logger.createLogger('Game')
    this.log.v('constructor> enter')
    const rendererOptions = {
      view: document.querySelector('#game') as HTMLCanvasElement,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    }
    this.renderer = new PX.Renderer(rendererOptions)
    this._lastTickAt = Date.now()
    this.ticker = new PX.Ticker()
    this.loader = PX.loader
    this.currentStageName = 'index'
    this.log.v('constructor> leave')
  }

  get stage (): StageBase {
    return this.stages[this.currentStageName]
  }

  async init () {
    this.log.v('init> enter')
    PX.say('Project: Not only onecard')

    //this.keyboardHandler = new KeyboardHandler(window)

    await this.addStage('index', StageIndex)
    //await this.addStage('play', StagePlay)

    this.changeStage('index')

    this._windowEventRegistration()

    this._onResizeHandle()

    this.ticker.add(this._animationTick.bind(this))
    this.log.v('init> leave')
  }

  async addStage (name: string, stageConstructor: typeof StageBase) {
    this.log.d('addStage>', name)
    if (this.stages[name]) {
      this.log.e('addStage> Stage duplicated:', name)
      throw new Error('이미 존재하는 스테이지입니다: ' + name)
    }

    this.stages[name] = new stageConstructor(this, name)
    return this.stages[name].init()
  }

  changeStage (name: keyof(Game['stages'])) {
    this.log.i('changeStage>', name)
    if (!this.stages[name]) {
      this.log.e('changeStage> Stage not exists:', name)
      throw new Error('존재하지 않는 스테이지입니다: ' + name)
    }
    if (this.stages[this.currentStageName]) {
      this.stage.onDisattach()
    }
    this.currentStageName = name
    this.stage.onAttach()
  }


  _windowEventRegistration (): void {
    window.addEventListener('resize', this._onResizeHandle.bind(this))
  }

  _animationTick (): void {
    console.log('TODO: context check', this)
    this.ticker.stop()
    if (this.stage) {
      const time = Date.now()
      this.stage.onTick(time - this._lastTickAt, time)
      this._lastTickAt = time
    }
  }

  _onResizeHandle () {
    if (this.stage) {
      this.stage.onResize()
      // force refresh tick
      this._animationTick()
    }
  }
}
