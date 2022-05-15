class RecordToGif {
	constructor(config) {
		this.config = config;
		this.record = null;
		this.canvas = document.createElement("canvas");
		this.video = document.createElement("video");
		this.setVideo(this.config, this.video);
		this.screen = null;
	}

	setConfig(config) {
		this.config = config;
	}

	static getScreenStream(callback) {
		if (navigator.getDisplayMedia) {
			navigator
				.getDisplayMedia({
					video: true,
				})
				.then(screenStream => {
					callback(screenStream);
				});
		} else if (navigator.mediaDevices.getDisplayMedia) {
			navigator.mediaDevices
				.getDisplayMedia({
					video: true,
				})
				.then(screenStream => {
					callback(screenStream);
				});
		} else {
			alert("getDisplayMedia API is not supported by this browser.");
		}
	}

	cropFrame = (config = {}, video) => {
		const _context = this.canvas.getContext("2d");

		this.canvas.width = config.width;
		this.canvas.height = config.height;
		_context.drawImage(
			video,
			config.screenX,
			config.screenY,
			config.width,
			config.height,
			0,
			0,
      config.width,
			config.height
		);
	};

	setVideo = (config, videoEle) => {
		this.video.setAttribute("autoplay", true);
		this.video.ontimeupdate = () => {
			this.cropFrame(config, videoEle);
		};
	};

	start = () => {
		if (this.recorder) return;
		RecordToGif.getScreenStream(screenStream => {
			this.screen = screenStream;
			this.video.srcObject = screenStream;
			const stream = this.canvas.captureStream();
			this.recorder = RecordRTC(stream, {
				type: "gif",
				frameRate: 1,
				quality: 10,
				width: this.config.width || 320,
				height: this.config.height || 240,
			});
			this.recorder.startRecording();
		});
	};

	stop = (callback = () => {}) => {
		this.recorder.stopRecording(() => {
			this.recorder.getDataURL(callback);
			this.screen.stop();
		});
	};
}

export default (function () {
	const singleOjb = null;
	return config => (singleOjb ? singleOjb : new RecordToGif(config));
})();
