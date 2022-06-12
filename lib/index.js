import FrameBox from "./boxSelector.js";
import createRecordToGif from "./recordToGif.js";
import Icon from "./icon.js";
let recordToGif = null;
let startButton = null;
let stopButton = null;

function createIcon(src) {
	const IconEle = document.createElement("img");
	IconEle.src = src;
	return IconEle;
}

const menus = [
	{
		label: "start",
		onClick: handleStart,
		icon: createIcon(Icon.start),
		getElement: element => {
			startButton = element;
		},
	},
	{
		label: "stop",
		style: "opacity: 0.3",
		icon: createIcon(Icon.stop),
		onClick: handleStop,
		getElement: element => {
			stopButton = element;
		},
	},
	{
		label: "cancel",
		icon: createIcon(Icon.cancel),
		onClick: cancelRecord,
	},
];

const Box = new FrameBox({
	menus,
});

function setButtonsStyle(start) {
	if (startButton) {
		startButton.setAttribute("style", `opacity: ${start ? "0.3" : "1"}`);
	}
	if (stopButton) {
		stopButton.setAttribute("style", `opacity: ${start ? "1" : "0.3"}`);
	}
}
// 处理开始录制
function handleStart(event) {
	setButtonsStyle(true);
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
		setButtonsStyle(false);
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
