import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'agace',
  exposes: {
    './Routes': 'apps/agace/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
