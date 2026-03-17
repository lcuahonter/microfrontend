/* eslint-disable */
// @ts-nocheck
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'tareas',
  exposes: {
    './Routes': 'apps/tareas/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
