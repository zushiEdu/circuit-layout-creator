import { builtinComponents } from "./modules/builtinComponents.js";
import { circuit } from "./modules/circuit.js";
import { circuitProperties } from "./modules/circuitProperties.js";
import { component } from "./modules/component.js";
import { componentProperties } from "./modules/componentProperties.js";
import { pin } from "./modules/pin.js";
import { rgb } from "./modules/rgb.js";
import { trace } from "./modules/trace.js";

const height = window.outerHeight;
const width = window.innerWidth;

const componentCanvas = document.getElementById("component-layer");
const connectorCanvas = document.getElementById("connector-layer");
const traceCanvas = document.getElementById("trace-layer");
const boardCanvas = document.getElementById("board-layer");
const gridCanvas = document.getElementById("grid-layer");
const highlightCanvas = document.getElementById("highlight-layer");

const backgroundPainter = gridCanvas.getContext("2d");
const boardPainter = boardCanvas.getContext("2d");
const tracePainter = traceCanvas.getContext("2d");
const connectorPainter = connectorCanvas.getContext("2d");
const componentPainter = componentCanvas.getContext("2d");
const highlightPainter = highlightCanvas.getContext("2d");

const painters = [backgroundPainter, boardPainter, tracePainter, connectorPainter, componentPainter, highlightPainter]
const canvases = [componentCanvas, connectorCanvas, traceCanvas, boardCanvas, gridCanvas, highlightCanvas];

for (var i = 0; i < painters.length; i++) {
    painters[i].canvas.width = width;
    painters[i].canvas.height = height;
}

const zoom = document.getElementById("zoom-select");

const boardToggleDisplay = document.getElementById("board-toggle");
const traceToggleDisplay = document.getElementById("trace-toggle");
const connectorToggleDisplay = document.getElementById("connector-toggle");
const componentToggleDisplay = document.getElementById("component-toggle");

window.newComponent = newComponent;
window.importData = importData;
window.saveOpenedCircuit = saveOpenedCircuit;
window.closeCircuits = closeCircuits;
window.setup = setup;
window.newCircuit = newCircuit;
window.openCircuitMenu = openCircuitMenu;
window.closeCircuitMenu = closeCircuitMenu;
window.toggleLayer = toggleLayer;
window.newTrace = newTrace;
window.selectComponent = selectComponent;
window.modifyComponent = modifyComponent;
window.modifyCircuit = modifyCircuit;
window.applyComponentEdits = applyComponentEdits;
window.applyCircuitEdits = applyCircuitEdits;
window.deleteElement = deleteElement;
window.openExportWindow = openExportWindow;
window.updateExportPreview = updateExportPreview;
window.exportArea = exportArea;

const defaultGridSize = 30;
var calcualtedZoom = defaultGridSize * zoom.value;

var windowElements = [];

var selectedElementIndex = 0;
var selectedElementPinIndex = 0;
var selectedTracePinIndex = 0;
var selectedTraceIndex = 0;


// Highlighted Display
const highlightedDisplay = document.querySelector('.modeDisplay');
var highlightSelected = "Comps";
highlightedDisplay.innerHTML = `Highlighted: ${highlightSelected}`;

var openedCircuit = null;

var l1 = [];
var l2 = [];
var l3 = [];
var l4 = [];

function setup() {
    clearGrid(backgroundPainter);

    calcualtedZoom = defaultGridSize * zoom.value;

    if (zoom.value >= 1) {
        for (var i = 0; i < canvases.length; i++) {
            canvases[i].width = width * zoom.value;
            canvases[i].height = height * zoom.value;
        }
    }
    if (openedCircuit != null) {
        drawGrid(0, 0, width * zoom.value, height * zoom.value, calcualtedZoom, new rgb(51, 51, 51), backgroundPainter);
        calculateComponentAngle();
        drawCircuit(openedCircuit);
        updateHiearchy();
        updateElementCount();
    }
}

