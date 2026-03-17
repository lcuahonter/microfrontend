import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'inbal',
  exposes: {
    './Routes': 'apps/inbal/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
