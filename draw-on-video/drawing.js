const changeColor = (that) => {
    const style = window.getComputedStyle(that);
    color = style.getPropertyValue('background-color');
    activateButton('color', that);
    currentColor.style.backgroundColor = style.getPropertyValue('background-color');
    currentColor.style.color = style.getPropertyValue('color');
};

const clearCanvas = () => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawings = [];
};

const drawCircle = (x, y, lineWidth, color, size) => {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.stroke();
};

const storeDrawings = () => {
    drawings.push(currentDrawings);
    currentDrawings = [];
};

const draw = (functionName, parameters) => {
    currentDrawings.push({
        'functionName': functionName,
        'parameters': parameters,
    });

    callDrawFunction(functionName, parameters);
};

const callDrawFunction = (functionName, parameters) => {
    if (functionName === 'drawLine') {
        return drawLine(...parameters);
    }

    if (functionName === 'drawCircle') {
        return drawCircle(...parameters);
    }

    console.error(functionName + ' is not a valid draw function');
};

let isDrawing = false;
let x = 0;
let y = 0;
let points = [];

const rect = canvas.getBoundingClientRect();
canvas.addEventListener('mousedown', event => {
    if (event.ctrlKey) {
        return; // prevents drawing while placing a circle
    }
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    isDrawing = true;
});

canvas.addEventListener('mousemove', event => {
    if (isDrawing === true) {
        draw('drawLine', [context, x, y, lineWidth, color]);
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }
});

window.addEventListener('mouseup', event => {
    if (isDrawing === true) {
        draw('drawLine', [context, x, y, lineWidth, color]);
        x = 0;
        y = 0;
        isDrawing = false;
        points = [];
        storeDrawings();
    }
});

const drawLine = (context, x, y, lineWidth, color) => {
    points.push({
        x: x,
        y: y
    });
    drawPoints(context, points, lineWidth, color);
};

function drawPoints(context, points, lineWidth, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // draw a basic circle instead
    if (points.length < 6) {
        const b = points[0];
        context.arc(b.x, b.y, context.lineWidth / 2, 0, Math.PI * 2, !0);
        context.closePath();
        context.fillStyle = color;
        context.fill();
        return;
    }
    context.moveTo(points[0].x, points[0].y);

    // draw a bunch of quadratics, using the average of two points as the control point
    for (let i = 1; i < points.length - 2; i++) {
        const c = (points[i].x + points[i + 1].x) / 2;
        const d = (points[i].y + points[i + 1].y) / 2;
        context.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    context.stroke();
}

const undo = () => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    drawings.pop();
    drawings.map(drawing => {
        drawing.map(command => {
            callDrawFunction(command.functionName, command.parameters);
        });
        points = [];
    });
};

const changeLineWidth = (that) => {
    lineWidth = that.value;
    let exampleLine = document.getElementById('current-color');
    exampleLine.style.height = that.value + 'px';
};
