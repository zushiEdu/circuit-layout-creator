class child {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}

class circuit {
    constructor(circuitProperty, components) {
        this.circuitProperty = circuitProperty;
        this.components = components;
    }

    addComponent(component) {
        this.components.push(component);
    }
}

class pin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class component {
    constructor(componentProperty, children) {
        this.componentProperty = componentProperty;
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
    }
}

class componentProperties {
    constructor(height, width, name, type, value, colors,) {
        this.height = height;
        this.width = width;
        this.name = name;
        this.colors = colors;
        this.value = value;
        this.type = type;
    }
}

class circuitProperties {
    constructor(name, description, author, doc, dole) {
        this.name = name;
        this.description = description;
        this.author = author;
        this.doc = doc;
        this.dole = dole;
    }
}

function rgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

const canvas = document.getElementById("canvas");
const painter = canvas.getContext("2d");
const zoom = document.getElementById("zoom-select");

const height = window.innerHeight - 40;
const width = window.innerWidth * 0.75;

const defaultGridSize = 30;
var calcualtedZoom = defaultGridSize * zoom.value;

var led_board = new circuit(new circuitProperties("Led Board", "Led Simply On", "Ethan Huber", "2023-04-04", "2023-04-04"), [new component(new componentProperties(`5T`, `5T`, `Base Board`, `board`, null, [`#fff`]), new child("diode", "LED1")), new component(new componentProperties(`0.9U`, `0.9U`, `LED1`, `diode-led`, null, [`#fff`]), null)])

var openedCircuit = led_board;

painter.canvas.width = width;
painter.canvas.height = height;

function setup() {
    clearGrid();
    calcualtedZoom = defaultGridSize * zoom.value;

    if (zoom.value >= 1) {
        canvas.width = width * zoom.value;
        canvas.height = height * zoom.value;
    }
    drawGrid(0, 0, width * zoom.value, height * zoom.value, calcualtedZoom, new rgb(51, 51, 51));
    layerOne();
}

// try to put boards on this layer
function layerOne() {
    drawType(`board-perf`, [new rgb(175, 135, 63), new rgb(232, 177, 137), new rgb(29, 32, 33)], 9, 9, 5, 5, 0);

    setTimeout(layerTwo, 100);
}

// put traces on this layer
function layerTwo() {
    drawConnection(5, 5, 5, 13, new rgb(0, 0, 0));
    drawConnection(5, 13, 13, 13, new rgb(0, 0, 0));
    drawConnection(13, 13, 13, 5, new rgb(0, 0, 0));
    drawConnection(13, 13, 13, 5, new rgb(0, 0, 0));
    drawConnection(8, 9, 10, 9, new rgb(0, 0, 0));

    setTimeout(layerThree, 100);
}

// put component pins on this layer
function layerThree() {
    drawConnection(5, 5, 8, 9, new rgb(150, 150, 150));
    drawConnection(10, 9, 13, 5, new rgb(150, 150, 150));

    setTimeout(layerFour, 100);
}

// put components on this layer
function layerFour() {
    var mid1 = new pin((5 + 8) / 2, (5 + 9) / 2);
    var mid2 = new pin((10 + 13) / 2, (5 + 9) / 2);
    drawType(`diode-led`, [new rgb(255, 0, 0), new rgb(100, 100, 100)], 1, 1, mid1.x, mid1.y, 0);
    drawType(`diode-led`, [new rgb(0, 255, 0), new rgb(100, 100, 100)], 1, 1, mid2.x, mid2.y, 0);

    drawType(`resistor-default`, [new rgb(141, 172, 156)], 1, 1, 8, 5, 0, 45);
}

function drawType(type, colors, gridX, gridY, posX, posY, rotation) {
    type = "instructions/" + type.replace("-", "/") + ".txt";
    fetch(type)
        .then((response) => response.text())
        .then((text) => {
            const lines = text.split("\n");


            // TOOD: do transforming on whole objects instead of singular commands
            for (var y = 0; y < gridY; y++) {
                for (var x = 0; x < gridX; x++) {
                    // Check For Lines Instruction
                    for (var line = 0; line < lines.length; line++) {
                        var instruction = lines[line].split(" ");
                        switch (instruction[0]) {
                            case "C":
                                // Defines Circle Properties
                                drawCircle(x + posX + parseFloat(instruction[1]) - 0.5, y + posY + parseFloat(instruction[2]) - 0.5, x + posX + parseFloat(instruction[3]) - 0.5, y + posY + parseFloat(instruction[4]) - 0.5, colors[parseInt(instruction[5])], rotation);
                                break;
                            case "R":
                                // Defines Rectangle Properties
                                drawRectangle(x + posX + parseFloat(instruction[1]) - 0.5, y + posY + parseFloat(instruction[2]) - 0.5, x + posX + parseFloat(instruction[3]) - 0.5, y + posY + parseFloat(instruction[4]) - 0.5, colors[parseInt(instruction[5])], rotation);
                                break;
                        }
                    }
                }
            }

        });
}

function drawConnection(aX, aY, bX, bY, color) {
    painter.beginPath();
    aX *= calcualtedZoom;
    aY *= calcualtedZoom;
    bX *= calcualtedZoom;
    bY *= calcualtedZoom;
    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.lineWidth = 5 * zoom.value;
    painter.moveTo(aX, aY);
    painter.lineTo(bX, bY);
    painter.stroke();
    painter.closePath();
    painter.lineWidth = 1;
}

function drawCircle(tX, tY, bX, bY, color, degRotation) {
    tX *= calcualtedZoom;
    tY *= calcualtedZoom;
    bX *= calcualtedZoom;
    bY *= calcualtedZoom;

    var width = bX - tX;
    var height = bY - tY;

    var midX = (tX + bX) / 2;
    var midY = (tY + bY) / 2;

    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.ellipse(0, 0, width / 2, height / 2, 0, 0, 360);
    painter.fill();
    painter.closePath();
}

function drawRectangle(tX, tY, bX, bY, color, degRotation) {
    tX *= calcualtedZoom;
    tY *= calcualtedZoom;
    bX *= calcualtedZoom;
    bY *= calcualtedZoom;

    var width = bX - tX;
    var height = bY - tY;

    var midX = (tX + bX) / 2;
    var midY = (tY + bY) / 2;

    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.rect(- width / 2, -height / 2, width, height);
    painter.fill();
    painter.closePath();
}

function clearGrid() {
    painter.fillStyle = `rgb(29,32,33)`;
    painter.fillRect(0, 0, width, height);
}

function drawGrid(ax, ay, bx, by, blockSize, color) {
    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    for (var x = ax; x <= bx; x = x + blockSize) {
        painter.beginPath();
        painter.moveTo(x + 0.5, ay);
        painter.lineTo(x + 0.5, by);
        painter.stroke();
    }
    for (var y = ay; y <= by; y = y + blockSize) {
        painter.beginPath();
        painter.moveTo(ax, y + 0.5);
        painter.lineTo(bx, y + 0.5);
        painter.stroke();
    }
    painter.closePath();
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Collapsible Menus
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

//Scrolable Content
const slider = document.querySelector('.content');
let isDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    startY = e.pageY - slider.offsetTop;
    scrollLeft = slider.scrollLeft;
    scrollTop = slider.scrollTop;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);
    slider.scrollLeft = scrollLeft - walkX;
    slider.scrollTop = scrollTop - walkY;
});

setup();