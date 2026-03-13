import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'aga',
  exposes: {
    './Routes': 'apps/aga/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
