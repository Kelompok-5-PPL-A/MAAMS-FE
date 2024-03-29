/* eslint-env node */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.tsx', '!**/node_modules/**'],
  coverageReporters: ['html', 'text', 'lcov', 'cobertura'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  setupFiles: ['dotenv/config']
}
