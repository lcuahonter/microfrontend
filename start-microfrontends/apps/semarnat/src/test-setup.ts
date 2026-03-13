import 'jest-preset-angular/setup-jest';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require('uuid');
// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environmentglobalThis.ngJest = {
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
  crypto: {},
};
 
global.crypto.randomUUID = uuidv4;
 