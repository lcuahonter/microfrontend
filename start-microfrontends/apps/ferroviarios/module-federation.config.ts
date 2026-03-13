import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'ferroviarios',
  exposes: {
    './Routes': 'apps/ferroviarios/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
