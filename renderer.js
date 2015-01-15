var Renderer = {
  karelReady: false,
  blockSize: 64,

  initialize: function() {
    // create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.className = "karel-container";
    document.body.appendChild(this.canvas);

    // Load Images
    this.karelImage = new Image();
    this.karelImage.onload = function () {
      this.karelReady = true 
    }.bind(this);
    this.karelImage.src = "images/karel.png";
  },

  drawLevel: function(level) {
    var context = this.canvas.getContext("2d");
    var rows, columns;

    // set width and height
    rows = level.walls.split("\n");
    columns = rows[0].split(",");
    this.canvas.width = columns.length * this.blockSize;
    this.canvas.height = rows.length * this.blockSize;

    // walls
    for (var y = 0; y < rows.length; y++) {
      columns = rows[y].split(",");
      for (var x = 0; x < columns.length; x++) {
        context.fillRect(x * this.blockSize + this.blockSize * 0.5, y * this.blockSize + this.blockSize * 0.5, 2, 2);
        this.drawWall(x, y, columns[x]);
      }
    }

    // beepers
    for (var i = 0; i < level.beepers.length; i++) {
      var beeper = level.beepers[i];
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

  render: function(level) {
    var context = this.canvas.getContext("2d");
    var karel = level.karel;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLevel(level);
    if (this.karelReady) {
      context.drawImage(this.karelImage, karel.x * this.blockSize, karel.y * this.blockSize, this.blockSize, this.blockSize);
    }
  }
};

