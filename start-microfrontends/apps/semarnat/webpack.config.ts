// import { withModuleFederation } from '@nx/angular/module-federation';
// import config from './module-federation.config';

// module.exports = withModuleFederation(config);

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */
const { ModuleFederationPlugin } = require('webpack').container;
const mf = require('@angular-architects/module-federation/webpack');
const webpack = require("webpack");
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
 /* mapped paths to share */
]);

module.exports = {
 output: {
  uniqueName: 'semarnat',
  publicPath: 'auto',
  scriptType: 'text/javascript'
 },
 optimization: {
  runtimeChunk: false
 },
 resolve: {
  alias: {
   ...sharedMappings.getAliases()
  }
 },
 plugins: [
  // DISABLE ngDevMode as it is not needed in a remoteEntry
  new webpack.DefinePlugin({
      ngDevMode: "undefined",
  }),
  // END DISABLE ngDevMode as it is not needed in a remoteEntry
  new ModuleFederationPlugin({
   name: 'semarnat',
   filename: 'remoteAppEntry.js',
   exposes: {
    './Module': 'apps/semarnat/src/app/application/app.module.ts',
   },
   shared: share({ 
    '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular-architects/module-federation': {
     singleton: true,
     strictVersion: true,
     requiredVersion: 'auto'
    },
    "@ng-mf/data-access-user": {
        "singleton": false,
        strictVersion: false,
        requiredVersion: false,
       "import": "libs/shared/data-access-user/src/index.ts",
    },
    ...sharedMappings.getDescriptors()
   })
  }),
  sharedMappings.getPlugin()
 ],
 watchOptions: {
    ignored: 'node_modules'
  }
};