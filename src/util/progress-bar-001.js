// 기초적인 전체화면 막대, 글자, 프로그래스 바
class ProgressBar001 {
  constructor (pixi) {
    // 단위로 사용할 유닛
    this.unit = {
      w: pixi.screen.width,
      h: pixi.screen.height,
      vw: pixi.screen.width / 100,
      vh: pixi.screen.height / 100,
    }
    this.unit.textY = this.unit.vh*30
    this.unit.barY = this.unit.vh*70
    this.unit.barLeftPos = this.unit.vw*30
    this.unit.barWidth = this.unit.vw*40
    this.unit.barRightPos = this.unit.vw*70

    // 보여줄 픽시 인스턴스
    this.pixi = pixi

    // 그릴 그래픽과 텍스트
    this.grp = new PX.Graphics()
    this.textStyle = new PX.TextStyle({
      fontFamily: 'san-serif',
      fontSize: parseInt(this.unit.vw*3),
      fill: 'white'
    })
    this.text = new PX.Text('Aw, snap!', this.textStyle)
    this.text.position.set(this.unit.vw*50 - this.text.width/2, this.unit.textY - this.text.height/2)

    this._attach()
  }

  _attach () {
    return [this.pixi.stage.addChild(this.grp),
      this.pixi.stage.addChild(this.text)]
  }

  _disattach () {
    return [this.pixi.stage.removeChild(this.grp),
      this.pixi.stage.removeChild(this.text)]
  }

  destroy () {
    this._disattach()
    this.grp.destroy()
  }

  progress (pct, text) {
    // 사용할 변수
    const u = this.unit

    // 이전에 그린거 지우기
    this.grp.clear()

    // 배경 바
    this.grp.lineStyle(4, 0x555555, 1)
    this.grp.moveTo(u.barLeftPos, u.barY)
    this.grp.lineTo(u.barRightPos, u.barY)

    // 진짜 바
    this.grp.lineStyle(4, 0xFFFFFF, 1)
    this.grp.moveTo(u.barLeftPos, u.barY)
    this.grp.lineTo(u.barLeftPos + (u.barWidth * pct), u.barY)

    // 글자 지정
    if (text) {
      this.text.text = text
      this.text.position.set(u.vw*50 - this.text.width/2, u.textY - this.text.height/2)
    }
  }
}

export default ProgressBar001
