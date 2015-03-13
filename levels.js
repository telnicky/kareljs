var levels = {
  currentLevel: 0,
  levels: [{
    code: "",
    name: "morning newspaper",
    worlds: [
      {
        walls: "0,0,0,0,0,0,0\n" +
          "0,0,9,8,12,0,0\n" +
          "0,0,1,0,0,0,0\n" +
          "0,0,3,2,6,0,0\n" +
          "0,0,0,0,0,0,0",
        beepers: [{ x: 5, y: 2, count: 1 }],
        solution: [{ x : 2, y: 1, count: 1 }],
        karel: { x: 2, y: 1, direction: 0, isSuper: false }
      },
    ],
  },
  {
    code: "",
    name: "fill pot holes",
    worlds: [
      {
        walls: "0,0,0,0,0,0,0\n" +
               "0,0,0,0,0,0,0\n" +
               "0,0,0,0,0,0,0\n" +
               "12,0,9,8,8,8,8",
        beepers: [],
        solution: [{ x : 1, y: 3, count: 1 }],
        karel: { x: 0, y: 2, direction: 0, isSuper: true }
      },
      {
        walls: "0,0,0,0,0,0,0\n" +
               "0,0,0,0,0,0,0\n" +
               "0,0,0,0,0,0,0\n" +
               "12,0,9,8,8,8,8",
        beepers: [],
        solution: [{ x : 1, y: 3, count: 1 }],
        karel: { x: 0, y: 2, direction: 0, isSuper: true }
      },
    ],
  },
  {
    code: "",
    name: "broken pillars",
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
  }]
};

