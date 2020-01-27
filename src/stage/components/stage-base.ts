import PX from '../../pixijs-wrapper'
import { LayerWrapper, LayerWrapperOptions } from './layer-wrapper'
import { Logger, LoggerInterface } from '../../utils/logger'
import * as Utils from '../../utils/misc'
import { Game } from '../../internals'

export class StageBase {
  name: string
  ctx: Game
  uid: string
  log: LoggerInterface
  unit: any;
  stage: PIXI.Container;
  layers: PIXI.Container[];

  constructor (ctx: Game, name: string) {
    this.name = name
    this.uid = (this.constructor.name || 'UnknownStage') + '#' + Utils.shortUuid(3)
    this.log = Logger.createLogger(this.uid)

    this.ctx = ctx
    this.stage = new PX.Container()
    //this.stage.group.enableSort = true
    this.unit = {}
    this.layers = []
    this._unitRecalculate()
  }

  _unitRecalculate () {
    this.log.d('_unitRecalculate> pixel unit recalculate')
    this.unit.width = this.ctx.renderer.width
    this.unit.height = this.ctx.renderer.height
    this.unit.vw = this.unit.width/100
    this.unit.vh = this.unit.height/100
    this.unit.isVertical = this.unit.width < this.unit.height
    this.unit.mu = this.unit.isVertical ? this.unit.vw : this.unit.vh
    this.unit.Mu = this.unit.isVertical ? this.unit.vh : this.unit.vw
  }

  // Override this method
  async init () {
    throw new Error('Implement this methods')
  }

  // Override this method
  onAttach () {
    throw new Error('Implement this methods')
  }

  // Override this method
  onDisattach () {
    throw new Error('Implement this methods')
  }

  // Override this method
  onTick (delta: number, time: number) {
    throw new Error('Implement this methods')
  }

  // Override this method
  onResize () {
    this._unitRecalculate()
  }

  addLayer (name: string, options: LayerWrapperOptions) {
    //if (this.layers[name]) {
    //  throw new Error('addLayer> duplicated layer name(' + name + ')')
    //}
    //this.layers[name] = new LayerWrapper(name, options)
    //this.stage.addChild(this.layers[name].layer)
    this.layers[name] = new PX.Container()
  }
}
