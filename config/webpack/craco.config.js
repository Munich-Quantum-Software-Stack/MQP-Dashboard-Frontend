const path = require('path');

// Suppress postcss.plugin deprecation warnings from legacy PostCSS plugins
// eslint-disable-next-line no-console
const originalConsoleWarn = console.warn;
// eslint-disable-next-line no-console
console.warn = (...args) => {
  if (args[0]?.includes?.('postcss.plugin was deprecated')) return;
  originalConsoleWarn.apply(console, args);
};

module.exports = {
  webpack: {
    alias: {
      src: path.resolve(__dirname, '../../src'),
      '@components': path.resolve(__dirname, '../../src/components'),
      '@assets': path.resolve(__dirname, '../../src/assets'),
      '@hooks': path.resolve(__dirname, '../../src/hooks'),
      '@store': path.resolve(__dirname, '../../src/store'),
      '@utils': path.resolve(__dirname, '../../src/components/utils'),
      '@data': path.resolve(__dirname, '../../src/data'),
      '@test': path.resolve(__dirname, '../../src/test'),
    },
  },
  devServer: (devServerConfig) => {
    // Remove deprecated options for webpack-dev-server v5
    delete devServerConfig.onAfterSetupMiddleware;
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.https;
    return devServerConfig;
  },
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          quietDeps: true, // Suppress warnings from dependencies (Bootstrap)
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'legacy-js-api'],
        },
      },
    },
  },
  jest: {
    configure: {
      roots: ['<rootDir>/src', '<rootDir>/tests/unit'],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
        '<rootDir>/tests/unit/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
      moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@store/(.*)$': '<rootDir>/src/store/$1',
        '^@utils/(.*)$': '<rootDir>/src/components/utils/$1',
        '^@data/(.*)$': '<rootDir>/src/data/$1',
        '^@test/(.*)$': '<rootDir>/src/test/$1',
      },
      transformIgnorePatterns: ['node_modules/(?!(date-fns)/)'],
    },
  },
};
