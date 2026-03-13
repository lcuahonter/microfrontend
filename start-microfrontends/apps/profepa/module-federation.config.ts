import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'profepa',
  exposes: {
    './Routes': 'apps/profepa/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
