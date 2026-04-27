/* eslint-disable */
// @ts-nocheck

const mf = require('@angular-architects/module-federation/webpack');
// Usar la misma instancia de webpack que @angular-devkit para evitar conflicto de 'compilation'
let webpack: any;
try {
  webpack = require('@angular-devkit/build-angular/node_modules/webpack');
} catch {
  webpack = require('webpack');
}
const { ModuleFederationPlugin } = webpack.container;
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
 /* mapped paths to share */
]);

module.exports = {
 output: {
  uniqueName: 'usuarios',
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
   name: 'usuarios',
   filename: 'remoteAppEntry.js',
   exposes: {
    './Module': 'apps/usuarios/src/app/application/app.module.ts',
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