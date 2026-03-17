/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'configuracion',
  exposes: {
    './Routes': 'apps/configuracion/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
