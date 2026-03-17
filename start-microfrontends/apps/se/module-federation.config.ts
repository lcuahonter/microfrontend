/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'se',
  exposes: {
    './Routes': 'apps/se/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
