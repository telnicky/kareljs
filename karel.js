var Karel = {
  x: 0,
  y: 0,
  direction: 0,
  isSuper: true,
  beeperCount: Infinity,

  initialize: function(attrs) {
    var karel = $.extend(true, {}, this);
    karel.x = attrs.x;
    karel.y = attrs.y;
    karel.isSuper = !!attrs.isSuper;
    karel.direction = attrs.direction;

    if (attrs.beeperCount !== undefined) {
      karel.beeperCount = attrs.beeperCount;
    }

    return karel;
  },

  front: function() {
    return this.direction;
  },

  left: function() {
    return (this.direction + 1) % 4;
  },

  move: function() {
    switch(this.direction) {
      case 0: // right
        this.x += 1;
        break;
      case 1: // up
        this.y -= 1;
        break;
      case 2: // left
        this.x -= 1;
        break;
      case 3: // down
        this.y += 1;
        break;
    }
  },

  position: function() {
    return { x: this.x, y: this.y }
  },

  right: function() {
    return (this.direction + 3) % 4;
  },

  turnAround: function() {
    this.turnLeft();
    this.turnLeft();
  },

  turnLeft: function() {
    this.direction = this.left();
  },

  turnRight: function() {
    this.direction = this.right();
  },

  attributes: function() {
    return {
      direction: this.direction,
      x: this.x,
      y: this.y,
      isSuper: this.isSuper
    };
  },

  commands: function() {
    var commands = ["move", "turnLeft", "putBeeper", "pickBeeper"];
    var superCommands = [
      "turnRight",
      "turnAround",
      "frontIsClear",
      "frontIsBlocked",
      "leftIsClear",
      "leftIsBlocked",
      "rightIsClear",
      "rightIsBlocked",
      "beepersPresent",
      "noBeepersPresent",
      "beepersInBag",
      "noBeepersInBag",
      "facingNorth",
      "notFacingNorth",
      "facingEast",
      "notFacingEast",
      "facingSouth",
      "notFacingSouth",
      "facingWest",
      "notFacingWest",
    ];

    return (this.isSuper) ?
      commands.concat(superCommands) :
      commands;
  }
};
