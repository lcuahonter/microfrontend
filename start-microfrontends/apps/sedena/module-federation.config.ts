import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'sedena',
  exposes: {
    './Routes': 'apps/sedena/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
