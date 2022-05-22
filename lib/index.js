import FrameBox from "./boxSelector.js";
import createRecordToGif from "./recordToGif.js";
let recordToGif = null;
const menus = [
	{
		label: "start",
		onClick: () => {
			const info = getBoxInfo();
			const config = {
				screenX: info.screenX + info.borderWidth,
				screenY: info.screenY + info.borderWidth,
				width: info.clientWidth,
				height: info.clientHeight,
			};
			recordToGif = createRecordToGif(config);
			recordToGif.start();
		},
	},
	{
		label: "stop",
		onClick: () => {
			recordToGif.stop(dataUrl => {
				Box.removeBox();
				console.log(dataUrl);
			});
		},
	},
];

const Box = new FrameBox({
	menus,
});

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
