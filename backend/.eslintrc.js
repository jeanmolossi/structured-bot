module.exports = {
  env: {
    es6: true,
    node: true,
    jest: 'true',
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-multi-assign': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
    '@typescript-eslint/interface-name-prefix': [
      'error',
      { prefixWithI: 'always' },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        '': 'never',
      },
    ],
  },
  settings: {
    'import/extensions': ['.ts'],
    typescript: {},
  },
};