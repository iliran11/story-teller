const globals = require("globals");

module.exports = [
  {
    rules: {
      "no-undef": "error",
    },
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },

  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
