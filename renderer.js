var Renderer = {
  karelReady: false,
  blockSize: 64,

  initialize: function(world, karel) {
    this.world = world;
    this.karel = karel;
    this.createCanvas();
    this.loadImages();
    return this;
  },

  createCanvas: function() {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "karel-container";
    $('.game').append(this.canvas);
  },

  loadImages: function() {
    this.karelImage = new Image();
    this.karelImage.onload = function () {
      this.karelReady = true;
    }.bind(this);
    this.karelImage.src = "images/karel.png";
  },

  drawLevel: function() {
    var context = this.canvas.getContext("2d");
    var beepers = this.world.beepers;
    var walls = this.world.walls;

    // set width and height
    this.canvas.width = walls[0].length * this.blockSize;
    this.canvas.height = walls.length * this.blockSize;

    // walls
    for (var y = 0; y < walls.length; y++) {
      for (var x = 0; x < walls[y].length; x++) {
        context.fillRect(x * this.blockSize + this.blockSize * 0.5, y * this.blockSize + this.blockSize * 0.5, 2, 2);
        this.drawWall(x, y, walls[y][x]);
      }
    }

    // beepers
    for (var i = 0; i < beepers.length; i++) {
      var beeper = beepers[i];
      this.drawBeeper(beeper.x, beeper.y, beeper.count);
    }
  },

  drawBeeper: function(x, y, count) {
    var minX = x * this.blockSize;
    var minY = y * this.blockSize;
    var midX = minX + this.blockSize * 0.5;
    var midY = minY + this.blockSize * 0.5;
    var maxX = minX + this.blockSize;
    var maxY = minY + this.blockSize;

    var context = this.canvas.getContext("2d");
    context.save();
    context.beginPath();
    context.moveTo(midX, minY); // top point
    context.lineTo(maxX, midY); // right point
    context.lineTo(midX, maxY); // bottom point
    context.lineTo(minX, midY); // left point

    context.lineWidth = 2;
    context.fillStyle = "rgb(102, 204, 0)";
    context.strokeStyle = "rgb(0, 50, 200)";

    context.closePath();
    context.fill();
    context.stroke();
    context.restore();

    if (count && count != 1) {
      context.save();
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(count, midX, midY);
      context.restore();
    }
  },

  // Internal: Draw a wall on given side
  //
  // side - a bitmap representing each side of the wall.
  //        0000 -> Top Right Bottom Left
  //        T = 8, R = 4, B = 2, L = 1
  topWall: 8,
  rightWall: 4,
  bottomWall: 2,
  leftWall: 1,
  drawWall: function(x, y, side) {
    var minX = x * this.blockSize;
    var minY = y * this.blockSize;
    var midX = minX + this.blockSize * 0.5;
    var midY = minY + this.blockSize * 0.5;
    var maxX = minX + this.blockSize;
    var maxY = minY + this.blockSize;
    var context = this.canvas.getContext("2d");

    context.save();
    context.beginPath();

    if (side & 8) { // Top
      context.moveTo(minX, minY);
      context.lineTo(maxX, minY);
    }

    if (side & 4) { // Right
      context.moveTo(maxX, minY);
      context.lineTo(maxX, maxY);
    }

    if (side & 2) { // Bottom
      context.moveTo(minX, maxY);
      context.lineTo(maxX, maxY);
    }

    if (side & 1) { // Left
      context.moveTo(minX, minY);
      context.lineTo(minX, maxY);
    }

    context.lineWidth = 4;
    context.stroke();
    context.restore();
  },

  drawKarel: function() {
    var context = this.canvas.getContext("2d");
    var karel = this.karel;
    var minX = karel.x * this.blockSize;
    var minY = karel.y * this.blockSize;
    var midX = this.blockSize * 0.5;
    var midY = this.blockSize * 0.5;
    context.save();
    context.translate(minX, minY);
    context.translate(midX, midY);
    context.rotate(-90 * karel.direction * (Math.PI / 180));
    context.drawImage(this.karelImage, midX, midY, -this.blockSize, -this.blockSize);
    context.restore();
  },

  render: function() {
    var context = this.canvas.getContext("2d");
    var karel = this.karel;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLevel();
    if (this.karelReady) {
      this.drawKarel();
    }
  }
};

