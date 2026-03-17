
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: UUIDV4 } = require('uuid');
// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
  crypto: {}
};
globalThis.crypto.randomUUID = UUIDV4;
import 'jest-preset-angular/setup-jest';
