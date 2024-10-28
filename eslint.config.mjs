import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      parser: "@babel/eslint-parser",
    },
  },
];
