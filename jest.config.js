module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  moduleNameMapper: {
    "^~/(.*)": "<rootDir>/src/$1"
  }
};