const hiearchyDiv = document.querySelector(".component-hierarchy");
function updateHiearchy() {
    hiearchyDiv.innerHTML = null;
    for (var i = 0; i < openedCircuit.components.length; i++) {
        var textElement = document.createElement("a");
        textElement.setAttribute("onclick", `selectComponent(${i})`);
        var text = openedCircuit.components[i].componentProperty.name;
        var node = document.createTextNode(text);
        textElement.appendChild(node);
        hiearchyDiv.appendChild(textElement);
    }
}

function selectComponent(i) {
    highlightSelected = "Comps";
    selectedElementIndex = i;
    setup();
}

function newComponent(componentType) {
    if (openedCircuit != null) {
        for (var i = 0; i < builtinComponents.length; i++) {
            if (componentType == builtinComponents[i].type) {
                const c = builtinComponents[i];
                openedCircuit.components.push(new component(new componentProperties(c.height, c.width, c.name, c.type, c.value, c.colors, c.pins, c.rotation, c.layer), null));
            }
        }
    }
    setup();
}

function newTrace() {
    if (openedCircuit != null) {
        openedCircuit.traces.push(new trace(new pin(1, 1), new pin(2, 1)));
    }
    setup();
}

function newCircuit() {
    const circuitName = document.getElementById("circuitName").value;
    const circuitDescription = document.getElementById("circuitDescription").value;
    const circuitAuthor = document.getElementById("circuitAuthor").value;

    var name = circuitName;
    var description = circuitDescription;
    var author = circuitAuthor;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    if (month < 10)
        month = '0' + month;
    if (day < 10)
        day = '0' + day;
    var formattedDate = `${year}-${month}-${day}`;
    openedCircuit = new circuit(new circuitProperties(name, description, author, formattedDate, formattedDate), [], []);
    closeCircuitMenu();
    setup();
}

function updateElementCount() {
    if (openedCircuit != null) {
        const elementCount = document.querySelector('.elementCounter');
        if (openedCircuit.components.length == 1) {
            elementCount.innerText = openedCircuit.components.length + " Element";
        } else {
            elementCount.innerText = openedCircuit.components.length + " Elements";
        }
    }
}

const modifyComponentForm = document.querySelector(".componentPropertyEditor");
const nameForm = document.getElementById("componentName");
const tileXForm = document.getElementById("tileX");
const tileYForm = document.getElementById("tileY");
function modifyComponent() {
    if (openedCircuit != null) {
        if (openedCircuit.components.length != 0) {
            modifyComponentForm.style.display = "block";
            var c = openedCircuit.components[selectedElementIndex].componentProperty;

            nameForm.value = c.name;
            tileXForm.value = c.width;
            tileYForm.value = c.height;
        }
    }
}

function applyComponentEdits() {
    if (openedCircuit != null) {
        var c = openedCircuit.components[selectedElementIndex].componentProperty;
        var newComponentProperties = new componentProperties(parseInt(tileYForm.value), parseInt(tileXForm.value), nameForm.value, c.type, c.value, c.colors, c.pins, c.rotation, c.layer);
        openedCircuit.components[selectedElementIndex].componentProperty = newComponentProperties;
        modifyComponentForm.style.display = "none";
        setup();
    }
}

function deleteElement() {
    if (highlightSelected = "Comps") {
        openedCircuit.components.splice(selectedElementIndex, 1);
    }
    modifyComponentForm.style.display = "none";
    setup();
}

const modifyCircuitForm = document.querySelector(".circuitPropertyEditor");
const circuitNameInput = document.querySelector("#circuitNameInput");
function modifyCircuit() {
    if (openedCircuit != null) {
        modifyCircuitForm.style.display = "block";

        var name = openedCircuit.circuitProperty.name;
        if (name == "" || name == null || name == " ") {
            name = "untitled";
        }

        circuitNameInput.value = name;
    }
}

function applyCircuitEdits() {
    if (openedCircuit != null) {
        openedCircuit.circuitProperty.name = circuitNameInput.value;
        modifyCircuitForm.style.display = "none";
    }
}

