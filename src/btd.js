import PX from './pixijs-wrapper.js'
import * as Utils from './util/misc.js'
import { globalLogger as log } from './util/logger.js'
import KeyboardHandler from './enviroment/keyboard-handler.js'

import StageIndex from './stage/stage-index.js'
import StagePlay from './stage/stage-play.js'

class Btd {
  constructor () {
    log.i('Btd instance created')
    this.pixi = null
    this.stages = {}
    this.currentStageName = null
    this._currentStageCache = null
    this.keyboardHandler = null
  }

  get stage () {
    return this.stages[this.currentStageName]
  }

  async init () {
    log.d('Btd instance initializing...')
    PX.say('Project: Beyond the dark')
    this.pixi = new PX.Application({
      backgroundColor: 0x000000,
      width: 960,
      height: 540,
      antialias: true,
      transparent: false,
      resolution: 1,
      autoResize: true
    })

    this.keyboardHandler = new KeyboardHandler(window)

    await this.addStage('index', StageIndex)
    await this.addStage('play', StagePlay)

    this.changeStage('index')

    document.body.appendChild(this.pixi.view)

    window.addEventListener('resize', this.onResize.bind(this))

    this.onResize()

    this.pixi.ticker.add(this.onTick.bind(this))
    log.i('Btd instance initialized')
  }

  async addStage (name, stageConstructor) {
    log.d('Btd.addStage:', name)
    if (this.stages[name]) {
      log.e('Btd.addStage>stage duplicated:', name)
      throw new Error('이미 존재하는 스테이지입니다: ' + name)
    }

    this.stages[name] = new stageConstructor(this)
    return this.stages[name].init()
  }

  changeStage (name) {
    log.i('Btd.changeStage:', name)
    if (!this.stages[name]) {
      log.e('Btd.changeStage>not exists:', name)
      throw new Error('존재하지 않는 스테이지입니다: ' + name)
    }
    if (this.stages[this.currentStageName]) {
      this.stage.onDisattach()
    }
    this.currentStageName = name

    this._currentStageCache = this.stage
    this.stage.onAttach()
  }

  onTick (delta) {
    this._currentStageCache && this._currentStageCache.onTick(delta)
  }

  onResize () {
    log.v('Btd.onResize')
    this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
    this._currentStageCache && this._currentStageCache.onResize()
  }
}

const app = new Btd()

if (Utils.isDev()) {
  log.w('Main: development mode enabled')
  window.app = app
  log.useVerbose = true
}

app.init().catch(console.error)
