var GameObject = {
  running: false,
  currentLine: null,
  lines: null,

  initialize: function(level) {
    this.level = level;
    this.editor = Editor;
    this.karel = Karel.initialize(level.karel);
    this.world = World.initialize(level.world, Renderer);
    this.renderer = Renderer.initialize(this.world, this.karel);

    $('.run').click(this.onRun.bind(this));
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
    var move = function() {
      if (this.world.canMove(this.karel.direction, this.karel.x, this.karel.y)) {
        this.karel.move();
      }
    }.bind(this);

    var turnLeft = function() { this.karel.turnLeft(); }.bind(this);
    var putBeeper = function() { this.world.putBeeper(this.karel.x, this.karel.y); }.bind(this);
    var pickBeeper = function() { this.world.pickBeeper(this.karel.x, this.karel.y); }.bind(this);

    eval(line);
    this.currentLine = this.lines.shift();
  },

  update: function() {
    if (this.running && this.currentLine) {
      this.run(this.currentLine);
    } else {
      this.running = false;
    }
  }
};

GameObject.initialize(level);

