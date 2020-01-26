import PX from '../pixijs-wrapper.js'
import { Logger, LoggerInterface } from '../utils/logger'
import { parseInt } from '../utils/misc'

export interface TextureOptions {
  baseTextureOptions?: {
    mipmap?: PIXI.MIPMAP_MODES;
    anisotropicLevel?: number;
    wrapMode?: PIXI.WRAP_MODES;
    scaleMode?: PIXI.SCALE_MODES;
    format?: PIXI.FORMATS;
    type?: PIXI.TYPES;
    target?: PIXI.TARGETS;
    alphaMode?: PIXI.ALPHA_MODES;
    width?: number;
    height?: number;
    resolution?: number;
    resourceOptions?: any;
  },
  strictMode?: boolean
}

export interface TextureCanvasOptions {
  width: number,
  height: number,
  textureOptions?: TextureOptions
}

export class TextureCanvas {
  element: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  // for canvas state playground
  local: any;
  
  _opt: TextureCanvasOptions;
  _texture?: PIXI.Texture;

  constructor (options?: TextureCanvasOptions) {
    this._opt = options || { width: 100, height: 100 }
    this.element = document.createElement('canvas')
    Object.assign(this.element.style, {
      zIndex: -9999, // TODO: min value, need this?
      display: 'none'
    })
    this.element.width = parseInt(this._opt.width)
    this.element.height = parseInt(this._opt.height)
    this.canvasCtx = this.element.getContext('2d')
      || (() => { throw new Error('Unable create CanvasRenderingContext2D') })()
    this.local = {}
  }

  _ensureGetTexture () {
    const options = this._opt.textureOptions || {}
    if (!this._texture) {
      if (!options.baseTextureOptions) {
        options.baseTextureOptions = {
          mipmap: PIXI.MIPMAP_MODES.POW2
        }
      }
      this._texture = PX.Texture.from(this.element, options.baseTextureOptions, options.strictMode)
    }
    return this._texture
  }

  get width () {
    return this.element.width
  }

  set width (v: number) {
    this.element.width = parseInt(v)
  }

  get height () {
    return this.element.height
  }

  set height (v: number) {
    this.element.height = parseInt(v)
  }

  get texture () {
    return this._ensureGetTexture()
  }

  destroy () {
    if (this.element.parentElement) this.element.remove()
    delete this.element
    delete this.canvasCtx
  }

  apply (mod: (canvasCtx: CanvasRenderingContext2D, ctx: TextureCanvas, local: any) => void) {
    mod(this.canvasCtx, this, this.local)
    // issue: https://github.com/pixijs/pixi.js/issues/3692
    // 이 메소드는 성능 저하를 일으킬 수 있음
    if (this._texture) this._texture.baseTexture.update();
  }
}
