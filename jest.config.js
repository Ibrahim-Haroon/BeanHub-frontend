module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '\\.css$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      '/node_modules/',
      '\\.css$',
    ],
  };
  
