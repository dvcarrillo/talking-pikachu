/**
 * Create global accessible variables that will be modified later
 */
var audioContext = null;
var meter = null;
var rafID = null;
var mediaStreamSource = null;
var isMouthOpen = false;
var pikachuImg;
var micMsg;

// Retrieve AudioContext with all the prefixes of the browsers
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Get an audio context
audioContext = new AudioContext();

window.onload = () => {
    pikachuImg = document.getElementById('pikachu');
    micMsg = document.getElementById('micMsg');
};

function resumeAudioRecording() {
    if (mediaStreamSource == null) {
        micMsg.style.opacity = '0';

        // Try to get access to the microphone
        try {
            // Retrieve getUserMedia API with all the prefixes of the browsers
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Ask for an audio input
            navigator.getUserMedia(
                {
                    "audio": {
                        "mandatory": {
                            "googEchoCancellation": "false",
                            "googAutoGainControl": "false",
                            "googNoiseSuppression": "false",
                            "googHighpassFilter": "false"
                        },
                        "optional": []
                    },
                },
                onMicrophoneGranted,
                onMicrophoneDenied
            );
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
        audioContext.resume();
    }
}

/**
 * Callback triggered if the microphone permission is denied
 */
function onMicrophoneDenied() {
    alert('I am not allowed to acess your microphone. Pika pika.');
}

/**
 * Callback triggered if the access to the microphone is granted
 */
function onMicrophoneGranted(stream) {
    pikachuImg.style.opacity = '1';

    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // Trigger callback that shows the level of the "Volume Meter"
    onLevelChange();
}

/**
 * This function is executed repeatedly
 */
function onLevelChange(time) {
    if ((meter.volume > 0.05) && !isMouthOpen) {
        this.openMouth();
        setTimeout(() => {
            closeMouth();
        }, 20);
    }
    // else {
    //     this.closeMouth();
    // }

    // set up the next callback
    rafID = window.requestAnimationFrame(onLevelChange);
}

function openMouth() {
    pikachuImg.src = 'images/open.jpg';
    isMouthOpen = true;
}

function closeMouth() {
    pikachuImg.src = 'images/closed.jpg';
    isMouthOpen = false;
}