import FrameBox from "./boxSelector.js";
import createRecordToGif from "./recordToGif.js";

let recordToGif = null;
let startButton = null;
let stopButton = null;

const menus = [
	{
		label: "start",
		onClick: handleStart,
		getElement: element => {
			startButton = element;
		},
	},
	{
		label: "stop",
		style: "opacity: 0.3",
		onClick: handleStop,
		getElement: element => {
			stopButton = element;
		},
	},
	{
		label: "cancel",
		onClick: cancelRecord,
	},
];

const Box = new FrameBox({
	menus,
});

function getTargetElement(event) {
	return event.target;
}

function setButtonStyle() {
	if (startButton) {
		startButton = getTargetElement(event);
		startButton.setAttribute("style", "opacity: 0.3");
	}
	if (stopButton) {
		stopButton.setAttribute("style", "opacity: 1");
	}
}

// 处理开始录制
function handleStart(event) {
	setButtonStyle();
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
	try {
		getTargetElement(event, stopButton);
		recordToGif.stop(dataUrl => {
			Box.removeBox();
			console.log(dataUrl);
		});
	} catch (error) {
		alert(
			"出错啦，刷新重试。" +
				"\n" +
				"Something went wrong, refresh and try again." +
				"\n" +
				"error:" +
				error
		);
	}
}

function cancelRecord() {
	recordToGif && recordToGif.stopRecording();
	Box.removeBox();
}

export default Box;
