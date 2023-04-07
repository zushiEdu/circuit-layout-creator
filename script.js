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
    constructor(height, width, name, type, value, colors, pins, rotation, layer) {
        this.height = height;
        this.width = width;
        this.name = name;
        this.colors = colors;
        this.value = value;
        this.type = type;
        this.pins = pins;
        this.rotation = rotation;
        this.layer = layer;
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

var led_board = new circuit(
    new circuitProperties(
        "Led Board",
        "Led Simply On",
        "Ethan Huber",
        "2023-04-04",
        "2023-04-04"
    ),
    [
        new component(
            new componentProperties(
                5,
                5,
                `Base Board`,
                `board-perf`,
                null,
                [
                    new rgb(175, 135, 63),
                    new rgb(232, 177, 137),
                    new rgb(29, 32, 33)
                ],
                [
                    new pin(1, 1)
                ],
                0,
                1),
            new child("diode-led", "LED1")
        ),
        new component(
            new componentProperties(
                1,
                1,
                `LED1`,
                `diode-led`,
                null,
                [
                    new rgb(255, 0, 0),
                    new rgb(100, 100, 100)
                ],
                [
                    new pin(1, 1),
                    new pin(3, 1)
                ],
                0,
                4
            ),
            null
        ),
        new component(
            new componentProperties(
                1,
                1,
                `555 Chip`,
                `ic-4b4`,
                null,
                [
                    new rgb(50, 50, 50),
                    new rgb(255, 255, 255)
                ],
                [
                    new pin(1, 2),
                    new pin(2, 2),
                    new pin(3, 2),
                    new pin(4, 2),
                    new pin(1, 5),
                    new pin(2, 5),
                    new pin(3, 5),
                    new pin(4, 5)
                ],
                0,
                4
            ),
            null
        )
    ]
)

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
    drawCircuit(openedCircuit);
}

var l1 = [];
var l2 = [];
var l3 = [];
var l4 = [];

// try to put boards on this layer
function layerOne() {
    for (var i = 0; i < l1.length; i++) {
        if (l1[i].pins.length > 1) {
            var centerPoint = averagePinPos(c.pins);
        } else {
            var centerPoint = new pin(1, 1);
        }
        drawType(l1[i].type, l1[i].colors, l1[i].width, l1[i].height, centerPoint.x, centerPoint.y, l1[i].rotation);
    }

    setTimeout(layerTwo, 100);
}

// put traces on this layer
function layerTwo() {
    setTimeout(layerThree, 100);
}

// put component pins on this layer
function layerThree() {
    for (var i = 0; i < l3.length; i++) {
        if (l3[i].length == 2) {
            drawConnection(l3[i][0].x, l3[i][0].y, l3[i][1].x, l3[i][1].y, new rgb(102, 102, 102));
        } else {
            for (var j = 0; j < l3[i].length; j++) {
                drawPin(l3[i][j].x, l3[i][j].y, new rgb(102, 102, 102));
            }
        }
    }
    setTimeout(layerFour, 100);
}

// put components on this layer
function layerFour() {
    for (var i = 0; i < l4.length; i++) {
        if (l4[i].pins.length > 1) {
            var centerPoint = averagePinPos(l4[i].pins);
        } else {
            var centerPoint = new pin(1, 1);
        }
        drawType(l4[i].type, l4[i].colors, l4[i].width, l4[i].height, centerPoint.x, centerPoint.y, l4[i].rotation);
    }
}

function drawPin(posX, posY, color) {
    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.ellipse((posX + 0.5) * calcualtedZoom, (posY + 0.5) * calcualtedZoom, 5 * zoom.value, 5 * zoom.value, 0, 0, 360);
    painter.fill();
    painter.closePath();
}

function drawCircuit(selectedCircuit) {
    for (var i = 0; i < selectedCircuit.components.length; i++) {
        var c = selectedCircuit.components[i].componentProperty;
        switch (c.layer) {
            case 1:
                // Board & Bases Layer
                l1.push(c);
                break;
            case 2:
                l2.push(c);
                break;
            case 4:
                // Components
                l3.push(c.pins);
                l4.push(c);
                break;
        }
    }
    layerOne();
}

