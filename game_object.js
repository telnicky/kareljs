var GameObject = {
  initialize: function(renderer, level) {
    this.renderer = renderer;
    this.level = level;
    this.keysDown = {};

    addEventListener("keydown", function (e) {
      this.keysDown[e.keyCode] = true;
    }.bind(this)), false;

    addEventListener("keyup", function (e) {
      delete this.keysDown[e.keyCode];
    }.bind(this), false);

    renderer.initialize();
    this.main();
  },

  main: function() {
    this.update();
    this.renderer.render(this.level);

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Request to do this again ASAP
    requestAnimationFrame(this.main.bind(this));
  },

  placeBeeper: function(x, y) {
    var beeper;
    for (var i = 0; i < this.level.beepers.length; i++) {
      beeper = this.level.beepers[i];
      if (beeper.x === x && beeper.y === y) {
        beeper.count++;
        return;
      }
    }
    this.level.beepers.push({ x: x, y: y, count: 1 });
  },

  pickBeeper: function(x, y) {
    var beeper;
    for (var i = 0; i < this.level.beepers.length; i++) {
      beeper = this.level.beepers[i];
      if (beeper.x === x && beeper.y === y) {
        beeper.count--;
        if (beeper.count <= 0) {
          var i = this.level.beepers.indexOf(beeper);
          this.level.beepers.splice(i, 1);
        }
        return;
      }
    }
  },

  update: function() {
    var karel = this.level.karel;

    // movement
    if (38 in this.keysDown && this.keysDown[38] && karel.y > 0) { // up
      this.keysDown[38] = false;
      karel.y -= 1;
    }
    if (40 in this.keysDown && this.keysDown[40] && karel.y < (this.renderer.canvas.height / this.renderer.blockSize) - 1) { // down
      this.keysDown[40] = false;
      karel.y += 1;
    }
    if (37 in this.keysDown && this.keysDown[37] && karel.x > 0) { // left
      this.keysDown[37] = false;
      karel.x -= 1;
    }
    if (39 in this.keysDown && this.keysDown[39] && karel.x < (this.renderer.canvas.width / this.renderer.blockSize) - 1) { // right
      this.keysDown[39] = false;
      karel.x += 1;
    }

    // beepers
    if (13 in this.keysDown && this.keysDown[13]) {
      this.keysDown[13] = false;
      this.placeBeeper(karel.x, karel.y);
    }
    if (16 in this.keysDown && this.keysDown[16]) {
      this.keysDown[16] = false;
      this.pickBeeper(karel.x, karel.y);
    }
  }
};

GameObject.initialize(Renderer, level);

