/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
const { ModuleFederationPlugin } = require('webpack').container;
const mf = require('@angular-architects/module-federation/webpack');
const webpack = require("webpack");
const path = require('path');
const share = mf.share;
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
 /* rutas mapeadas para compartir */
]);
module.exports = {
 output: {
  uniqueName: 'cofepris',
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
   name: 'cofepris',
   filename: 'remoteAppEntry.js',
   exposes: {
    './Module': 'apps/cofepris/src/app/application/app.module.ts',
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