var levels = {
  currentLevel: 0,
  levels: [{
    code: "",
    name: "Morning Newspaper",
    worlds: [
      {
        walls: "0,0,0,0,0,0,0\n" +
          "0,0,9,8,12,0,0\n" +
          "0,0,1,0,0,0,0\n" +
          "0,0,3,2,6,0,0\n" +
          "0,0,0,0,0,0,0",
        beepers: [{ x: 5, y: 2, count: 1 }],
        solution: [{ x : 2, y: 1, count: 1 }],
        karel: { x: 2, y: 1, direction: 0, isSuper: false, beeperCount: 0 }
      },
    ],
  },
  {
    code: "",
    name: "Checkerboard",
    worlds: [
      {
        walls: "0,0,0,0,0\n" +
               "0,0,0,0,0\n" +
               "0,0,0,0,0",
        beepers: [],
        solution: [
          { x: 1, y: 0, count: 1 },
          { x: 3, y: 0, count: 1 },
          { x: 0, y: 1, count: 1 },
          { x: 2, y: 1, count: 1 },
          { x: 4, y: 1, count: 1 },
          { x: 1, y: 2, count: 1 },
          { x: 3, y: 2, count: 1 },
        ],
        karel: { x: 0, y: 0, direction: 0, isSuper: false }
    }],
  },
  {
    code: "",
    name: "Pot Holes",
    worlds: [
      {
        walls: "0,0,0,0,0,0,0\n" +
               "8,12,0,9,12,0,9",
        beepers: [],
        solution: [{ x: 2, y: 1, count: 1 }, { x: 5, y: 1, count: 1 }],
        karel: { x: 0, y: 0, direction: 0, isSuper: true }
      },
      {
        walls: "0,0,0,0,0,0,0\n" +
               "12,0,13,0,13,0,9",
        beepers: [],
        solution: [{ x : 1, y: 1, count: 1 }, { x: 3, y: 1, count: 1 }, { x: 5, y: 1, count: 1 }],
        karel: { x: 0, y: 0, direction: 0, isSuper: true }
      },
    ],
  },
  {
    code: "",
    name: "Beeper Sweeper",
    worlds: [
      {
        walls: "0,0,0,0,0\n" +
               "0,0,0,0,0",
        beepers: [
          { x: 3, y: 0, count: 1 },
          { x: 4, y: 0, count: 2 },
          { x: 4, y: 1, count: 3 },
          { x: 3, y: 1, count: 4 },
        ],
        solution: [{ x: 0, y: 0, count: 10 }],
        karel: { x: 0, y: 1, direction: 0, isSuper: true, beeperCount: 0 }
      },
      {
        walls: "0,0,0,0,0\n" +
               "0,0,0,0,0",
        beepers: [
          { x: 3, y: 0, count: 4 },
          { x: 4, y: 0, count: 3 },
          { x: 4, y: 1, count: 2 },
          { x: 3, y: 1, count: 1 },
        ],
        solution: [{ x: 0, y: 0, count: 10 }],
        karel: { x: 0, y: 1, direction: 0, isSuper: true, beeperCount: 0 }
      },
    ],
  },
  {
    code: "",
    name: "Broken Pillars",
    worlds: [{
      walls: "0,0,2,0,0,0,2,0,0,0,2,0,0\n" +
        "0,6,0,3,0,6,0,3,0,6,0,3,0\n" +
        "6,0,0,0,7,0,0,0,7,0,0,0,3\n" +
        "0,0,0,0,0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0,0,0,0,0",
      beepers: [
        { x: 0, y: 3, count: 1 },
        { x: 0, y: 4, count: 1 },
        { x: 4, y: 4, count: 1 },
        { x: 4, y: 6, count: 1 },
        { x: 4, y: 7, count: 1 },
        { x: 8, y: 3, count: 1 },
        { x: 8, y: 5, count: 1 },
        { x: 12, y: 3, count: 1 },
        { x: 12, y: 5, count: 1 },
        { x: 12, y: 7, count: 1 },
      ],
      solution: [
        { x: 0, y: 3, count: 1 },
        { x: 0, y: 4, count: 1 },
        { x: 0, y: 5, count: 1 },
        { x: 0, y: 6, count: 1 },
        { x: 0, y: 7, count: 1 },
        { x: 4, y: 3, count: 1 },
        { x: 4, y: 4, count: 1 },
        { x: 4, y: 5, count: 1 },
        { x: 4, y: 6, count: 1 },
        { x: 4, y: 7, count: 1 },
        { x: 8, y: 3, count: 1 },
        { x: 8, y: 4, count: 1 },
        { x: 8, y: 5, count: 1 },
        { x: 8, y: 6, count: 1 },
        { x: 8, y: 7, count: 1 },
        { x: 12, y: 3, count: 1 },
        { x: 12, y: 4, count: 1 },
        { x: 12, y: 5, count: 1 },
        { x: 12, y: 6, count: 1 },
        { x: 12, y: 7, count: 1 },
      ],
      karel: { x: 0, y: 7, direction: 0, isSuper: true }
    }],
  },
  {
    code: "",
    name: "21 Beeper Cleanup",
    worlds: [{
      walls: "0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0\n" +
        "0,0,0,0,0,0,0,0,0",
      beepers: [
        { x: 1, y: 4, count: 1 },
        { x: 1, y: 5, count: 1 },
        { x: 1, y: 6, count: 1 },
        { x: 2, y: 2, count: 1 },
        { x: 2, y: 3, count: 1 },
        { x: 2, y: 4, count: 1 },
        { x: 2, y: 5, count: 1 },
        { x: 2, y: 6, count: 1 },
        { x: 3, y: 5, count: 1 },
        { x: 3, y: 6, count: 1 },
        { x: 4, y: 4, count: 1 },
        { x: 4, y: 5, count: 1 },
        { x: 4, y: 6, count: 1 },
        { x: 5, y: 1, count: 1 },
        { x: 5, y: 2, count: 1 },
        { x: 5, y: 3, count: 1 },
        { x: 5, y: 4, count: 1 },
        { x: 5, y: 5, count: 1 },
        { x: 5, y: 6, count: 1 },
        { x: 7, y: 5, count: 1 },
        { x: 7, y: 6, count: 1 },
      ],
      solution: [
        { x: 8, y: 6, count: 21 },
      ],
      karel: { x: 0, y: 6, direction: 0, isSuper: true, beeperCount: 0 }
    }],
  },
  {
    code: "",
    name: "Double the Beepers",
    worlds: [
      {
        walls: "0,0,0,0,0,0,0",
        beepers: [{ x: 3, y: 0, count: 3 }],
        solution: [{ x: 3, y: 0, count: 6 }],
        karel: { x: 0, y: 0, direction: 0, isSuper: true }
      },
      {
        walls: "0,0,0,0,0,0,0",
        beepers: [{ x: 3, y: 0, count: 4 }],
        solution: [{ x : 2, y: 0, count: 8 }],
        karel: { x: 0, y: 0, direction: 0, isSuper: true }
      },
    ],
  },
  {
    code: "",
    name: "Midpoint",
    worlds: [
      {
        walls: "0,0,0,0,0,0,0",
        beepers: [],
        solution: [{ x: 3, y: 0, count: 1 }],
        karel: { x: 0, y: 0, direction: 0, isSuper: true }
      },
      {
        walls: "0,0,0,0,0,0,0",
        beepers: [],
        solution: [{ x : 2, y: 0, count: 1 }],
        karel: { x: 0, y: 0, direction: 0, isSuper: true }
      },
    ],
  },
  {
    code: "",
    name: "Maze",
    worlds: [
      {
        walls: "2,0,2,0,6,0\n" +
               "0,6,0,0,1,2\n" +
               "4,0,6,6,4,0\n" +
               "4,2,2,4,2,0\n" +
               "0,6,0,2,4,0\n" +
               "4,0,0,4,0,0",
        beepers: [{ x: 5, y: 0, count: 1 }],
        solution: [],
        karel: { x: 0, y: 5, direction: 0, isSuper: true }
      },
      {
        walls: "2,0,2,0,6,0\n" +
               "0,6,0,0,1,2\n" +
               "4,0,6,6,4,0\n" +
               "4,2,2,4,2,0\n" +
               "0,6,0,2,4,0\n" +
               "4,0,0,4,0,0",
        beepers: [{ x: 0, y: 5, count: 1 }],
        solution: [],
        karel: { x: 5, y: 0, direction: 0, isSuper: true }
      },
    ],
  }]
};

