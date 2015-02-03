var Karel = {
  x: 0,
  y: 0,
  direction: 0,

  initialize: function(attrs) {
    this.x = attrs.x || this.x;
    this.y = attrs.y || this.y;
    this.direction = attrs.direction || this.direction;
    return this;
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

  turnLeft: function() {
    this.direction = (this.direction + 1) % 4;
  },
};