function averagePinPos(pins) {
    var xSum = 0;
    var ySum = 0;

    for (var i = 0; i < pins.length; i++) {
        xSum += pins[i].x;
        ySum += pins[i].y;
    }

    var averagePin = new pin(xSum / pins.length, ySum / pins.length);

    return averagePin;
}

function drawType(type, colors, gridX, gridY, posX, posY, rotation) {
    type = "instructions/" + type.replace("-", "/") + ".txt";
    fetch(type)
        .then((response) => response.text())
        .then((text) => {
            const lines = text.split("\n");
            // Check For Lines Instruction
            for (var line = 0; line < lines.length; line++) {
                var instruction = lines[line].split(" ");
                switch (instruction[0]) {
                    case "C":
                        for (var y = 0; y < gridY; y++) {
                            for (var x = 0; x < gridX; x++) {
                                // Defines Circle Properties
                                painter.transform(1, 0, 0, 1, (x + posX + 0.5) * calcualtedZoom, (y + posY + 0.5) * calcualtedZoom);
                                painter.rotate(degToRad(rotation));
                                drawCircle(parseFloat(instruction[1]) * calcualtedZoom, parseFloat(instruction[2]) * calcualtedZoom, parseFloat(instruction[3]) * calcualtedZoom, parseFloat(instruction[4]) * calcualtedZoom, colors[parseInt(instruction[5])]);
                                painter.rotate(-degToRad(rotation));
                                painter.transform(1, 0, 0, 1, -(x + posX + 0.5) * calcualtedZoom, -(y + posY + 0.5) * calcualtedZoom);
                            }
                        }
                        break;
                    case "R":
                        for (var y = 0; y < gridY; y++) {
                            for (var x = 0; x < gridX; x++) {
                                // Defines Circle Properties
                                painter.transform(1, 0, 0, 1, (x + posX + 0.5) * calcualtedZoom, (y + posY + 0.5) * calcualtedZoom);
                                painter.rotate(degToRad(rotation));
                                drawRectangle(parseFloat(instruction[1]) * calcualtedZoom, parseFloat(instruction[2]) * calcualtedZoom, parseFloat(instruction[3]) * calcualtedZoom, parseFloat(instruction[4]) * calcualtedZoom, colors[parseInt(instruction[5])]);
                                painter.rotate(-degToRad(rotation));
                                painter.transform(1, 0, 0, 1, -(x + posX + 0.5) * calcualtedZoom, -(y + posY + 0.5) * calcualtedZoom);
                            }
                        }
                        break;
                }
            }
        });
}

function drawConnection(aX, aY, bX, bY, color) {
    painter.beginPath();
    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.lineWidth = 5 * zoom.value;
    painter.moveTo((aX + 0.5) * calcualtedZoom, (aY + 0.5) * calcualtedZoom);
    painter.lineTo((bX + 0.5) * calcualtedZoom, (bY + 0.5) * calcualtedZoom);
    painter.stroke();
    painter.closePath();
    painter.lineWidth = 1;
}

function drawCircle(tX, tY, bX, bY, color) {
    var width = (bX - tX) / 2;
    var height = (bY - tY) / 2;

    var midX = (bX + tX) / 2;
    var midY = (bY + tY) / 2;

    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.ellipse(midX - (0.5 * calcualtedZoom), midY - (0.5 * calcualtedZoom), width, height, 0, 0, 360);
    painter.fill();
    painter.closePath();
}

function drawRectangle(tX, tY, bX, bY, color) {
    var width = bX - tX;
    var height = bY - tY;

    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.rect(tX - (0.5 * calcualtedZoom), tY - (0.5 * calcualtedZoom), width, height);
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
        painter.moveTo(x + 0.5 + (blockSize / 2), ay);
        painter.lineTo(x + 0.5 + (blockSize / 2), by);
        painter.stroke();
    }
    for (var y = ay; y <= by; y = y + blockSize) {
        painter.beginPath();
        painter.moveTo(ax, y + 0.5 + (blockSize / 2));
        painter.lineTo(bx, y + 0.5 + (blockSize / 2));
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