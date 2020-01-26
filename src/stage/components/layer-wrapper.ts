import PX from '../../pixijs-wrapper.js'
import { shortUuid } from '../../utils/misc'
import { Logger, LoggerInterface } from '../../utils/logger'

export interface LayerWrapperOptions {
  zIndex: number;
  sorting: boolean;
  onSort?: () => void;
}

export class LayerWrapper {
  uid: string;
  log: LoggerInterface;
  name: string;
  _opt: LayerWrapperOptions;
  _group: PIXI.display.Group;
  _layer: PIXI.display.Layer;

  constructor (name, options: LayerWrapperOptions) {
    this.name = name
    this.uid = (name + 'LayerWrapper' || 'UnknownLayerWrapper') + '#' + shortUuid()
    this.log = Logger.createLogger(this.uid)
    this.log.v('constructor> enter')

    this._opt = options

    this._group = new PX.Group(this._opt.zIndex, this._opt.sorting)
    if (this._opt.onSort) { this._group.on('sort', this._opt.onSort) }
    this._layer = new PX.Layer(this._group)

    this.log.d('instance created')
    this.log.v('constructor> leave')
  }

  get group () { return this._group }
  
  get layer () { return this._layer }
}
