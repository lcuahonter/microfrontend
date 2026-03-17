/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'catalogos',
  exposes: {
    './Routes': 'apps/catalogos/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
