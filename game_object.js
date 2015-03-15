// Super Karel http://web.stanford.edu/class/cs106a/materials/midterm-1-reference.pdf
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

  initialize: function(levels, cache) {
    this.initialLevels = $.extend(true, {}, levels.levels);
    this.editor = Editor;
    this.currentLevel = levels.currentLevel;
    if (cache) {
      this.initLevels(this.fetchLevels());
    } else {
      this.initLevels(levels.levels);
    }
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
    select.val(this.currentLevel);
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

  fetchLevels: function() {
    if (this.loadState()) {
      return this.savedLevels;
    }

    return false;
  },

  loadState: function() {
    var savedLevels = JSON.parse(localStorage.getItem("foobar4"));
    if (!savedLevels || typeof savedLevels.currentLevel !== "number" || savedLevels.levels === undefined) {
      return false;
    }

    this.currentLevel = savedLevels.currentLevel;
    this.savedLevels = savedLevels.levels;
    return true;
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
    requestAnimationFrame(this.main.bind(this));
  },

  initLevels: function(levels) {
    this.levels = levels;
    this.level = levels[this.currentLevel];
    this.setCode(this.level.code);

    for(var i = 0; i < this.level.worlds.length; i++) {
      var renderer = Renderer.initialize();
      this.renderers.push(renderer);
      this.worlds.push(World.initialize(this.level.worlds[i], renderer));
    }

    this.currentSnapshot = this.takeSnapshot();
  },

  levelIndex: function() {
    return Number($(".level-select").val());
  },

  reset: function() {
    for(var i = 0; i < this.renderers.length; i++) {
      this.renderers[i].remove();
    }

    this.renderers = [];
    this.worlds = [];
    this.level.worlds = $.extend(true, [], this.initialLevels[this.currentLevel].worlds);
    for(var i = 0; i < this.level.worlds.length; i++) {
      var renderer = Renderer.initialize();
      this.renderers.push(renderer);
      this.worlds.push(World.initialize(this.level.worlds[i], renderer));
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
    var value = JSON.stringify(this.serializeLevels());
    localStorage.setItem("foobar4", value);
  },

  serializeLevels: function() {
    this.levels[this.levelIndex()].code = this.code();
    return { levels: this.levels, currentLevel: this.levelIndex() };
  },

  setLevel: function() {
    var index = Number($(".level-select").val());
    this.currentLevel = index;
    this.level = this.levels[index];
    this.setCode(this.level.code);
    this.reset();
  },

  setLevelIndex: function(index) {
    $(".level-select").val(index);
    this.setLevel();
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

GameObject.initialize(levels, false);
