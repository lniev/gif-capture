class RecordToGif {
  record = null

  static getScreenStream(callback) {
    if (navigator.getDisplayMedia) {
      navigator.getDisplayMedia({
        video: true
      }).then(screenStream => {
        callback(screenStream);
      });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia({
        video: true
      }).then(screenStream => {
        callback(screenStream);
      });
    } else {
      alert('getDisplayMedia API is not supported by this browser.');
    }
  }

  start(config) {
    RecordToGif.getScreenStream((screenStream) => {
      recorder = RecordRTC(screenStream, {
        type: 'gif',
        frameRate: 1,
        quality: 100,
        width: 320,
        hidden: 240,
        ...config,
      });
      recorder.startRecording();
    })
  }
  stop() {

  }

}