import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'bandejas',
  exposes: {
    './Routes': 'apps/bandejas/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
