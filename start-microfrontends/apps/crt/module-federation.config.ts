import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'crt',
  exposes: {
    './Routes': 'apps/crt/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
