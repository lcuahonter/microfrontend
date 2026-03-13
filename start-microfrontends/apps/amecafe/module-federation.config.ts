import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'amecafe',
  exposes: {
    './Routes': 'apps/amecafe/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
