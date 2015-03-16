var World = {
  beepers: [],
  snapshots: [],
  solution: [],
  walls: "",

  initialize: function(attrs, renderer) {
    var world = $.extend(true, {}, this);
    world.renderer = renderer;
    world.beepers = attrs.beepers;
    world.solution = attrs.solution;
    world.walls = attrs.walls;
    world.karel = Karel.initialize(attrs.karel);

    if (typeof world.walls === "string") {
      world.walls = world.walls.split("\n").map(function(row) { return row.split(","); });
    }

    return world;
  },

  attributes: function() {
    return {
      beepers: this.beepers,
      karel: this.karel.attributes(),
      solution: this.solution,
      walls: this.walls,
    };
  },

  putBeeper: function(x, y) {
    var beeper;
    for (var i = 0; i < this.beepers.length; i++) {
      beeper = this.beepers[i];
      if (beeper.x === x && beeper.y === y) {
        beeper.count++;
        return;
      }
    }
    this.beepers.push({ x: x, y: y, count: 1 });
  },

  pickBeeper: function(x, y) {
    var beeper;
    for (var i = 0; i < this.beepers.length; i++) {
      beeper = this.beepers[i];
      if (beeper.x === x && beeper.y === y) {
        beeper.count--;
        if (beeper.count <= 0) {
          var i = this.beepers.indexOf(beeper);
          this.beepers.splice(i, 1);
        }
        return;
      }
    }
  },

  // public: returns a boolean validating whether a move can be made in give
  // direction from given position.
  //
  // direction: 0 - 3 representing Right, Up, Left, Down
  // x: location of x coordinate
  // y: location of y coordinate
  canMove: function(direction, x, y) {
    switch(direction) {
      case 0: // right
        return this.canMoveRight(x, y);
      case 1: // up
        return this.canMoveUp(x, y);
      case 2: // left
        return this.canMoveLeft(x, y);
      case 3: // down
        return this.canMoveDown(x, y);
    }
    return false;
  },

  canMoveLeft: function(x, y) {
    if (x <= 0) {
      return false;
    }

    var currentWall = parseInt(this.walls[y][x]);
    var nextWall = parseInt(this.walls[y][x - 1]);
    var noLeftWall = (currentWall & this.renderer.leftWall) == 0;
    var noRightWall = (nextWall & this.renderer.rightWall) == 0;

    return noLeftWall && noRightWall;
  },

  canMoveRight: function(x, y) {
    if (x >= (this.renderer.canvas.width / this.renderer.blockSize) - 1) {
      return false;
    }

    var currentWall = parseInt(this.walls[y][x]);
    var nextWall = parseInt(this.walls[y][x + 1]);
    var noRightWall = (currentWall & this.renderer.rightWall) == 0;
    var noLeftWall = (nextWall & this.renderer.leftWall) == 0;

    return noRightWall && noLeftWall;
  },

  canMoveUp: function(x, y) {
    if (y <= 0) {
      return false;
    }

    var currentWall = parseInt(this.walls[y][x]);
    var nextWall = parseInt(this.walls[y - 1][x]);
    var noTopWall = (currentWall & this.renderer.topWall) == 0;
    var noBottomWall = (nextWall & this.renderer.bottomWall) == 0;

    return noTopWall && noBottomWall;
  },

  canMoveDown: function(x, y) {
    if (y >= (this.renderer.canvas.height / this.renderer.blockSize) - 1) {
      return false;
    }

    var currentWall = parseInt(this.walls[y][x]);
    var nextWall = parseInt(this.walls[y + 1][x]);
    var noBottomWall = (currentWall & this.renderer.bottomWall) == 0;
    var noTopWall = (nextWall & this.renderer.topWall) == 0;

    return noBottomWall && noTopWall;
  },

  executeCommand: function(command) {
    var result = this.actions[command](this);

    if (result === undefined) {
      // likely something changed because it is not a predicate function
      this.takeSnapshot();
    }

    return result;
  },

  executeCode: function(code) {
    var commands = this.karel.commands();
    for(var i = 0; i < commands.length; i++) {
      eval('var ' + commands[i] + ' = function() { return this.executeCommand("' + commands[i] + '"); }.bind(this);');
    }
    eval(code);
  },

  takeSnapshot: function() {
    this.snapshots.push($.extend(true, {}, this.attributes()));
  },

  actions: {
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
      if (world.karel.beeperCount > 0) {
        world.karel.beeperCount--;
        world.putBeeper(world.karel.x, world.karel.y);
      }
    },

    pickBeeper: function(world) {
      if (this.beepersPresent(world)) {
        world.karel.beeperCount++;
        world.pickBeeper(world.karel.x, world.karel.y);
      }
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
  }
};
