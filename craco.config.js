const path = require('path');

module.exports = {
  webpack: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@utils': path.resolve(__dirname, 'src/components/utils'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@store/(.*)$': '<rootDir>/src/store/$1',
        '^@utils/(.*)$': '<rootDir>/src/components/utils/$1',
        '^@data/(.*)$': '<rootDir>/src/data/$1',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(date-fns|msw|@mswjs|@open-draft|strict-event-emitter|until-async|headers-polyfill|@bundled-esm)/)',
      ],
    },
  },
};
