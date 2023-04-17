const socket = io();
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const recordingStatus = document.getElementById('recordingStatus');
const transcribedText = document.getElementById('transcribedText');
const textInput = document.getElementById('textInput');
const submitTextButton = document.getElementById('submitText');
const responseText = document.getElementById('responseText');
const playResponseButton = document.getElementById('playResponse');

let recorder;
let audioStream;
let audioData;

startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);
submitTextButton.addEventListener('click', submitText);
playResponseButton.addEventListener('click', playResponse);

//// Start Recording //////

async function startRecording() {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Choose the audio format based on browser support
        let audioMimeType = 'audio/ogg; codecs=opus';
        if (!MediaRecorder.isTypeSupported(audioMimeType)) {
            audioMimeType = 'audio/webm; codecs=opus';
            if (!MediaRecorder.isTypeSupported(audioMimeType)) {
                throw new Error(`Unsupported audio format: ${audioMimeType}`);
            }
        }

        recorder = new MediaRecorder(audioStream, { mimeType: audioMimeType });
        recorder.start();
        recordingStatus.textContent = 'Recording...';
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    } catch (err) {
        console.error('Error starting recording:', err);
    }
}

/////

///// Stop Recording //////

function stopRecording() {
    recorder.addEventListener('dataavailable', async (e) => {
        const localAudioData = new Blob([e.data], { type: 'audio/ogg; codecs=opus' }); // Change the variable name here
        const formData = new FormData();
        formData.append('audio', localAudioData); // And here

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            let data = await response.json();
            transcribedText.textContent = data.text;
            responseText.textContent = data.responseText;
            audioData = data.audioData; // This will correctly assign the base64-encoded audio data to the global variable
        } else {
            console.error('Error uploading audio');
        }
    });

    recorder.stop();
    audioStream.getTracks().forEach(track => track.stop());

    recordingStatus.textContent = 'Recording stopped.';
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
}


//////////


async function submitText() {
    const inputText = textInput.value;

    const response = await fetch('/submit-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
    });

    if (response.ok) {
        const data = await response.json();
        responseText.textContent = data.responseText;
        audioData = data.audioData;
    } else {
        console.error('Error submitting text');
    }
}

function playResponse() {
    const audioBlob = base64ToBlob(audioData, 'audio/mp3');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
}

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}
