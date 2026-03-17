/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'tramites',
  exposes: {
    './Routes': 'apps/tramites/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