function importData() {
    var element = document.createElement('div');
    element.innerHTML = '<input type="file">';
    var fileInput = element.firstChild;
    fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];
        if (file.name.match(/\.(json)$/)) {
            var reader = new FileReader();
            reader.onload = function () {
                openedCircuit = JSON.parse(reader.result);
                setup();
            };
            reader.readAsText(file);
        } else {
            alert("File not supported, .json files only");
        }
    });
    fileInput.click();
}

function saveVariableToFile(variable, saveName) {
    if (saveName == "") {
        saveName = "untitled";
    }
    var thingToSave = JSON.stringify(variable);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:attachment/text," + encodeURI(thingToSave);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${saveName}.json`;
    hiddenElement.click();
}

function saveOpenedCircuit() {
    if (openedCircuit != null) {
        var fileName = openedCircuit.circuitProperty.name.toLowerCase().replace(" ", "-");
        saveVariableToFile(openedCircuit, fileName);
    }
}

function closeCircuits() {
    openedCircuit = null;
    setup();
}

var layerToggles = [true, true, true, true];

function toggleLayer(toggleLayer) {
    layerToggles[toggleLayer] = !layerToggles[toggleLayer];
    var prefix = "";
    if (layerToggles[toggleLayer]) {
        prefix = "✓"
    } else {
        prefix = "✗"
    }

    switch (toggleLayer) {
        case 0:
            boardToggleDisplay.innerText = prefix + " Boards";
            break;
        case 1:
            traceToggleDisplay.innerText = prefix + " Traces";
            break;
        case 2:
            connectorToggleDisplay.innerText = prefix + " Connectors";
            break;
        case 3:
            componentToggleDisplay.innerHTML = prefix + " Components";
            break;
    }

    setup();
}

// try to put boards on this layer
function layerOne(painter) {
    if (!layerToggles[0]) {
        painter.globalAlpha = 0.1;
    } else {
        painter.globalAlpha = 1;
    }
    for (var i = 0; i < l1.length; i++) {
        var centerPoint = averagePinPos(l1[i].pins);
        drawType(l1[i].type, l1[i].colors, l1[i].width, l1[i].height, centerPoint.x, centerPoint.y, l1[i].rotation, painter);
    }
}

// put traces on this layer
function layerTwo(painter) {
    if (!layerToggles[1]) {
        painter.globalAlpha = 0.1;
    } else {
        painter.globalAlpha = 1;
    }
    for (var i = 0; i < l2.length; i++) {
        drawConnection(l2[i].pin1.x, l2[i].pin1.y, l2[i].pin2.x, l2[i].pin2.y, new rgb(0, 0, 0), painter);
    }
}

// put component pins on this layer
function layerThree(painter) {
    if (!layerToggles[2]) {
        painter.globalAlpha = 0.1;
    } else {
        painter.globalAlpha = 1;
    }
    for (var i = 0; i < l3.length; i++) {
        if (l3[i].length == 2) {
            drawConnection(l3[i][0].x, l3[i][0].y, l3[i][1].x, l3[i][1].y, new rgb(102, 102, 102), painter);
        } else if (l3[i].length == 3) {
            drawConnection(l3[i][0].x, l3[i][0].y, l3[i][1].x, l3[i][1].y, new rgb(102, 102, 102), painter);
            drawConnection(l3[i][1].x, l3[i][1].y, l3[i][2].x, l3[i][2].y, new rgb(102, 102, 102), painter);
        } else {
            for (var j = 0; j < l3[i].length; j++) {
                drawPin(l3[i][j].x, l3[i][j].y, new rgb(102, 102, 102), painter);
            }
        }
    }
}

// put components on this layer
function layerFour(painter) {
    if (!layerToggles[3]) {
        painter.globalAlpha = 0.1;
    } else {
        painter.globalAlpha = 1;
    }
    for (var i = 0; i < l4.length; i++) {
        var centerPoint = averagePinPos(l4[i].pins);
        drawType(l4[i].type, l4[i].colors, l4[i].width, l4[i].height, centerPoint.x, centerPoint.y, l4[i].rotation, painter);
    }
}

