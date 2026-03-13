/* eslint-disable */
export default {
  displayName: 'profepa',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/profepa',
  collectCoverageFrom: [
    'src/app/application/**/*.ts',
  ],
  testMatch: [
    '<rootDir>/src/app/application/**/*.spec.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
    },
    'apps/profepa/src/app/application/**/*.ts': {
      statements: 80,
    },
  },
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    'src/app/application/.*\\.(module|store|query|enums?|enum|model|models|constants?|constantes|interfaces?)\\.ts$',
    'src/app/application/seleccion-tramite/.*\\.ts$',
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
