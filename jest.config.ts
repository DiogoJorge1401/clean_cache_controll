import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
  roots: ['<rootDir>/src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  testEnvironments: 'node',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  coveragePathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  bail: true,
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
}
