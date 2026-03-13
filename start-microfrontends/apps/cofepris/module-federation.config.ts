/* eslint-disable @typescript-eslint/naming-convention */
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'cofepris',
  exposes: {
    './Routes': 'apps/cofepris/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
