var GameObject = {
  running: false,
  currentLine: null,
  lines: null,

  initialize: function(renderer, editor, level) {
    this.renderer = renderer;
    this.editor = editor;
    this.level = level;
    this.karel = level.karel;
    this.walls = level.walls.split("\n").map(function(row) { return row.split(","); });

    $('.run').click(this.onRun.bind(this));
    renderer.initialize(level);
    this.main();
    setInterval(this.update.bind(this), 800);
  },

  code: function() {
    return this.editor.doc.getValue();
  },

  main: function() {
    this.renderer.render();

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Request to do this again ASAP
    requestAnimationFrame(this.main.bind(this));
  },

  putBeeper: function(x, y) {
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

  turnLeft: function() {
    var karel = this.level.karel;
    karel.direction = (karel.direction + 1) % 4;
  },

  move: function(karel) {
    switch(karel.direction) {
      case 0: // right
        this.moveRight(karel);
        break;
      case 1: // up
        this.moveUp(karel);
        break;
      case 2: // left
        this.moveLeft(karel);
        break;
      case 3: // down
        this.moveDown(karel);
        break;
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

  onRun: function(event) {
    if (this.running) {
      this.running = false;
      return;
    }

    this.running = true;
    this.lines = this.code().split('\n');
    this.currentLine = this.lines.shift();
  },

  run: function(line) {
    var move = function() { this.move(this.karel); }.bind(this);
    var turnLeft = function() { this.turnLeft(); }.bind(this);
    var putBeeper = function() { this.putBeeper(this.karel.x, this.karel.y); }.bind(this);
    var pickBeeper = function() { this.pickBeeper(this.karel.x, this.karel.y); }.bind(this);

    eval(line);
    this.currentLine = this.lines.shift();
  },

  update: function() {
    var karel = this.level.karel;
    if (this.running && this.currentLine) {
      this.run(this.currentLine);
    } else {
      this.running = false;
    }
  }
};

GameObject.initialize(Renderer, Editor, level);

