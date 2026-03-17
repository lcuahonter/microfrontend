/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'usuarios',
  exposes: {
    './Routes': 'apps/usuarios/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
