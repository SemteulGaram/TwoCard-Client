import * as PIXI from 'pixi.js'
import captureStackTrace from 'capture-stack-trace'

Error.captureStackTrace = Error.captureStackTrace || captureStackTrace

const _pxLoader = new PIXI.Loader
const PX = {
  Application: PIXI.Application,
  Renderer: PIXI.Renderer,
  loader: _pxLoader,
  res: _pxLoader.resources,
  Sprite: PIXI.Sprite,
  AnimatedSprite: PIXI.AnimatedSprite,
  TilingSprite: PIXI.TilingSprite,
  BaseTexture: PIXI.BaseTexture,
  Texture: PIXI.Texture,
  TextureCache: PIXI.utils.TextureCache,
  Spritesheet: PIXI.Spritesheet,
  say: PIXI.utils.sayHello,
  Graphics: PIXI.Graphics,
  Text: PIXI.Text,
  TextStyle: PIXI.TextStyle,
  isWebGLSupported: PIXI.utils.isWebGLSupported,
  Container: PIXI.Container,
  Point: PIXI.Point,
  Matrix: PIXI.Point,
  Ticker: PIXI.Ticker,

  /*
  Group: PIXI.display.Group,
  Layer: PIXI.display.Layer,
  displayStage: PIXI.display.Stage,
  */
}

export default PX
