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

const defaultGridSize = 25;

painter.canvas.width = width;
painter.canvas.height = height;


drawGrid(0, 0, width, height, 25 * zoom.value, new rgb(51, 51, 51));

function updateZoom() {
    clearGrid();
    drawGrid(0, 0, width, height, 25 * zoom.value, new rgb(51, 51, 51));
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