import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'maritimos',
  exposes: {
    './Routes': 'apps/maritimos/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
