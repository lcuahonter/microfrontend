/* eslint-disable */
export default {
  displayName: 'usuarios',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/usuarios',
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
    'apps/usuarios/src/app/application/**/*.ts': {
      statements: 80,
    },
  },
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    // Patrones de archivos de infraestructura (sin lógica testeable)
    'src/app/application/.*\\.(module|store|query|enums?|enum|model|constants?|constantes|interfaces?)\\.ts$',
    // Archivos de rutas y guards (configuración, no lógica de negocio)
    'src/app/application/.*\\.routes\\.ts$',
    'src/app/application/.*\\.guard\\.ts$',
    // Archivos barrel (re-exportaciones)
    'src/app/application/.*/index\\.ts$',
    // Módulos/secciones sin cobertura (fuera del scope de usuarios-angular)
    'src/app/application/core/',
    'src/app/application/shared/',
    'src/app/application/inicio/',
    'src/app/application/seleccion-tramite/',
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