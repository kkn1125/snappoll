import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@database/(.*)$': '<rootDir>/database/$1',
    '^@logger/(.*)$': '<rootDir>/logger/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@auth/(.*)$': '<rootDir>/auth/$1',
    '^@boards/(.*)$': '<rootDir>/boards/$1',
    '^@websocket/(.*)$': '<rootDir>/websocket/$1',
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@polls/(.*)$': '<rootDir>/polls/$1',
    '^@votes/(.*)$': '<rootDir>/votes/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  // moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
};

export default config;
