function rgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

const canvas = document.getElementById("canvas");
const painter = canvas.getContext("2d");

const height = window.innerHeight;
const width = window.innerWidth;

painter.canvas.width = width;
painter.canvas.height = height;

drawGrid(0, 0, width, height, 25, new rgb(51, 51, 51));

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