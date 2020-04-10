const loadVideo = (that) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4';

    input.onchange = event => {
        videoPlayer.src = URL.createObjectURL(event.target.files[0]);
        videoPlayer.onload = () => {
            URL.revokeObjectURL(videoPlayer.src); // free memory
        }
    };

    input.click();
    that.blur();

    let videoOverlay = document.getElementById('video-overlay');
    videoOverlay.remove();
};

const togglePlay = () => {
    let playButton = document.getElementById('play-button');

    if (videoPlayer.paused) {
        videoPlayer.play();
        playButton.innerHTML = '<i class="fas fa-pause">';
        playButton.blur();
        return;
    }
    videoPlayer.pause();
    playButton.innerHTML = '<i class="fas fa-play">';
    playButton.blur();
};

const resizeTo1080p = (that) => {
    videoPlayer.height = 1080;
    videoPlayer.width = 1920;
    canvas.height = 1080;
    canvas.width = 1920;
    drawingControls.classList.remove("controls-720");
    drawingControls.classList.add("controls-1080");

    if (videoOverlay) {
        videoOverlay.classList.remove("video-overlay-720");
        videoOverlay.classList.add("video-overlay-1080");
    }

    activateButton('resize', that);
    that.blur();
};

const resizeTo720p = (that) => {
    videoPlayer.height = 720;
    videoPlayer.width = 1280;
    canvas.height = 720;
    canvas.width = 1280;
    drawingControls.classList.remove("controls-1080");
    drawingControls.classList.add("controls-720");

    if (videoOverlay) {
        videoOverlay.classList.remove("video-overlay-1080");
        videoOverlay.classList.add("video-overlay-720");
    }

    activateButton('resize', that);
    that.blur();
};

const changeVolume = (that) => {
    videoPlayer.volume = that.value;
    let muteButton = document.getElementById('mute-button');
    if (that.value === '0') {
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        return;
    }
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
};

const toggleMute = (that) => {
    that.blur();
    if (videoPlayer.muted) {
        return unmute();
    }
    return mute();
};

const mute = () => {
    videoPlayer.muted = true;

    let muteButton = document.getElementById('mute-button');
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';

    let volume = document.getElementById('volume');
    volume.value = 0;
};

const unmute = () => {
    videoPlayer.muted = false;

    let muteButton = document.getElementById('mute-button');
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';

    let volume = document.getElementById('volume');
    volume.value = lastVolume;
};

const activateButton = (group, activeElement) => {
    const elements = document.getElementsByClassName(group);
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).classList.remove("active");
    }
    activeElement.classList.add('active');
};

const handleProgress = () => {
    const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    let progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percent}%`;
};
videoPlayer.addEventListener('timeupdate', handleProgress);

const scrub = (event) => {
    videoPlayer.currentTime = (event.offsetX / progress.offsetWidth) * videoPlayer.duration;
};
progress.addEventListener('click', scrub);

let mouseDown = false;
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);
progress.addEventListener('mousemove', (event) => mouseDown && scrub(event));