// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

const scale = (num: number, in_min: number, in_max: number, out_min: number, out_max: number): number => {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const arrSize = 300;

let dataArray: Uint8Array = new Uint8Array(arrSize);
let visualizerCanvas: HTMLCanvasElement;
let visContext: CanvasRenderingContext2D;
let analyzer: AnalyserNode;

let processMedia = async (constraints: MediaStreamConstraints) => {
	let stream: MediaStream = undefined;
	let audioContext: AudioContext = undefined;
	let mediaStreamSource: MediaStreamAudioSourceNode = undefined;
	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		audioContext = new AudioContext();
		mediaStreamSource = audioContext.createMediaStreamSource(stream);
		analyzer = audioContext.createAnalyser();
		mediaStreamSource.connect(analyzer);
		// rest of the code for processing the stream		
		requestAnimationFrame(drawLoop);
	} catch (err: any) {
		console.error(err);
	}
}

let drawLoop = () => {
	requestAnimationFrame(drawLoop);
	analyzer.getByteFrequencyData(dataArray);

	let width = visualizerCanvas.width;
	let height = visualizerCanvas.height;
	visContext.clearRect(0, 0, width, height);
	visContext.fillStyle = 'black';
	visContext.fillRect(0, 0, width, height);

	let rectWidth = width / arrSize;
	let r = 95;
	let g = 150;
	let b = 255;
	let barColor = rgbToObject(r, g, b, 0.5);
	for (let i = 0; i < dataArray.length; i++) {
		let rectHeight = scale(dataArray[i], 0, 255, 0, height);
		let x = rectWidth * i;
		let y = height - rectHeight;
		barColor.hueRotation(1);
		visContext.fillStyle = barColor.toCssRGBA() //`rgba(${r}, ${g}, ${b}, 0.50)`;
		visContext.fillRect(x, y, rectWidth, rectHeight);
	}
}

window.onload = async () => {
	visualizerCanvas = document.querySelector("#visualizer_canvas");
	visContext = visualizerCanvas.getContext("2d");
	const defaultConstraints: MediaStreamConstraints = { audio: true, video: false };
	await processMedia(defaultConstraints);
}