// function drawBox(e) {
//   console.log('start')
//   const [startX, startY] = [e.clientX, e.clientY]
//   const divEle = document.createElement('div')
//   divEle.id = "screenshotBox"
//   divEle.width = '1px'
//   divEle.height = '1px'
//   divEle.style.position = 'absolute'
//   divEle.style.top = startY + 'px'
//   divEle.style.left = startX + 'px'
//   document.body.appendChild(divEle)
//
//   const moveEvent = (e) => {
//     console.log(111)
//     const moveX = e.clientX - startX
//     const moveY = e.clientY - startY
//     divEle.style.width = Math.abs(moveX) + 'px'
//     divEle.style.height = Math.abs(moveY) + 'px'
//     if (moveX < 0) {
//       divEle.left = e.clientX + 'px'
//     }
//     if (moveY < 0) {
//       divEle.top = e.clientY + 'px'
//     }
//   }
//
//   const [screenX, screenY] = [e.screenX, e.screenY]
//   window.addEventListener('mousemove', moveEvent)
//   window.addEventListener('mouseup', () => {
//     CROP_X = getPositionX(screenX);
//     CROP_Y = screenY;
//     window.removeEventListener('mousemove', moveEvent);
//     window.removeEventListener('mousedown', drawBox);
//   })
// }

export default class FrameBox {
  constructor(config) {
    // todo other config
    this.config = config
  }
  width = 0
  height = 0
  clientX = 0
  clientY = 0
  screenX = 0
  screenY = 0
  static boxId = "screenshotBox";

  /**
   * Handling multi-screen coordinates
   * @param x
   * @return {number|number|*}
   */
  static getPositionX(x) {
    if (!x) return 0
    const oneScreenWidth = window.screen.width
    const subWidth = x > oneScreenWidth  ? oneScreenWidth - oneScreenWidth : x
    return subWidth > oneScreenWidth ? FrameBox.getPositionX(subWidth) : subWidth
  }

  drawBox = (e) => {
    const [startX, startY] = [e.clientX, e.clientY]

    this.screenX = FrameBox.getPositionX(e.screenX)
    this.screenY = e.screenY

    this.clientX = startX
    this.clientY = startY
    const divEle = document.createElement('div')
    divEle.id = FrameBox.boxId
    divEle.width = '1px'
    divEle.height = '1px'
    divEle.style.position = 'absolute'
    divEle.style.top = startY + 'px'
    divEle.style.left = startX + 'px'
    document.body.appendChild(divEle)

    const moveEvent = (e) => {
      const moveX = e.clientX - startX
      const moveY = e.clientY - startY
      divEle.style.width = Math.abs(moveX) + 'px'
      divEle.style.height = Math.abs(moveY) + 'px'
      if (moveX < 0) {
        divEle.left = e.clientX + 'px'
      }
      if (moveY < 0) {
        divEle.top = e.clientY + 'px'
      }
    }

    const [screenX, screenY] = [e.screenX, e.screenY]
    window.addEventListener('mousemove', moveEvent)
    window.addEventListener('mouseup', () => {
      // this.width = FrameBox.getPositionX(screenX);
      // this.height = screenY;
      window.removeEventListener('mousemove', moveEvent);
      window.removeEventListener('mousedown', this.drawBox);
    })
  }

  static removeBox() {
    const boxElement = document.getElementById(FrameBox.boxId)
    console.log(boxElement)
    boxElement.remove();
  }

  readyDrawBox() {
    window.addEventListener('mousedown', this.drawBox)
  }

}

// export function readyDrawBox() {
//   window.addEventListener('mousedown', drawBox)
// }
