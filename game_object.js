// Super Karel http://web.stanford.edu/class/cs106a/materials/midterm-1-reference.pdf
// TODO: Moar levels
// TODO: Description
// TODO: Title / styling, disable run button while running, highlight on error
var GameObject = {
  running: false,
  currentSnapshot: null,
  snapshots: [],

  initialize: function(level) {
    var savedLevel = JSON.parse(localStorage.getItem("karel-level-1"));
    this.initialLevel = $.extend(true, {}, level);
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
    this.currentSnapshot = this.takeSnapshot();
    this.renderer = Renderer.initialize();

    $('.run').click(this.run.bind(this));
    $('.reset').click(this.reset.bind(this));

    this.main();
    setInterval(this.update.bind(this), 800);
  },

  commands: {
    beepersInBag: function(obj) {
      return !!obj.karel.beeperCount;
    },

    beepersPresent: function(obj) {
      var x = obj.karel.x;
      var y = obj.karel.y;
      var result = false;
      obj.world.beepers.forEach(function(beeper) {
        if (beeper.x === x && beeper.y === y) {
          result = true;
        }
      });
      return result;
    },

    facingEast: function(obj) {
      return obj.karel.direction === 2;
    },

    facingNorth: function(obj) {
      return obj.karel.direction === 1;
    },

    facingSouth: function(obj) {
      return obj.karel.direction === 3;
    },

    facingWest: function(obj) {
      return obj.karel.direction === 0;
    },

    frontIsBlocked: function(obj) {
      return !this.frontIsClear(obj);
    },

    frontIsClear: function(obj) {
      return obj.world.canMove(obj.karel.front(), obj.karel.x, obj.karel.y);
    },

    leftIsBlocked: function(obj) {
      return !this.leftIsClear(obj);
    },

    leftIsClear: function(obj) {
      return obj.world.canMove(obj.karel.left(), obj.karel.x, obj.karel.y);
    },

    move: function(obj) {
      if (obj.world.canMove(obj.karel.direction, obj.karel.x, obj.karel.y)) {
        obj.karel.move();
      }
    },

    noBeepersInBag: function(obj) {
      return !this.beepersInBag(obj);
    },

    noBeepersPresent: function(obj) {
      return !this.beepersPresent(obj);
    },

    notFacingEast: function(obj) {
      return !this.facingEast(obj);
    },

    notFacingNorth: function(obj) {
      return !this.facingNorth(obj);
    },

    notFacingSouth: function(obj) {
      return !this.facingSouth(obj);
    },

    notFacingWest: function(obj) {
      return !this.facingWest(obj);
    },

    putBeeper: function(obj) {
      obj.world.putBeeper(obj.karel.x, obj.karel.y);
    },

    pickBeeper: function(obj) {
      obj.world.pickBeeper(obj.karel.x, obj.karel.y);
    },

    rightIsBlocked: function(obj) {
      return !this.rightIsClear(obj);
    },

    rightIsClear: function(obj) {
      return obj.world.canMove(obj.karel.right(), obj.karel.x, obj.karel.y);
    },

    turnAround: function(obj) {
      obj.karel.turnAround();
    },

    turnLeft: function(obj) {
      obj.karel.turnLeft();
    },

    turnRight: function(obj) {
      obj.karel.turnRight();
    },
  },

  code: function() {
    return this.editor.doc.getValue();
  },

  setCode: function(code) {
    this.editor.doc.setValue(code);
  },

  main: function() {
    var snapshot = this.currentSnapshot;
    if (snapshot) {
      this.renderer.render(snapshot.world, snapshot.karel);
    }

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Request to do this again ASAP
    requestAnimationFrame(this.main.bind(this));
  },

  reset: function() {
    this.running = false;
    this.level = this.initialLevel;
    this.karel = Karel.initialize(this.level.karel);
    this.world = World.initialize(this.level.world, Renderer);
    this.currentSnapshot = this.takeSnapshot();
    this.snapshots = [];
  },

  runCommand: function(command) {
    var result = this.commands[command](this);
    if (result === undefined) {
      // likely something changed because it is not a predicate function
      this.snapshots.push(this.takeSnapshot());
    }
    return result;
  },

  run: function() {
    var commands = this.karel.commands();
    for(var i = 0; i < commands.length; i++) {
      eval('var ' + commands[i] + ' = function() { return this.runCommand("' + commands[i] + '"); }.bind(this);');
    }

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

  takeSnapshot: function() {
    return { world: $.extend(true, {}, this.world),
             karel: $.extend(true, {}, this.karel) };
  },

  update: function() {
    if (this.snapshots.length > 0) {
      this.currentSnapshot = this.snapshots.shift();
    }
    this.save();
  }
};

GameObject.initialize(level);

