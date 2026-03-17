import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'funcionario',
  exposes: {
    './Routes': 'apps/funcionario/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