function drawPin(posX, posY, color, painter) {
    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.ellipse((posX + 0.5) * calcualtedZoom, (posY + 0.5) * calcualtedZoom, 5 * zoom.value, 5 * zoom.value, 0, 0, 360);
    painter.fill();
    painter.closePath();
}

// TODO
function drawCircuit(selectedCircuit) {
    l1 = [];
    l2 = [];
    l3 = [];
    l4 = [];
    if (selectedCircuit != null) {
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
        for (var j = 0; j < selectedCircuit.traces.length; j++) {
            var t = selectedCircuit.traces[j];
            l2.push(t);
        }
        layerOne(boardPainter);
        layerTwo(tracePainter);
        layerThree(connectorPainter);
        layerFour(componentPainter);
        highlightComponent(highlightPainter);
    }
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

function highlightComponent(painter) {
    if (openedCircuit != null) {
        if (highlightSelected == "Comps") {
            if (openedCircuit.components.length != 0) {
                if (openedCircuit.components[selectedElementIndex] != null) {
                    var c = openedCircuit.components[selectedElementIndex].componentProperty;
                    var center = averagePinPos(c.pins);
                    painter.transform(1, 0, 0, 1, (center.x) * calcualtedZoom, (center.y) * calcualtedZoom);
                    drawCircleHollow(0, 0, (c.width + 1) * calcualtedZoom, (c.height + 1) * calcualtedZoom, new rgb(0, 255, 0), highlightPainter);
                    painter.transform(1, 0, 0, 1, -(center.x) * calcualtedZoom, -(center.y) * calcualtedZoom);
                    var p = openedCircuit.components[selectedElementIndex].componentProperty.pins;
                    if (p.length == 2) {
                        painter.transform(1, 0, 0, 1, (p[selectedElementPinIndex].x) * calcualtedZoom, (p[selectedElementPinIndex].y) * calcualtedZoom);
                        drawCircleHollow(0.5, 0.5, 2 * calcualtedZoom, 2 * calcualtedZoom, new rgb(255, 0, 0), highlightPainter);
                        painter.transform(1, 0, 0, 1, -(p[selectedElementPinIndex].x) * calcualtedZoom, -(p[selectedElementPinIndex].y) * calcualtedZoom);
                    }
                }
            }
        } else if (highlightSelected == "Traces") {
            if (openedCircuit.traces.length != 0) {
                var c = openedCircuit.traces[selectedTraceIndex];
                if (selectedTracePinIndex == 0) {
                    painter.transform(1, 0, 0, 1, (c.pin1.x) * calcualtedZoom, (c.pin1.y) * calcualtedZoom);
                    drawCircleHollow(0.5, 0.5, 2 * calcualtedZoom, 2 * calcualtedZoom, new rgb(255, 0, 0), highlightPainter);
                    painter.transform(1, 0, 0, 1, -(c.pin1.x) * calcualtedZoom, -(c.pin1.y) * calcualtedZoom);
                } else if (selectedTracePinIndex = 1) {
                    painter.transform(1, 0, 0, 1, (c.pin2.x) * calcualtedZoom, (c.pin2.y) * calcualtedZoom);
                    drawCircleHollow(0.5, 0.5, 2 * calcualtedZoom, 2 * calcualtedZoom, new rgb(255, 0, 0), highlightPainter);
                    painter.transform(1, 0, 0, 1, -(c.pin2.x) * calcualtedZoom, -(c.pin2.y) * calcualtedZoom);
                }
            }
        }
    }
}

const exportWindow = document.querySelector(".exportWindow");
const exportX1 = document.querySelector("#exportX1");
const exportX2 = document.querySelector("#exportX2");
const exportY1 = document.querySelector("#exportY1");
const exportY2 = document.querySelector("#exportY2");

function openExportWindow() {
    exportWindow.style.display = "block";
    updateExportPreview();
}

var UL = new pin(parseInt(exportX1.value) * calcualtedZoom, parseInt(exportY1.value) * calcualtedZoom);
var BR = new pin(parseInt(exportX2.value) * calcualtedZoom, parseInt(exportY2.value) * calcualtedZoom);
function updateExportPreview() {
    if (exportWindow.style.display == "block") {
        setup();
        drawRectangleHollow(UL.x, UL.y, BR.x, BR.y, new rgb(0, 0, 255), highlightPainter);
    }
}

function exportArea() {
    var oldMode = highlightSelected;
    highlightSelected = "None";
    setup();
    setTimeout(finalExport, 200);
    highlightSelected = oldMode;
}

var cWidth = BR.x - UL.x;
var cHeight = BR.y - UL.y;

function finalExport() {
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cWidth;
    croppedCanvas.height = cHeight;
    const croppedCanvasContext = croppedCanvas.getContext('2d');
    croppedCanvasContext.drawImage(canvas, 0, 0, cWidth, cHeight, 0, 0, cWidth, cHeight);
    var link = document.createElement('a');
    link.download = 'export.png';
    link.href = croppedCanvas.toDataURL('image/png');
    link.click();
}

function calculateComponentAngle() {
    if (openedCircuit.components.length >= 1) {
        if (highlightSelected == "Comps") {
            if (openedCircuit.components[selectedElementIndex] != null) {
                if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                    var p = openedCircuit.components[selectedElementIndex].componentProperty.pins;
                    var deltaX = p[1].x - p[0].x;
                    var deltaY = p[1].y - p[0].y;

                    var ratio = deltaX / deltaY;

                    var angle = radToDeg(Math.atan(ratio));

                    openedCircuit.components[selectedElementIndex].componentProperty.rotation = 90 - angle;
                }
            }
        }
    }
}

