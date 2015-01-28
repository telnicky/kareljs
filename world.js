var World = {
  beepers: [],
  walls: "",

  initialize: function() {
    this.beepers = attrs.beepers || this.beepers;
    this.walls = attrs.walls || this.walls;
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
  // position: object containing an x and y
  canMove: function(direction, position) {
    switch(direction) {
      case 0: // right
        this.canMoveRight(position);
        break;
      case 1: // up
        this.canMoveUp(position);
        break;
      case 2: // left
        this.canMoveLeft(position);
        break;
      case 3: // down
        this.canMoveDown(position);
        break;
    }
  },

  canMoveLeft: function(position) {
    if (position.x <= 0) {
      return false;
    }

    var currentWall = parseInt(this.walls[position.y][position.x]);
    var nextWall = parseInt(this.walls[position.y][position.x - 1]);
    var noLeftWall = (currentWall & this.renderer.leftWall) == 0;
    var noRightWall = (nextWall & this.renderer.rightWall) == 0;

    return noLeftWall && noRightWall;
  },

  canMoveRight: function(position) {
    if (position.x >= (this.renderer.canvas.width / this.renderer.blockSize) - 1) {
      return false;
    }

    var currentWall = parseInt(this.walls[position.y][position.x]);
    var nextWall = parseInt(this.walls[position.y][position.x + 1]);
    var noRightWall = (currentWall & this.renderer.rightWall) == 0;
    var noLeftWall = (nextWall & this.renderer.leftWall) == 0;

    return noRightWall && noLeftWall;
  },

  canMoveUp: function(position) {
    if (position.y <= 0) {
      return false;
    }

    var currentWall = parseInt(this.walls[position.y][position.x]);
    var nextWall = parseInt(this.walls[position.y - 1][position.x]);
    var noTopWall = (currentWall & this.renderer.topWall) == 0;
    var noBottomWall = (nextWall & this.renderer.bottomWall) == 0;

    return noTopWall && noBottomWall;
  },

  canMoveDown: function(position) {
    if (position.y >= (this.renderer.canvas.height / this.renderer.blockSize) - 1) {
      return false;
    }

    var currentWall = parseInt(this.walls[position.y][position.x]);
    var nextWall = parseInt(this.walls[position.y + 1][position.x]);
    var noBottomWall = (currentWall & this.renderer.bottomWall) == 0;
    var noTopWall = (nextWall & this.renderer.topWall) == 0;

    return noBottomWall && noTopWall;
  },
};
