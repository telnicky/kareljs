var World = {
  beepers: [],
  solution: [],
  walls: "",

  initialize: function(attrs, renderer) {
    this.renderer = renderer;
    this.beepers = attrs.beepers;
    this.solution = attrs.solution;
    this.walls = attrs.walls;

    if (typeof this.walls === "string") {
      this.walls = this.walls.split("\n").map(function(row) { return row.split(","); });
    }

    return this;
  },

  attributes: function() {
    return {
      beepers: this.beepers,
      solution: this.solution,
      walls: this.walls
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
};
