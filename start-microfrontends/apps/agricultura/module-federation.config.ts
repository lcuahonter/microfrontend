import { ModuleFederationConfig } from '@nx/webpack';

const CONFIG: ModuleFederationConfig = {
  name: 'agricultura',
  exposes: {
    './Routes': 'apps/agricultura/src/app/remote-entry/entry.routes.ts',
  },
};

export default CONFIG;
