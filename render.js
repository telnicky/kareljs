var canvas = document.createElement("canvas");
var blockSize = 64;
canvas.className = "karel-container";
document.body.appendChild(canvas);

// Load Images
var karelReady = false;
var karelImage = new Image();
karelImage.onload = function () {
  karelReady = true 
};
karelImage.src = "images/karel.png";

var drawLevel = function (level) {
  var context = canvas.getContext("2d");
  var rows, columns;

  // set width and height
  rows = level.walls.split("\n");
  columns = rows[0].split(",");
  canvas.width = columns.length * blockSize;
  canvas.height = rows.length * blockSize;

  // walls
  for (var y = 0; y < rows.length; y++) {
    columns = rows[y].split(",");
    for (var x = 0; x < columns.length; x++) {
      context.fillRect(x * blockSize + blockSize * 0.5, y * blockSize + blockSize * 0.5, 2, 2);
      drawWall(x, y, columns[x]);
    }
  }

  // beepers
  for (var i = 0; i < level.beepers.length; i++) {
    var beeper = level.beepers[i];
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

  var context = canvas.getContext("2d");
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
  var context = canvas.getContext("2d");

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

  context.lineWidth = 4;
  context.stroke();
  context.restore();
};

// Draw everything
var render = function (level) {
  var context = canvas.getContext("2d");
  var karel = level.karel;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLevel(level);
  if (karelReady) {
    context.drawImage(karelImage, karel.x * blockSize, karel.y * blockSize, blockSize, blockSize);
  }
};
