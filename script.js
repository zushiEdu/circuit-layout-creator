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

painter.canvas.width = width;
painter.canvas.height = height;

drawGrid(0, 0, width, height, calcualtedZoom, new rgb(51, 51, 51));

var led_board = new circuit(
    new circuitProperties(
        "Led Board",
        "Led Simply On",
        "Ethan Huber", "2023-04-04",
        "2023-04-04"
    ),
    [
        new component(
            new componentProperties(
                `5T`,
                `5T`,
                `Base Board`,
                `board`,
                null,
                [
                    `#fff`
                ]
            )
            ,
            new child("diode", "LED1")
        ),
        new component(
            new componentProperties(
                `0.9U`,
                `0.9U`,
                `LED1`,
                `diode-led`,
                null,
                [
                    `#fff`
                ]
            ),
            null
        )
    ]
)

//console.log(led_board);

drawType(`diode-led`, null, "5T", "5T");

pinInstruction(220, 220, 220, "L");
pinInstruction(220, 220, 220, "R");
rectInstruction(255, 0, 0, "C");
circleInstruction(255, 0, 0, "U");

function circleInstruction(r, g, b, location) {
    x = 5 * calcualtedZoom;
    y = 5 * calcualtedZoom;

    var step = calcualtedZoom / 8;

    painter.fillStyle = `rgb(${r},${g},${b})`;
    painter.beginPath();
    switch (location) {
        case "C":
            painter.ellipse(x + step * 4, y + step * 4, step * 3, step * 3, 0, 0, 360);
            break;
        case "L":
            painter.ellipse(x + step * 3, y + step * 4, step * 3, step * 3, 0, 0, 360);
            break;
        case "R":
            painter.ellipse(x + step * 5, y + step * 4, step * 3, step * 3, 0, 0, 360);
            break;
        case "U":
            painter.ellipse(x + step * 4, y + step * 3, step * 3, step * 3, 0, 0, 360);
            break;
        case "D":
            painter.ellipse(x + step * 4, y + step * 5, step * 3, step * 3, 0, 0, 360);
            break;
    }
    painter.fill();
}

function rectInstruction(r, g, b, location) {
    x = 5 * calcualtedZoom;
    y = 5 * calcualtedZoom;

    var step = calcualtedZoom / 8;

    painter.fillStyle = `rgb(${r},${g},${b})`;
    painter.beginPath();
    switch (location) {
        case "C":
            painter.rect(x + step * 1, y + step * 2, step * 6, step * 4);
            break;
    }
    painter.fill();
}

function pinInstruction(r, g, b, location) {
    x = 5 * calcualtedZoom;
    y = 5 * calcualtedZoom;

    var step = calcualtedZoom / 8;

    painter.fillStyle = `rgb(${r},${g},${b})`;
    painter.beginPath();
    switch (location) {
        case "L":
            painter.rect(x + step * 2, y + step * 5, step * 1, step * 3);
            break;
        case "R":
            painter.rect(x + step * 5, y + step * 5, step * 1, step * 3);
            break;
    }
    painter.fill();
}

function drawType(type, colors, gridX, gridY, posX, posY) {
    type = "instructions/" + type.replace("-", "/") + ".txt";
    fetch(type)
        .then((response) => response.text())
        .then((text) => {
            const lines = text.split("\n");

            var run = true;
            var lineNumber = 0;

            // Extract Drawing Mode
            var drawMode;
            if (gridX[gridX.length] == "T" && gridY[gridY.length] == "T") {
                drawMode = `tile`;

            } else {
                drawMode = `single`
            }
            gridX = gridX.substr(0, gridX.length - 1);
            gridY = gridY.substr(0, gridY.length - 1);

            // Check For Lines Instruction
            while (run) {
                var instruction = lines[lineNumber].split(" ");
                switch (instruction[0]) {
                    case "C":
                        // Defines Circle Properties
                        break;
                    case "*":
                        // End Of File Symbol
                        run = false;
                        break;
                }

                lineNumber++;
            }
        });
}

function updateZoom() {
    clearGrid();
    calcualtedZoom = defaultGridSize * zoom.value;
    drawGrid(0, 0, width, height, calcualtedZoom, new rgb(51, 51, 51));
    pinInstruction(220, 220, 220, "L");
    pinInstruction(220, 220, 220, "R");
    rectInstruction(255, 0, 0, "C");
    circleInstruction(255, 0, 0, "U");
}

function clearGrid() {
    painter.fillStyle = `rgb(29,32,33)`;
    painter.fillRect(0, 0, width, height);
}

function drawGrid(ax, ay, bx, by, blockSize, color) {
    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    var height = by - ay;
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