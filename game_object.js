// TODO: Save State to local storage
// TODO: Moar levels
// TODO: Description
// TODO: Title / styling, disable run button while running, highlight on error
var GameObject = {
  running: false,
  updateQueue: [],

  initialize: function(level) {
    var savedLevel = JSON.parse(localStorage.getItem("karel-level-1"));
    this.initialLevel = $.extend({}, level);
    this.level = level;
    this.editor = Editor;

    if (savedLevel) {
      this.karel = Karel.initialize(savedLevel.karel);
      this.world = World.initialize(savedLevel.world, Renderer);
      this.setCode(savedLevel.code);
    } else {
      this.karel = Karel.initialize(level.karel);
      this.world = World.initialize(level.world, Renderer);
    }
      this.renderer = Renderer.initialize(this.world, this.karel);

    $('.run').click(this.onRun.bind(this));
    $('.reset').click(this.reset.bind(this));

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

  setCode: function(code) {
    this.editor.doc.setValue(code);
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

  queueCommand: function(command) {
    this.updateQueue.push(command);
  },

  reset: function() {
    this.running = false;
    this.level = this.initialLevel;
    this.karel = Karel.initialize(level.karel);
    this.world = World.initialize(level.world, Renderer);
    this.updateQueue = [];
  },

  run: function() {
    var move = function() { this.queueCommand("move"); }.bind(this);
    var turnLeft = function() { this.queueCommand("turnLeft"); }.bind(this);
    var putBeeper = function() { this.queueCommand("putBeeper"); }.bind(this);
    var pickBeeper = function() { this.queueCommand("pickBeeper"); }.bind(this);

    try {
      eval(this.code());
    } catch(err) {
      console.log(err);
      this.reset();
    }
  },

  save: function() {
    var value = JSON.stringify({ karel: this.karel.attributes(),
                                 world: this.world.attributes(),
                                 code:  this.code()
    });
    localStorage.setItem("karel-level-1", value);
  },

  update: function() {
    if (this.running) {
      this.run();
      this.running = false;
    } else {
      this.running = false;
    }

    if (this.updateQueue.length > 0) {
      var command = this.updateQueue.shift();
      this.commands[command](this);
    }

    this.save();
  }
};

GameObject.initialize(level);

