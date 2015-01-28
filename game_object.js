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

