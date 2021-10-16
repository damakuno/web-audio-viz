import * as d3 from "d3";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const scale = (num:number, in_min:number, in_max:number, out_min:number, out_max:number): number => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const arrSize = 40;
let dataArray: Uint8Array = new Uint8Array(arrSize);

let processMedia = async (constraints: MediaStreamConstraints) => {
	let stream: MediaStream = undefined;	
	let audioContext: AudioContext = undefined;
	let mediaStreamSource: MediaStreamAudioSourceNode = undefined;
	try {
	 	stream = await navigator.mediaDevices.getUserMedia(constraints);
		audioContext = new AudioContext();
		mediaStreamSource = audioContext.createMediaStreamSource(stream);
		let analyzer = audioContext.createAnalyser();
		mediaStreamSource.connect(analyzer);
		// rest of the code for processing the stream
		setInterval(()=> {
			analyzer.getByteFrequencyData(dataArray);
			console.log(dataArray);
		}, 100);

	} catch (err: any) {
		console.error(err);
	}
}

window.onload = async () => {
	console.log('window loaded');	
	const defaultConstraints: MediaStreamConstraints = { audio: true, video: false };
	await processMedia(defaultConstraints);
}