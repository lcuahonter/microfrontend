/* eslint-disable */
export default {
  displayName: 'dashboard',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/dashboard',
  collectCoverageFrom: [
    'src/app/**/*.ts',
  ],
  testMatch: [
    '<rootDir>/src/app/**/*.spec.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
    },
    'apps/dashboard/src/app/**/*.ts': {
      statements: 80,
    },
  },
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    'src/app/.*\\.(module|store|query|enums?|enum|model|constants?|constantes|interfaces?)\\.ts$',
    'src/app/seleccion-tramite-desde-panel/.*\\.ts$',
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
