import PX from '../pixijs-wrapper.js'
import * as Utils from '../util/misc.js'
import TextureCanvas from '../texture/texture-canvas.js'
import StageBase from './components/stage-base.js'
import b2 from '../b2.min.js'

class StagePlay extends StageBase {
  constructor (ctx) {
    super(ctx)
    this.pieces = {}
    this.local = {}
    this.playerData = {
      walkSpeed: 3,
      valX: 0,
      valY: 0,
      x: 0,
      y: 0
    }
  }

  async init () {
    const that = this
    const u = this.unit
    const pi = this.pieces
    const lo = this.local

    return new Promise(function (resolve, reject) {
      that.ctx.pixi.loader
        .add('')
        .load(resolve)
    }).then(() => {
      lo.tBg = new TextureCanvas({ width: 128, height: 128 })
      lo.tBg.apply(cvs => {
        cvs.fillStyle = '#FF88FF'
        cvs.fillRect(0, 0, 128, 128)
        cvs.fillStyle = '#FFAAFF'
        cvs.fillRect(0, 0, 128, 8)
        cvs.fillRect(0, 0, 8, 128)
        cvs.textBaseline = 'top'
        cvs.font = '16px san-serif'
        cvs.fillText('배경 영역', 16, 16)
      })

      pi.bg = new PX.TilingSprite(lo.tBg.texture, u.Mu*150, u.Mu*50)
      this.stage.addChild(pi.bg)

      lo.tPlayer = new TextureCanvas({ width: 256, height: 256 })
      lo.tPlayer.apply(cvs => {
        cvs.fillStyle = '#FF00FF'
        cvs.arc(128, 64, 32, 0, Math.PI*2)
        cvs.fill()
        cvs.fillRect(128 - 8, 64, 16, 128)
      })

      pi.player = new PX.Sprite(lo.tPlayer.texture)
      pi.player.scale.set(0.5, 0.5)
      pi.player.position.set(this.playerData.x, this.playerData.y)
      this.stage.addChild(pi.player)

      // box2d setting
    	this.worldAABB = new b2.AABB()
    	this.worldAABB.minVertex.Set(0, 0);
    	this.worldAABB.maxVertex.Set(500, 500);

    	this.gravity = new b2.vec2(0, 300)
    	this.doSleep = true
    	this.world = new b2.world(this.worldAABB, this.gravity, this.doSleep)
    	
    	this.playerSd = new b2.boxDef()
    	this.playerSd.extents.Set(128, 128)
    	this.playerSd.restitution = 0.2
    	this.playerSd.density = 1.0
      this.playerBd = new b2.bodyDef()
      this.playerBd.AddShape(this.playerSd)
      this.playerBd.position.Set(0, 0)
      this.playerBody = this.world.CreateBody(this.playerBd)
      
    })
  }

  onAttach () {
    Utils.superMethod(this, 'onAttach')
    if (this.ctx.keyboardHandler.hasProfile('stage-play')) {
      this.ctx.keyboardHandler.restoreProfile('stage-play')
    } else {
      this.ctx.keyboardHandler.addHandle('ArrowUp', {
        onPress: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowDown') !== -1) {
            this.playerData.valY = 0
          } else {
            this.playerData.valY = -this.playerData.walkSpeed
          }
          // TODO: recalculate animation
        },
        onRelease: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowDown') !== -1) {
            this.playerData.valY = this.playerData.walkSpeed
          } else {
            this.playerData.valY = 0
          }
          // TODO: recalculate animation
        }
      })

      this.ctx.keyboardHandler.addHandle('ArrowDown', {
        onPress: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowUp') !== -1) {
            this.playerData.valY = 0
          } else {
            this.playerData.valY = this.playerData.walkSpeed
          }
          // TODO: recalculate animation
        },
        onRelease: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowUp') !== -1) {
            this.playerData.valY = -this.playerData.walkSpeed
          } else {
            this.playerData.valY = 0
          }
          // TODO: recalculate animation
        }
      })

      this.ctx.keyboardHandler.addHandle('ArrowLeft', {
        onPress: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowRight') !== -1) {
            this.playerData.valX = 0
          } else {
            this.playerData.valX = -this.playerData.walkSpeed
          }
          // TODO: recalculate animation
        },
        onRelease: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowRight') !== -1) {
            this.playerData.valX = this.playerData.walkSpeed
          } else {
            this.playerData.valX = 0
          }
          // TODO: recalculate animation
        }
      })

      this.ctx.keyboardHandler.addHandle('ArrowRight', {
        onPress: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowLeft') !== -1) {
            this.playerData.valX = 0
          } else {
            this.playerData.valX = this.playerData.walkSpeed
          }
          // TODO: recalculate animation
        },
        onRelease: (event, keyboardHandler) => {
          if (keyboardHandler.currentKeys.indexOf('ArrowLeft') !== -1) {
            this.playerData.valX = -this.playerData.walkSpeed
          } else {
            this.playerData.valX = 0
          }
          // TODO: recalculate animation
        }
      })
    }
  }

  onDisattach () {
    this.ctx.keyboardHandler.saveProfile('stage-play')
    this.ctx.keyboardHandler.clearHandle()
  }

  onTick (delta) {
    this.world.step(delta/1000, 1)
    this.playerData.x += this.playerData.valX * delta
    this.playerData.y += this.playerData.valY * delta
    this.pieces.player.position.set(this.playerData.x, this.playerData.y)
  }
}

export default StagePlay
