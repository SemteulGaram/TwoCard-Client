import PX from '../pixijs-wrapper'
import { Logger, LoggerInterface } from '../utils/logger'
import { notOnlyParseInt } from '../utils/misc'

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
    this.element.width = notOnlyParseInt(this._opt.width)
    this.element.height = notOnlyParseInt(this._opt.height)
    this.canvasCtx = this.element.getContext('2d')
      || (() => { throw new Error('Unable create CanvasRenderingContext2D') })()
    this.local = {}
  }

  _ensureGetTexture (): PIXI.Texture {
    const options = this._opt.textureOptions || {}
    if (!this._texture) {
      if (!options.baseTextureOptions) {
        //options.baseTextureOptions = {
        //  mipmap: PIXI.MIPMAP_MODES.POW2
        //}
      }
      this._texture = PX.Texture.from(this.element, options.baseTextureOptions, options.strictMode) as PIXI.Texture
    }
    return this._texture
  }

  get width () {
    return this.element.width
  }

  set width (v: number) {
    this.element.width = notOnlyParseInt(v)
  }

  get height () {
    return this.element.height
  }

  set height (v: number) {
    this.element.height = notOnlyParseInt(v)
  }

  get texture (): PIXI.Texture {
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
