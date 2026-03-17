import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'pedimentos',
  exposes: {
    './Routes': 'apps/pedimentos/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
