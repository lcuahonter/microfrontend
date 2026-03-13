import { ModuleFederationConfig } from '@nx/webpack';

// eslint-disable-next-line @typescript-eslint/naming-convention
const config: ModuleFederationConfig = {
  name: 'semarnat',
  exposes: {
    './Routes': 'apps/semarnat/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
