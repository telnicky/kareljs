// Super Karel http://web.stanford.edu/class/cs106a/materials/midterm-1-reference.pdf
// TODO: frd caching of code
// TODO: more obvious win state
// TODO: Description of commands
// TODO: Title / styling, disable run button while running, highlight on error
// TODO: Highlight on undefined function
var GameObject = {
  currentSnapshot: [],
  renderers: [],
  snapshots: [],
  stateChanged: false,
  worlds: [],
  levelIndex: 0,

  initialize: function(levels) {
    this.editor = Editor;
    this.initLevels(levels);
    this.buildLevelSelect();

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
        renderer.solution(snapshot[i].world);
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

  initLevels: function(levels) {
    var savedLevels = JSON.parse(localStorage.getItem("foobar"));
    this.levels = levels;
    this.level = levels[this.levelIndex];

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
      var result = World.actions[command](this.worlds[i]);
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
                                 code:  this.code(),
                                 level: $(".level-select").val()
    });
    localStorage.setItem("foobar", value);
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

