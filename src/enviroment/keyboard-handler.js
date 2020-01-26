import { globalLogger as log } from '../util/logger.js'

class KeyboardHandler {
  constructor (eventTarget) {
    log.v('KeyboardHandler.constructor>eventTarget:', eventTarget)
    // 키 관련 이벤트를 받을 이벤트 타겟
    this._eventTarget = eventTarget

    // 현재 눌려진 키 목록
    this.currentKeys = []

    // construct 마다 함수 새로 생성: 각자 다른 KeyHandler 인스턴스의 _subscribe가 간섭하지 않게
    this._keyDownHandler = event => {
      log.v('KeyboardHandler._keyDownHandler>key:', event.key)
      let handle = null
      if ((handle = this._handles[event.key])) {
        if (!handle.isDown && handle.onPress) handle.onPress(event, this)
        handle.isDown = true
        if (this.currentKeys.indexOf(event.key) === -1)
          this.currentKeys[this.currentKeys.length] = event.key
        event.preventDefault()
      }
    }

    this._keyUpHandler = event => {
      log.v('KeyboardHandler._keyUpHandler>key:', event.key)
      let handle = null
      if ((handle = this._handles[event.key])) {
        if (handle.isDown && handle.onRelease) handle.onRelease(event, this)
        handle.isDown = false
        let index = null
        if ((index = this.currentKeys.indexOf(event.key)) !== -1) this.currentKeys.splice(index, 1)
        event.preventDefault()
      }
    }

    this._profiles = {}
    this._handles = {}

    this._subscribe()
  }

  get KeyboardHandler () {
    return this.constructor
  }

  _subscribe () {
    log.v('KeyboardHandler._subscribe')
    this._eventTarget.addEventListener('keydown', this._keyDownHandler)
    this._eventTarget.addEventListener('keyup', this._keyUpHandler)
  }

  _unsubscribe () {
    log.v('KeyboardHandler._unsubscribe')
    this._eventTarget.removeEventListener('keydown', this._keyDownHandler)
    this._eventTarget.removeEventListener('keyup', this._keyUpHandler)
  }

  destroy () {
    log.v('KeyboardHandler.destroy')
    this._unsubscribe()
    this._profiles = null
    this._handles = null
  }

  saveProfile (name) {
    log.v('KeyboardHandler.saveProfile:', name)
    this._profiles[name] = this._handles
  }

  restoreProfile (name) {
    log.v('KeyboardHandler.restoreProfile:', name)
    this._handles = this._profiles[name] || {}
  }

  hasProfile (name) {
    log.v('KeyboardHandler.hasProfile:', name)
    return !!this._profiles[name]
  }

  removeProfile (name) {
    log.v('KeyboardHandler.removeProfile:', name)
    return delete this._profiles[name]
  }

  clearHandle () {
    log.v('KeyboardHandler.clearHandle')
    this._handles = {}
  }

  addHandle (key, options = {}) {
    log.v('KeyboardHandler.addHandle:', key)
    this._handles[key] = {
      key,
      isDown: false,
      onPress: options.onPress,
      onRelease: options.onRelease
    }
  }

  removeHandle (key) {
    log.v('KeyboardHandler.removeHandle:', key)
    return delete this._handles[key]
  }
}

export default KeyboardHandler
