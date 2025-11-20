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
          ['src', './src'],
          ['@components', './src/components'],
          ['@assets', './src/assets'],
          ['@hooks', './src/hooks'],
          ['@store', './src/store'],
          ['@utils', './src/utils'],
          ['@data', './src/data'],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    'import/no-unresolved': 'error',
  },
};
