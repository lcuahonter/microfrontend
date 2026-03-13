/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'consultas',
  exposes: {
    './Routes': 'apps/consultas/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
