import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'stps',
  exposes: {
    './Routes': 'apps/stps/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