function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

function drawType(type, colors, gridX, gridY, posX, posY, rotation, painter) {
    type = "instructions/" + type.replace("-", "/") + ".txt";
    fetch(type)
        .then((response) => response.text())
        .then((text) => {
            const lines = text.split("\n");
            // Check For Lines Instruction
            for (var line = 0; line < lines.length; line++) {
                var instruction = lines[line].split(" ");
                painter.transform(1, 0, 0, 1, (posX + (gridX / 2)) * calcualtedZoom, (posY + (gridY / 2)) * calcualtedZoom);
                painter.rotate(degToRad(rotation));
                switch (instruction[0]) {
                    case "C":
                        for (var y = -(gridY / 2); y < gridY / 2; y++) {
                            for (var x = -(gridX / 2); x < gridX / 2; x++) {
                                // Defines Circle Properties
                                painter.transform(1, 0, 0, 1, (x + 0.5) * calcualtedZoom, (y + 0.5) * calcualtedZoom);
                                drawCircle(parseFloat(instruction[1]) * calcualtedZoom, parseFloat(instruction[2]) * calcualtedZoom, parseFloat(instruction[3]) * calcualtedZoom, parseFloat(instruction[4]) * calcualtedZoom, colors[parseInt(instruction[5])], painter);
                                painter.transform(1, 0, 0, 1, -(x + 0.5) * calcualtedZoom, -(y + 0.5) * calcualtedZoom);
                            }
                        }
                        break;
                    case "R":
                        for (var y = -(gridY / 2); y < gridY / 2; y++) {
                            for (var x = -(gridX / 2); x < gridX / 2; x++) {
                                // Defines Circle Properties
                                painter.transform(1, 0, 0, 1, (x + 0.5) * calcualtedZoom, (y + 0.5) * calcualtedZoom);
                                drawRectangle(parseFloat(instruction[1]) * calcualtedZoom, parseFloat(instruction[2]) * calcualtedZoom, parseFloat(instruction[3]) * calcualtedZoom, parseFloat(instruction[4]) * calcualtedZoom, colors[parseInt(instruction[5])], painter);
                                painter.transform(1, 0, 0, 1, -(x + 0.5) * calcualtedZoom, -(y + 0.5) * calcualtedZoom);
                            }
                        }
                        break;
                    case "RR":
                        for (var y = -(gridY / 2); y < gridY / 2; y++) {
                            for (var x = -(gridX / 2); x < gridX / 2; x++) {
                                // Defines Circle Properties
                                painter.transform(1, 0, 0, 1, (x + 0.5) * calcualtedZoom, (y + 0.5) * calcualtedZoom);
                                drawRoundedRectangle(parseFloat(instruction[1]) * calcualtedZoom, parseFloat(instruction[2]) * calcualtedZoom, parseFloat(instruction[3]) * calcualtedZoom, parseFloat(instruction[4]) * calcualtedZoom, colors[parseInt(instruction[5])], painter);
                                painter.transform(1, 0, 0, 1, -(x + 0.5) * calcualtedZoom, -(y + 0.5) * calcualtedZoom);
                            }
                        }
                        break;
                    case "Text":
                        for (var y = -(gridY / 2); y < gridY / 2; y++) {
                            for (var x = -(gridX / 2); x < gridX / 2; x++) {
                                // Defines Circle Properties
                                painter.transform(1, 0, 0, 1, (x + 0.5) * calcualtedZoom, (y + 0.5) * calcualtedZoom);
                                paintText(instruction[1] * calcualtedZoom, instruction[2] * calcualtedZoom, instruction[3], colors[parseInt(instruction[4])], painter);
                                painter.transform(1, 0, 0, 1, -(x + 0.5) * calcualtedZoom, -(y + 0.5) * calcualtedZoom);
                            }
                        }
                        break;
                }
                painter.rotate(-degToRad(rotation));
                painter.transform(1, 0, 0, 1, -(posX + (gridX / 2)) * calcualtedZoom, -(posY + (gridY / 2)) * calcualtedZoom);
            }
        });
}

