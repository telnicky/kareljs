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
