import PX from '../pixijs-wrapper'
import * as Utils from '../utils/misc'
import { StageBase } from '../internals'
import { TextureCanvas } from '../texture/texture-canvas.js'
import { Game } from '../internals'

class StageIndex extends StageBase {
  pieces?: {
    sBg: PIXI.Sprite
    sTitle: PIXI.Sprite
    sPlayBtn: PIXI.Sprite
  }
  local?: {
    tBg: TextureCanvas,
    tTitle: TextureCanvas,
    tPlayBtn: TextureCanvas,
  }

  constructor (ctx: Game) {
    super(ctx, 'Index')
  }

  async init () {
    const that = this
    const u = this.unit

    return (new Promise((resolve, reject) => {
      that.ctx.loader
        .add('/static/char/sample/sample.png')
        .load(resolve)
    })).then(() => {
      const tBg = new TextureCanvas({ width: 128, height: 128 })
      tBg.apply((cvs: CanvasRenderingContext2D) => {
        cvs.fillStyle = '#FF88FF'
        cvs.fillRect(0, 0, 128, 128)
        cvs.fillStyle = '#FFAAFF'
        cvs.fillRect(0, 0, 128, 8)
        cvs.fillRect(0, 0, 8, 128)
        cvs.textBaseline = 'top'
        cvs.font = '16px san-serif'
        cvs.fillText('배경 영역', 16, 16)
      })

      const sBg = new PX.TilingSprite(tBg.texture, u.width, u.height)
      this.stage.addChild(sBg)

      const tTitle = new TextureCanvas()

      const sTitle = new PX.Sprite(tTitle.texture)
      sTitle.anchor.set(1, 0)
      this.stage.addChild(sTitle)

      const tPlayBtn = new TextureCanvas()

      const sPlayBtn = new PX.Sprite(tPlayBtn.texture)
      sPlayBtn.anchor.set(1, 1)
      sPlayBtn.interactive = true
      sPlayBtn.buttonMode = true
      sPlayBtn.on('pointerdown', event => {
        //this.ctx.changeStage('play')
      })
      this.stage.addChild(sPlayBtn)

      this.pieces = {
        sBg,
        sTitle,
        sPlayBtn,
      }
      this.local = {
        tBg,
        tTitle,
        tPlayBtn,
      }
    })
  }

  onAttach () {
    Utils.superMethod(this, 'onAttach')
  }

  onTick (delta: number, time: number) {

  }

  onResize () {
    Utils.superMethod(this, 'onResize')

    if (!this.pieces || !this.local) return

    const u = this.unit
    const lo = this.local
    const pi = this.pieces
    let _1: any = null
    let _2: any = null

    pi.sBg.width = u.width
    pi.sBg.height = u.height

    lo.tTitle.width = (_1 = u.mu*60)
    lo.tTitle.height = (_2 = u.mu*20)
    lo.tTitle.apply(cvs => {
      cvs.fillStyle = '#FF0000'
      cvs.fillRect(0, 0, _1, _2)
      cvs.fillStyle = '#FF8888'
      cvs.textBaseline = 'top'
      cvs.font = '16px san-serif'
      cvs.fillText('타이틀 영역 예시(수정 필요)', 16, 16)
    })
    // TODO: 화면 좌우 길이 대비별 요소 크기 적용

    pi.sTitle.position.set(u.width, 0)

    lo.tPlayBtn.width = (_1 = u.mu*40)
    lo.tPlayBtn.height = (_2 = u.mu*20)
    lo.tPlayBtn.apply(cvs => {
      cvs.strokeStyle = '#FFFFFF'
      cvs.lineWidth = 8
      cvs.strokeRect(0, 0, _1, _2)
      cvs.fillStyle = '#FFFFFF'
      cvs.textBaseline = 'top'
      cvs.font = '16px san-serif'
      cvs.fillText('게임 시작 버튼 영역 예시', 16, 16)
    })

    pi.sPlayBtn.position.set(u.width, u.height)
  }
}

export default StageIndex
