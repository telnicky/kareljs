// Super Karel http://web.stanford.edu/class/cs106a/materials/midterm-1-reference.pdf
// TODO: Moar levels
// TODO: Description of commands
// TODO: Title / styling, disable run button while running, highlight on error
// TODO: Highlight on undefined function
// TODO: frd caching of code
var GameObject = {
  currentSnapshot: null,
  snapshots: [],
  stateChanged: false,

  initialize: function(levels) {
    var savedLevel = JSON.parse(localStorage.getItem("karel-level-2"));
    this.level = levels[0];
    this.editor = Editor;
    this.initialLevel = $.extend(true, {}, this.level);

    if (savedLevel) {
      this.world = World.initialize(savedLevel.world, Renderer);
      this.setCode(savedLevel.code);
    } else {
      this.world = World.initialize(this.level.world, Renderer);
    }
    this.currentSnapshot = this.takeSnapshot();
    this.renderer = Renderer.initialize();

    $('.run').click(this.run.bind(this));
    $('.reset').click(this.reset.bind(this));
    $('.solution').click(this.solution.bind(this));

    this.main();
    setInterval(this.update.bind(this), 800);
  },

  checkSolution: function() {
    var beepers = this.world.beepers;
    var solution = this.world.solution;
    var compare = function(a, b) {
      return a.x === b.x && a.y === b.y && a.count === b.count;
    };

    if (beepers.length !== solution.length) {
      return false;
    }

    for(var i = 0; i < beepers.length; i++) {
      for(var j = 0; j < solution.length; j++) {
        if (!compare(beepers[i], solution[j])) {
          return false;
        }
      }
    }

    return true;
  },

  completed: function() {
    $(".run").html("completed!");
  },

  commands: {
    beepersInBag: function(world) {
      return !!world.karel.beeperCount;
    },

    beepersPresent: function(world) {
      var x = world.karel.x;
      var y = world.karel.y;
      var result = false;
      world.beepers.forEach(function(beeper) {
        if (beeper.x === x && beeper.y === y) {
          result = true;
        }
      });
      return result;
    },

    facingEast: function(world) {
      return world.karel.direction === 2;
    },

    facingNorth: function(world) {
      return world.karel.direction === 1;
    },

    facingSouth: function(world) {
      return world.karel.direction === 3;
    },

    facingWest: function(world) {
      return world.karel.direction === 0;
    },

    frontIsBlocked: function(world) {
      return !this.frontIsClear(world);
    },

    frontIsClear: function(world) {
      return world.canMove(world.karel.front(), world.karel.x, world.karel.y);
    },

    leftIsBlocked: function(world) {
      return !this.leftIsClear(world);
    },

    leftIsClear: function(world) {
      return world.canMove(world.karel.left(), world.karel.x, world.karel.y);
    },

    move: function(world) {
      if (world.canMove(world.karel.direction, world.karel.x, world.karel.y)) {
        world.karel.move();
      }
    },

    noBeepersInBag: function(world) {
      return !this.beepersInBag(world);
    },

    noBeepersPresent: function(world) {
      return !this.beepersPresent(world);
    },

    notFacingEast: function(world) {
      return !this.facingEast(world);
    },

    notFacingNorth: function(world) {
      return !this.facingNorth(world);
    },

    notFacingSouth: function(world) {
      return !this.facingSouth(world);
    },

    notFacingWest: function(world) {
      return !this.facingWest(world);
    },

    putBeeper: function(world) {
      world.putBeeper(world.karel.x, world.karel.y);
    },

    pickBeeper: function(world) {
      world.pickBeeper(world.karel.x, world.karel.y);
    },

    rightIsBlocked: function(world) {
      return !this.rightIsClear(world);
    },

    rightIsClear: function(world) {
      return world.canMove(world.karel.right(), world.karel.x, world.karel.y);
    },

    turnAround: function(world) {
      world.karel.turnAround();
    },

    turnLeft: function(world) {
      world.karel.turnLeft();
    },

    turnRight: function(world) {
      world.karel.turnRight();
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
    var showSolution = $(".solution").hasClass("active");
    if (showSolution) {
      this.renderer.solution(snapshot.world);
    } else if (snapshot) {
      this.renderer.render(snapshot.world, snapshot.world.karel); //TODO
    }

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Request to do this again ASAP
    requestAnimationFrame(this.main.bind(this));
  },

  reset: function() {
    this.level = $.extend(true, {}, this.initialLevel);
    this.world = World.initialize(this.level.world, Renderer);
    this.currentSnapshot = this.takeSnapshot();
    this.snapshots = [];
    $(".run").html("run");
  },

  runCommand: function(command) {
    var result = this.commands[command](this.world);
    if (result === undefined) {
      // likely something changed because it is not a predicate function
      this.snapshots.push(this.takeSnapshot());
    }
    return result;
  },

  run: function() {
    var commands = this.world.karel.commands();
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
    var value = JSON.stringify({ world: this.world.attributes(),
                                 code:  this.code()
    });
    localStorage.setItem("karel-level-1", value);
  },

  solution: function() {
    $(".solution").toggleClass("active");
  },

  takeSnapshot: function() {
    return { world: $.extend(true, {}, this.world) };
  },

  update: function() {
    if (this.snapshots.length > 0) {
      this.currentSnapshot = this.snapshots.shift();
      this.stateChanged = true;
    } else if(this.stateChanged) {
      this.stateChanged = false;
      if (this.checkSolution()) {
        this.completed();
      } else {
        this.reset();
      }
    }
    this.save();
  }
};

GameObject.initialize(levels);

