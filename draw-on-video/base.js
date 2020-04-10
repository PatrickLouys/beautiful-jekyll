canvas.addEventListener('click', (event) => {
    const x = event.pageX;
    const y = event.pageY;

    if (event.shiftKey && event.ctrlKey) {
        draw('drawCircle', [x, y, lineWidth, color, 100]);
        storeDrawings();
        return;
    }

    if (event.ctrlKey) {
        draw('drawCircle', [x, y, lineWidth, color, 50]);
        storeDrawings();
        return;
    }
}, false);

window.onkeydown = (event) => {
    if (event.key === ' ') {
        togglePlay();
    }

    if (event.shiftKey && event.key === 'ArrowUp') {
        videoPlayer.currentTime += 60;
        return;
    }

    if (event.shiftKey && event.key === 'ArrowDown') {
        videoPlayer.currentTime -= 60;
        return;
    }

    if (event.shiftKey && event.key === 'ArrowRight') {
        videoPlayer.currentTime += 10;
        return;
    }

    if (event.shiftKey && event.key === 'ArrowLeft') {
        videoPlayer.currentTime -= 10;
        return;
    }

    if (event.key === 'ArrowUp') {
        videoPlayer.currentTime += 1;
    }

    if (event.key === 'ArrowDown') {
        videoPlayer.currentTime -= 1;
    }

    if (event.key === 'ArrowRight') {
        videoPlayer.currentTime += 0.1;
    }

    if (event.key === 'ArrowLeft') {
        videoPlayer.currentTime -= 0.1;
    }

    if (event.ctrlKey && event.key === 'z') {
        undo();
    }

    if (event.key === 'Backspace') {
        clearCanvas();
    }

    for (let i = 0; i < 9; i++) {
        if (event.key === i.toString()) {
            changeColor(document.getElementById('color-' + i));
        }
    }

    event.preventDefault();
};