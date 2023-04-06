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
    refresh();
    test();
}

function test() {
    drawType(`diode-led`, [new rgb(255, 0, 0), new rgb(100, 100, 100)], 5, 5, 5, 5);
}

function drawType(type, colors, gridX, gridY, posX, posY) {
    type = "instructions/" + type.replace("-", "/") + ".txt";
    fetch(type)
        .then((response) => response.text())
        .then((text) => {
            const lines = text.split("\n");

            posX;
            posY;

            // Check For Lines Instruction
            for (var line = 0; line < lines.length; line++) {
                var instruction = lines[line].split(" ");
                for (var y = 0; y < gridY; y++) {
                    for (var x = 0; x < gridX; x++) {
                        switch (instruction[0]) {
                            case "C":
                                // Defines Circle Properties
                                drawCircle(posX, posY, posX + parseFloat(instruction[3]), posY + parseFloat(instruction[4]), colors[parseInt(instruction[5])]);
                                break;
                        }
                    }
                }
            }
        });
}

function drawCircle(tX, tY, bX, bY, color) {
    tX *= calcualtedZoom;
    tY *= calcualtedZoom;
    bX *= calcualtedZoom;
    bY *= calcualtedZoom;

    var width = bX - tX;
    var height = bY - tY;
    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.ellipse(tX - (calcualtedZoom / 2), tY - (calcualtedZoom / 2), width / 2, height / 2, 0, 0, 360);
    painter.fill();
}

function refresh() {
    clearGrid();
    calcualtedZoom = defaultGridSize * zoom.value;
    drawGrid(0, 0, width, height, calcualtedZoom, new rgb(51, 51, 51));
    test();
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