function paintText(x, y, text, color, painter) {
    painter.beginPath();
    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.font = `${parseInt(calcualtedZoom)}px Arial`;
    painter.fillText(text, x - (painter.measureText(text).width / 2), y - ((painter.measureText(text).fontBoundingBoxDescent - painter.measureText(text).fontBoundingBoxAscent) / 2));
    painter.closePath();
}

function drawConnection(aX, aY, bX, bY, color, painter) {
    painter.beginPath();
    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.lineWidth = 5 * zoom.value;
    painter.moveTo((aX + 0.5) * calcualtedZoom, (aY + 0.5) * calcualtedZoom);
    painter.lineTo((bX + 0.5) * calcualtedZoom, (bY + 0.5) * calcualtedZoom);
    painter.stroke();
    painter.closePath();
    painter.lineWidth = 1;
}

function drawCircle(tX, tY, bX, bY, color, painter) {
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

function drawCircleHollow(tX, tY, bX, bY, color, painter) {
    var width = (bX - tX) / 2;
    var height = (bY - tY) / 2;

    var midX = (bX + tX) / 2;
    var midY = (bY + tY) / 2;

    painter.lineWidth = 3;

    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.ellipse(midX - (0.5 * calcualtedZoom), midY - (0.5 * calcualtedZoom), width, height, 0, 0, 360);
    painter.stroke();
    painter.closePath();

    painter.lineWidth = 1;
}

function drawRectangleHollow(tX, tY, bX, bY, color, painter) {
    var width = bX - tX;
    var height = bY - tY;

    painter.lineWidth = 3;

    painter.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.rect(tX, tY, width, height);
    painter.stroke();
    painter.closePath();

    painter.lineWidth = 1;
}

function drawRectangle(tX, tY, bX, bY, color, painter) {
    var width = bX - tX;
    var height = bY - tY;

    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.rect(tX - (0.5 * calcualtedZoom), tY - (0.5 * calcualtedZoom), width, height);
    painter.fill();
    painter.closePath();
}

function drawRoundedRectangle(tX, tY, bX, bY, color, painter) {
    var width = bX - tX;
    var height = bY - tY;

    painter.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    painter.beginPath();
    painter.roundRect(tX - (0.5 * calcualtedZoom), tY - (0.5 * calcualtedZoom), width, height, [5 * zoom.value]);
    painter.fill();
    painter.closePath();
}

function clearGrid(painter) {
    painter.fillStyle = `rgb(29,32,33)`;
    painter.fillRect(0, 0, width, height);
}

function drawGrid(ax, ay, bx, by, blockSize, color, painter) {
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

// New Circuit Menu
const circuitWindow = document.querySelector('.newCircuitWindow');
function closeCircuitMenu() {
    circuitWindow.style.display = "none";
}

function openCircuitMenu() {
    circuitWindow.style.display = "block";
}

//S crolable Content
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

// Key Input
function input(key) {
    switch (key) {
        case "ArrowUp":
            if (openedCircuit.components != null && openedCircuit.components.length >= 0) {
                if (highlightSelected == "Comps") {
                    if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex] = movePin(openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex], 0, -1);
                    } else {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins = moveComponent(openedCircuit.components[selectedElementIndex].componentProperty, 0, -1)
                    }
                } else if (highlightSelected == "Traces") {
                    if (selectedTracePinIndex == 0) {
                        openedCircuit.traces[selectedTraceIndex].pin1 = movePin(openedCircuit.traces[selectedTraceIndex].pin1, 0, -1);
                    } else if (selectedTracePinIndex == 1) {
                        openedCircuit.traces[selectedTraceIndex].pin2 = movePin(openedCircuit.traces[selectedTraceIndex].pin2, 0, -1);
                    }
                }
            }
            setup();
            break;
        case "ArrowDown":
            if (openedCircuit.components != null && openedCircuit.components.length >= 0) {
                if (highlightSelected == "Comps") {
                    if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex] = movePin(openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex], 0, 1);
                    } else {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins = moveComponent(openedCircuit.components[selectedElementIndex].componentProperty, 0, 1)
                    }
                } else if (highlightSelected == "Traces") {
                    if (selectedTracePinIndex == 0) {
                        openedCircuit.traces[selectedTraceIndex].pin1 = movePin(openedCircuit.traces[selectedTraceIndex].pin1, 0, 1);
                    } else if (selectedTracePinIndex == 1) {
                        openedCircuit.traces[selectedTraceIndex].pin2 = movePin(openedCircuit.traces[selectedTraceIndex].pin2, 0, 1);
                    }
                }
            }
            setup();
            break;
        case "ArrowRight":
            if (openedCircuit.components != null && openedCircuit.components.length >= 0) {
                if (highlightSelected == "Comps") {
                    if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex] = movePin(openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex], 1, 0);
                    } else {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins = moveComponent(openedCircuit.components[selectedElementIndex].componentProperty, 1, 0)
                    }
                } else if (highlightSelected == "Traces") {
                    if (selectedTracePinIndex == 0) {
                        openedCircuit.traces[selectedTraceIndex].pin1 = movePin(openedCircuit.traces[selectedTraceIndex].pin1, 1, 0);
                    } else if (selectedTracePinIndex == 1) {
                        openedCircuit.traces[selectedTraceIndex].pin2 = movePin(openedCircuit.traces[selectedTraceIndex].pin2, 1, 0);
                    }
                }
            }
            setup();
            break;
        case "ArrowLeft":
            if (openedCircuit.components != null && openedCircuit.components.length >= 0) {
                if (highlightSelected == "Comps") {
                    if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex] = movePin(openedCircuit.components[selectedElementIndex].componentProperty.pins[selectedElementPinIndex], -1, 0);
                    } else {
                        openedCircuit.components[selectedElementIndex].componentProperty.pins = moveComponent(openedCircuit.components[selectedElementIndex].componentProperty, -1, 0)
                    }
                } else if (highlightSelected == "Traces") {
                    if (selectedTracePinIndex == 0) {
                        openedCircuit.traces[selectedTraceIndex].pin1 = movePin(openedCircuit.traces[selectedTraceIndex].pin1, -1, 0);
                    } else if (selectedTracePinIndex == 1) {
                        openedCircuit.traces[selectedTraceIndex].pin2 = movePin(openedCircuit.traces[selectedTraceIndex].pin2, -1, 0);
                    }
                }
            }
            setup();
            break;
        case "]":
            if (highlightSelected == "Traces") {
                if (selectedTracePinIndex + 1 == 2) {
                    selectedTracePinIndex = 0;
                } else {
                    selectedTracePinIndex++;
                }
            } else if (highlightSelected == "Comps") {
                if (openedCircuit.components[selectedElementIndex] != null) {
                    if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                        if (selectedElementPinIndex + 1 == 2) {
                            selectedElementPinIndex = 0;
                        } else {
                            selectedElementPinIndex++;
                        }
                    }
                }
            }
            setup();
            break;
        case "[":
            if (highlightSelected == "Traces") {
                if (selectedTracePinIndex == 0) {
                    selectedTracePinIndex = 1
                } else {
                    selectedTracePinIndex--;
                }
            } else if (highlightSelected == "Comps") {
                if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length == 2) {
                    if (selectedElementPinIndex == 0) {
                        selectedElementPinIndex = openedCircuit.components[selectedElementIndex].circuitProperty.pins.length - 1;
                    } else {
                        selectedElementPinIndex--;
                    }
                }
            }
            setup();
            break;
        case "=":
            if (highlightSelected == "Traces") {
                if (selectedTraceIndex + 1 == openedCircuit.traces.length) {
                    selectedTraceIndex = 0;
                } else {
                    selectedTraceIndex++;
                }
            } else if (highlightSelected == "Comps") {
                if (selectedElementIndex + 1 == openedCircuit.components.length) {
                    selectedElementIndex = 0;
                } else {
                    selectedElementIndex++;
                }
            }
            setup();
            break;
        case "-":
            if (highlightSelected == "Traces") {
                if (selectedTraceIndex == 0) {
                    selectedTraceIndex = openedCircuit.traces.length - 1;
                } else {
                    selectedTraceIndex--;
                }
            } else if (highlightSelected == "Comps") {
                if (selectedElementIndex == 0) {
                    selectedElementIndex = openedCircuit.components.length - 1;
                } else {
                    selectedElementIndex--;
                }
            }
            setup();
            break;
        case "p":
            switch (highlightSelected) {
                case "None":
                    highlightSelected = "Comps";
                    break;
                case "Comps":
                    highlightSelected = "Traces";
                    break;
                case "Traces":
                    highlightSelected = "None";
                    break;
            }
            highlightedDisplay.innerHTML = `Highlighted: ${highlightSelected}`;
            setup();
            updateExportPreview();
            break;
        case "r":
            if (highlightSelected == "Comps") {
                if (openedCircuit.components[selectedElementIndex].componentProperty.pins.length != 2) {
                    openedCircuit.components[selectedElementIndex].componentProperty.rotation += 45;
                }
            }
            setup();
            break;
        case "Delete":
            if (highlightSelected == "Traces") {
                openedCircuit.traces.splice(selectedTraceIndex, 1);
                selectedTraceIndex = 0;
            } else if (highlightSelected == "Comps") {
                openedCircuit.components.splice(selectedElementIndex, 1);
                selectedElementIndex = 0;
            }
            setup();
            break;
    }
}

document.addEventListener(
    "keydown",
    (event) => {
        var name = event.key;
        if (name == "ArrowLeft" || name == "ArrowRight" || name == "ArrowDown" || name == "ArrowUp") {
            event.preventDefault();
        }
        input(name);
    },
    false
);

function moveComponent(componentProperty, offsetX, offsetY) {
    var newPins = [];
    for (var i = 0; i < componentProperty.pins.length; i++) {
        newPins.push(new pin(componentProperty.pins[i].x + offsetX, componentProperty.pins[i].y + offsetY));
    }
    return newPins;
}

function movePin(oldPin, offsetX, offsetY) {
    return new pin(oldPin.x + offsetX, oldPin.y + offsetY);
}

setup();