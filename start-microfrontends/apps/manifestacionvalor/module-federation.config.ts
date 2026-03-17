import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'manifestacionvalor',
  exposes: {
    './Routes': 'apps/manifestacionvalor/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
