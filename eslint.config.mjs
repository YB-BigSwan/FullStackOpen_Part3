import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // js.configs.recommended, <- had to remove because of some weird ESLint 9 issue (https://github.com/eslint/eslint/discussions/18304)
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    // I changed these because the provided settings made me want to pull my teeth out. I prefer double quotes and semicolons.
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/semi": ["error", "always"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
    ignores: ["dist/**", "build/**"],
  },
];
