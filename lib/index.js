import FrameBox from "./boxSelector.js";
import createRecordToGif from "./recordToGif.js";

let recordToGif = null;
const menus = [
	{
		label: "start",
		onClick: handleStart,
	},
	{
		label: "stop",
		onClick: handleStop,
	},
];

const Box = new FrameBox({
	menus,
});

let startButton = null;
let stopButton = null;

function getTargetElement(event, variable) {
	variable = event.target;
}
// 处理开始录制
function handleStart(event) {
	getTargetElement(event, startButton);
	// event.target.style.opacity === "0.3";
	// console.log(event.target.style.opacity);
	const info = Box.getBoxInfo();
	const config = {
		screenX: info.screenX + info.borderWidth,
		screenY: info.screenY + info.borderWidth,
		width: info.clientWidth,
		height: info.clientHeight,
	};
	recordToGif = createRecordToGif(config);
	recordToGif.start();
}

// 处理停止录制事件
function handleStop(event) {
	getTargetElement(event, stopButton);
	recordToGif.stop(dataUrl => {
		Box.removeBox();
		console.log(dataUrl);
	});
}

export default Box;

// export function startSelectArea() {
// 	Box.readyDrawBox();
// }

// export function getBoxInfo() {
// 	return Box.getBoxInfo();
// }

// export function cancelSelectArea() {
// 	Box.removeBox();
// }
