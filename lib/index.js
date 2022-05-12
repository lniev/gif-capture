import FrameBox from './boxSelector.js'

const Box = new FrameBox()

export function startSelectArea() {
  Box.readyDrawBox()
}

export function getBoxInfo() {
  return {
    clientX: Box.clientX,
    clientY: Box.clientY,
    width: Box.width,
    height: Box.height,
    screenX: Box.screenX,
    screenY: Box.screenY
  }
}

export function cancelSelectArea() {
  FrameBox.removeBox();
}

// export function () {
//
// }