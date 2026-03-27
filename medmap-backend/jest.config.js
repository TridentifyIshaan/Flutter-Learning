module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/realtime.js',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
