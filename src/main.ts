import { Logger } from './logger'

const log = Logger.createLogger('Main')

document.addEventListener('deviceready', function () {

  const rootCanvas = document.createElement('canvas')
  rootCanvas.className = 'main'
  Object.assign(rootCanvas.style, {
    position: 'fixed',

  })

  const appElement = document.querySelector('.app')
  if (!appElement) {
    log.e('App root element not found')
    return
  }
  appElement.appendChild(rootCanvas)
  log.i('Canvas registerd')
})
