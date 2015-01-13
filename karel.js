// handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}), false;

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

var placeBeeper = function(level, x, y) {
  var beeper;
  for (var i = 0; i < level.beepers.length; i++) {
    beeper = level.beepers[i];
    if (beeper.x === x && beeper.y === y) {
      beeper.count++;
      return;
    }
  }
  level.beepers.push({ x: x, y: y, count: 1 });
}

var pickBeeper = function(level, x, y) {
  var beeper;
  for (var i = 0; i < level.beepers.length; i++) {
    beeper = level.beepers[i];
    if (beeper.x === x && beeper.y === y) {
      beeper.count--;
      if (beeper.count <= 0) {
        var i = level.beepers.indexOf(beeper);
        level.beepers.splice(i, 1);
      }
      return;
    }
  }
}

// Update the game objects
var update = function (level) {
  var karel = level.karel;

  // movement
  if (38 in keysDown && keysDown[38] && karel.y > 0) { // up
    keysDown[38] = false;
    karel.y -= 1;
  }
  if (40 in keysDown && keysDown[40] && karel.y < (canvas.height / blockSize) - 1) { // down
    keysDown[40] = false;
    karel.y += 1;
  }
  if (37 in keysDown && keysDown[37] && karel.x > 0) { // left
    keysDown[37] = false;
    karel.x -= 1;
  }
  if (39 in keysDown && keysDown[39] && karel.x < (canvas.width / blockSize) - 1) { // right
    keysDown[39] = false;
    karel.x += 1;
  }

  // beepers
  if (13 in keysDown && keysDown[13]) {
    keysDown[13] = false;
    placeBeeper(level, karel.x, karel.y);
  }
  if (16 in keysDown && keysDown[16]) {
    keysDown[16] = false;
    pickBeeper(level, karel.x, karel.y);
  }
};


// Main game loop
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function () {
  update(level);
  render(level);

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Start game
main();
