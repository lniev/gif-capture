import FrameBox from './boxSelector'

export function startSelectArea() {
  const Box = new FrameBox()
  Box.readyDrawBox()
}

export function cancelSelectArea() {
  FrameBox.removeBox()
}


// export function () {
//
// }