var GameObject = {
  initialize: function(renderer, level) {
    this.renderer = renderer;
    this.level = level;
    this.keysDown = {};
    this.walls = level.walls.split("\n").map(function(row) { return row.split(","); })

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

  moveLeft: function(karel) {
    if (karel.x <= 0) {
      return;
    }

    var currentWall = parseInt(this.walls[karel.y][karel.x]);
    var nextWall = parseInt(this.walls[karel.y][karel.x - 1]);
    if ((currentWall & this.renderer.leftWall) == 0 && (nextWall & this.renderer.rightWall) == 0) {
      karel.x -= 1;
    }
  },

  moveRight: function(karel) {
    if (karel.x >= (this.renderer.canvas.width / this.renderer.blockSize) - 1) {
      return;
    }

    var currentWall = parseInt(this.walls[karel.y][karel.x]);
    var nextWall = parseInt(this.walls[karel.y][karel.x + 1]);
    if ((currentWall & this.renderer.rightWall) == 0 && (nextWall & this.renderer.leftWall) == 0) {
      karel.x += 1;
    }
  },

  moveUp: function(karel) {
    if (karel.y <= 0) {
      return;
    }
    var currentWall = parseInt(this.walls[karel.y][karel.x]);
    var nextWall = parseInt(this.walls[karel.y - 1][karel.x]);
    if ((currentWall & this.renderer.topWall) == 0 && (nextWall & this.renderer.bottomWall) == 0) {
      karel.y -= 1;
    }
  },

  moveDown: function(karel) {
    if (karel.y >= (this.renderer.canvas.height / this.renderer.blockSize) - 1) {
      return;
    }

    var currentWall = parseInt(this.walls[karel.y][karel.x]);
    var nextWall = parseInt(this.walls[karel.y + 1][karel.x]);
    if ((currentWall & this.renderer.bottomWall) == 0 && (nextWall & this.renderer.topWall) == 0) {
      karel.y += 1;
    }
  },

  update: function() {
    var karel = this.level.karel;

    // movement
    if (38 in this.keysDown && this.keysDown[38]) { // up
      this.keysDown[38] = false;
      this.moveUp(karel);
    }
    if (40 in this.keysDown && this.keysDown[40]) { // down
      this.keysDown[40] = false;
      this.moveDown(karel);
    }
    if (37 in this.keysDown && this.keysDown[37]) { // left
      this.keysDown[37] = false;
      this.moveLeft(karel);
    }
    if (39 in this.keysDown && this.keysDown[39]) { // right
      this.keysDown[39] = false;
      this.moveRight(karel);
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

