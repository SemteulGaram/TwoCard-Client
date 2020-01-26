class PreloadProgressBar {
  constructor () {
    this.rootElement = document.createElement('div')
    this.rootElement.classList.add('preload-progress-container')
    Object.assign(this.rootElement.style, {
      position: 'fixed',
      zIndex: 100,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 1,
      transition: 'opacity 1s'
    })
    this.rootElement.innerHTML = `
<div style="display:table;width:100%;height:100%;">
  <div style="display:table-cell;width:100%;height:100%;vertical-align:middle;text-align:center;">
    <div style="display:inline-block;width:100%;">
      <span class="title">...</span>
      <br>
      <br>
      <div class="bar-bg">
        <div class="bar"></div>
      </div>
    </div>
  </div>
</div>
`
    this.textElement = this.rootElement.querySelector('.title')
    this.barElement = this.rootElement.querySelector('.bar')

    this._attached = false

    this._attach()
  }

  _attach () {
    if (this._attached) return false

    document.body.appendChild(this.rootElement)
    this._attached = true
  }

  _disattach () {
    if (!this._attached) return false

    document.body.removeChild(this.rootElement)
    this._attached = false
  }

  destroy () {
    this._disattach()
  }

  progress (pct, text) {
    if (pct != null) this.barElement.style.width = (pct*100) + '%'
    if (text != null) this.textElement.innerText = text
  }

  finish () {
    this.rootElement.style.opacity = 0
    setTimeout(() => { this.destroy() }, 1000)
  }
}

export default PreloadProgressBar
