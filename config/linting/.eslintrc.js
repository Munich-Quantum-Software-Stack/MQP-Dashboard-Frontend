const path = require('path');
const prettierConfig = require('./.prettierrc.json');

module.exports = {
  root: true,
  extends: ['react-app', 'plugin:security/recommended', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
      alias: {
        map: [
          ['src', path.resolve(__dirname, '../../src')],
          ['@components', path.resolve(__dirname, '../../src/components')],
          ['@assets', path.resolve(__dirname, '../../src/assets')],
          ['@hooks', path.resolve(__dirname, '../../src/hooks')],
          ['@store', path.resolve(__dirname, '../../src/store')],
          ['@utils', path.resolve(__dirname, '../../src/components/utils')],
          ['@data', path.resolve(__dirname, '../../src/data')],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    'import/no-unresolved': 'error',
    'prettier/prettier': ['error', prettierConfig],
  },
  overrides: [
    {
      files: ['**/tests/e2e/**/*.spec.js'],
      rules: {
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/await-async-query': 'off',
        'testing-library/no-await-sync-query': 'off',
        'testing-library/no-debugging-utils': 'off',
        'testing-library/no-dom-import': 'off',
        'testing-library/await-async-utils': 'off',
        'testing-library/no-container': 'off',
        'testing-library/no-node-access': 'off',
        'testing-library/no-promise-in-fire-event': 'off',
        'testing-library/no-render-in-setup': 'off',
        'testing-library/no-unnecessary-act': 'off',
        'testing-library/no-wait-for-empty-callback': 'off',
        'testing-library/no-wait-for-multiple-assertions': 'off',
        'testing-library/no-wait-for-side-effects': 'off',
        'testing-library/no-wait-for-snapshot': 'off',
        'testing-library/prefer-find-by': 'off',
        'testing-library/prefer-presence-queries': 'off',
        'testing-library/prefer-query-by-disappearance': 'off',
        'testing-library/prefer-user-event': 'off',
        'testing-library/render-result-naming-convention': 'off',
      },
    },
  ],
};
