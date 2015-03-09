// Super Karel http://web.stanford.edu/class/cs106a/materials/midterm-1-reference.pdf
// TODO: Moar levels
// TODO: Level Selector
// TODO: more obvious win state
// TODO: Description of commands
// TODO: Title / styling, disable run button while running, highlight on error
// TODO: Highlight on undefined function
// TODO: frd caching of code
var GameObject = {
  currentSnapshot: [],
  renderers: [],
  snapshots: [],
  stateChanged: false,
  worlds: [],

  initialize: function(levels) {
    var savedLevel = JSON.parse(localStorage.getItem("asdf"));
    this.levels = levels;
    this.level = levels[0];
    this.editor = Editor;
    this.buildLevelSelect();

    if (false) { //savedLevel) {
      this.setCode(savedLevel.code);
      for(var i = 0; i < this.level.worlds.length; i++) {
        var renderer = Renderer.initialize();
        this.renderers.push(renderer);
        this.worlds.push(World.initialize(savedLevel.world, renderer));
      }
    } else {
      for(var i = 0; i < this.level.worlds.length; i++) {
        var renderer = Renderer.initialize();
        this.renderers.push(renderer);
        this.worlds.push(World.initialize(this.level.worlds[i], renderer));
      }
    }

    this.currentSnapshot = this.takeSnapshot();

    $('.run').click(this.run.bind(this));
    $('.reset').click(this.reset.bind(this));
    $('.solution').click(this.solution.bind(this));

    this.main();
    setInterval(this.update.bind(this), 800);
  },

  buildLevelSelect: function() {
    var select = $('.level-select');
    for(var i = 0; i < this.levels.length; i++) {
      select.append($("<option></option>")
        .attr("value", i)
        .text(this.levels[i].name));
    }
    select.change(this.setLevel.bind(this));
  },

  checkSolution: function() {
    for(var i = 0; i < this.worlds.length; i++) {
      var world = this.worlds[i];
      var beepers = world.beepers;
      var solution = world.solution;
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
      for(var i = 0; i < this.renderers.length; i++) {
        var renderer = this.renderers[i];
        renderer.solution(snapshot[i].world); // TODO: multi worlds
      }
    } else if (snapshot) {
      for(var i = 0; i < this.renderers.length; i++) {
        var renderer = this.renderers[i];
        renderer.render(snapshot[i].world, snapshot[i].world.karel);
      }
    }

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Request to do this again ASAP
    requestAnimationFrame(this.main.bind(this));
  },

  reset: function() {
    this.worlds = [];
    for(var i = 0; i < this.level.worlds.length; i++) {
      this.worlds.push(World.initialize(this.level.worlds[i], this.renderers[i]));
    }
    this.currentSnapshot = this.takeSnapshot();
    this.snapshots = [];
    $(".run").html("run");
  },

  runCommand: function(command) {
    for(var i = 0; i < this.worlds.length; i++) {
      var result = this.commands[command](this.worlds[i]);
    }

    if (result === undefined) {
      // likely something changed because it is not a predicate function
      this.snapshots.push(this.takeSnapshot());
    }

    return result;
  },

  run: function() {
    var commands = this.worlds[0].karel.commands();
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
    var value = JSON.stringify({ worlds: this.worlds.map(function(world) { return world.attributes(); }.bind(this)),
                                 code:  this.code()
    });
    localStorage.setItem("karel-level-1", value);
  },

  setLevel: function() {
    var index = Number($(".level-select").val());
    this.level = this.levels[index];
    this.reset();
  },

  solution: function() {
    $(".solution").toggleClass("active");
  },

  takeSnapshot: function(index) {
    return this.worlds.map(function(world) {
      return { world: $.extend(true, {}, world) };
    });
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

