var Editor = CodeMirror.fromTextArea($(".code")[0], {
  lineNumbers: true,
  mode: "javascript",
  theme: "monokai",
  viewportMargin: Infinity,
  tabSize: 2
});

