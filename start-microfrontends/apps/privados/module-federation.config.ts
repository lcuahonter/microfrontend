import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'privados',
  exposes: {
    './Routes': 'apps/privados/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
