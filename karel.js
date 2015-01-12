var level = {
  walls: "0,0,0,0,0,0,0\n" +
         "0,0,9,8,12,0,0\n" +
         "0,0,1,0,0,0,0\n" +
         "0,0,3,2,6,0,0\n" +
         "0,0,0,0,0,0,0\n",
  beepers: [{ x: 5, y: 2, count: 1 }],
  karel: { x: 2, y: 1 }
}

// create the canvas
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
var blockSize = 32;
canvas.width = 512;
canvas.height = 480;
canvas.className = "karel-container";
document.body.appendChild(canvas);

// Load Images
var karelReady = false;
var karelImage = new Image();
karelImage.onload = function () {
  karelReady = true 
};
karelImage.src = "images/karel.png";

// Draw the grid
var drawGrid = function () {
  for (var x = 0; x <= canvas.width; x += 32) {
    for (var y = 0; y <= canvas.height; y += 32) {
      context.fillRect(x + blockSize * 0.5, y + blockSize * 0.5, 2, 2);
    }
  }
};

var drawLevel = function (level) {
  // walls
  var rows = level.walls.split("\n");
  for (var y = 0; y < rows.length; y++) {
    var columns = rows[y].split(",");
    for (var x = 0; x < columns.length; x++) {
      drawWall(x, y, columns[x]);
    }
  }

  // beepers
  for (var i = 0; i < level.beepers.length; i++) {
    var beeper = level.beepers[i];
    console.log(beeper);
    drawBeeper(beeper.x, beeper.y, beeper.count);
  }
};

var drawBeeper = function (x, y, count) {
  var minX = x * blockSize;
  var minY = y * blockSize;
  var midX = minX + blockSize * 0.5;
  var midY = minY + blockSize * 0.5;
  var maxX = minX + blockSize;
  var maxY = minY + blockSize;

  context.save();
  context.beginPath();
  context.moveTo(midX, minY); // top point
  context.lineTo(maxX, midY); // right point
  context.lineTo(midX, maxY); // bottom point
  context.lineTo(minX, midY); // left point

  context.lineWidth = 2;
  context.fillStyle = "rgb(102, 204, 0)";
  context.strokeStyle = "rgb(0, 50, 200)";

  context.closePath();
  context.fill();
  context.stroke();
  context.restore();

  if (count && count != 1) {
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(count, midX, midY);
    context.restore();
  }
};

// Internal: Draw a wall on given side
// 
// side - a bitmap representing each side of the wall.
//        0000 -> Top Right Bottom Left
//        T = 8, R = 4, B = 2, L = 1
var drawWall = function (x, y, side) {
  var minX = x * blockSize;
  var minY = y * blockSize;
  var midX = minX + blockSize * 0.5;
  var midY = minY + blockSize * 0.5;
  var maxX = minX + blockSize;
  var maxY = minY + blockSize;

  context.save();
  context.beginPath();

  if (side & 8) { // Top
    context.moveTo(minX, minY);
    context.lineTo(maxX, minY);
  }

  if (side & 4) { // Right
    context.moveTo(maxX, minY);
    context.lineTo(maxX, maxY);
  }

  if (side & 2) { // Bottom
    context.moveTo(minX, maxY);
    context.lineTo(maxX, maxY);
  }

  if (side & 1) { // Left
    context.moveTo(minX, minY);
    context.lineTo(minX, maxY);
  }

  context.stroke();
  context.restore();
};

// Game Objects 
var karel = {
  speed: 3, // blocks per second
  x: 0,
  y: 0
};

// Reset
var reset = function () {
  karel.x = 0;
  karel.y = 0;
};

// handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}), false;

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

// Update the game objects
var update = function (modifier) {
  if (38 in keysDown && karel.y > 0) { // up
    karel.y -= karel.speed * modifier;
  }
  if (40 in keysDown && karel.y < (canvas.height / blockSize) - 1) { // down
    karel.y += karel.speed * modifier;
  }
  if (37 in keysDown && karel.x > 0) { // left
    karel.x -= karel.speed * modifier;
  }
  if (39 in keysDown && karel.x < (canvas.width / blockSize) - 1) { // right
    karel.x += karel.speed * modifier;
  }
};

// Draw everything
var render = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawLevel(level);
  if (karelReady) {
    context.drawImage(karelImage, karel.x * blockSize, karel.y * blockSize, blockSize, blockSize);
  }
};

// Main game loop
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Start game
var then = Date.now();
reset();
main();
