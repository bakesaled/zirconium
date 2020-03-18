const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.spec.[jt]s'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.spec.json'
    },
    stringifyContentPathRegex: true
  }
};
