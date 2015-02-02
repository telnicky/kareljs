var GameObject = {
  running: false,
  lines: null,
  updateQueue: [],

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

  commands: {
    move: function(obj) {
      if (obj.world.canMove(obj.karel.direction, obj.karel.x, obj.karel.y)) {
        obj.karel.move();
      }
    },

    turnLeft: function(obj) {
      obj.karel.turnLeft();
    },

    putBeeper: function(obj) {
      obj.world.putBeeper(obj.karel.x, obj.karel.y);
    },

    pickBeeper: function(obj) {
      obj.world.pickBeeper(obj.karel.x, obj.karel.y);
    }
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
  },

  parseLines: function(code) {
    var lines = code.split('\n');
  },

  queueCommand: function(command) {
    this.updateQueue.push(command);
  },

  run: function() {
    var move = function() { this.queueCommand("move"); }.bind(this);
    var turnLeft = function() { this.queueCommand("turnLeft"); }.bind(this);
    var putBeeper = function() { this.queueCommand("putBeeper"); }.bind(this);
    var pickBeeper = function() { this.queueCommand("pickBeeper"); }.bind(this);

    eval(this.code());
  },

  update: function() {
    console.log(this.updateQueue);
    if (this.running) {
      this.run();
      this.running = false;
    } else {
      this.running = false;
    }

    if (this.updateQueue.length > 0) {
      var command = this.updateQueue.pop();
      this.commands[command](this);
    }
  }
};

GameObject.initialize(level);

