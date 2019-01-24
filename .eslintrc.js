module.exports = {
  parser: "babel-eslint",
  extends: 'eslint:recommended',

  rules: {
    'no-console': 0
  },

  env: {
    es6: true,
    node: true,
  },

  overrides: [
    {
      files: '**/*.test.js',
      env: {
        jest: true,
      },
    },
  ],
}
