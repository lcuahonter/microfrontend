import { container } from 'webpack';
/**
 * @fileoverview
 * This file is used to configure Module Federation for the Dashboard application.  
 */
import * as MF from '@angular-architects/module-federation/webpack';
import * as PATH from 'path';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { ModuleFederationPlugin } = container;
const webpack = require("webpack");
const SHARE = MF.share;

const SHARED_MAPPINGS = new MF.SharedMappings();
SHARED_MAPPINGS.register(PATH.join(__dirname, '../../tsconfig.base.json'), [
  /* mapped paths to share */
]);
// Determinar dinámicamente la publicPath
function getPublicPath():string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://front.v30.ultrasist.net/';
  }
    return '/';
  
  
}

module.exports = {
  output: {
    uniqueName: 'dashboard',
    // Usar URL absoluta en lugar de 'auto' para evitar problemas
    publicPath: getPublicPath(),
    scriptType: 'text/javascript',
    // Asegurar que el nombre del archivo sea consistente
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...SHARED_MAPPINGS.getAliases()
    }
  },
  plugins: [
    // DISABLE ngDevMode as it is not needed in a remoteEntry
    new webpack.DefinePlugin({
        ngDevMode: "undefined",
    }),
    // END DISABLE ngDevMode as it is not needed in a remoteEntry
    new ModuleFederationPlugin({
      name: 'dashboard',
      // Agregar filename para asegurar que el punto de entrada remoto sea constante
      filename: 'remoteAppEntry.js',
      shared: SHARE({ 
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
        ...SHARED_MAPPINGS.getDescriptors()
      })
    }),
    SHARED_MAPPINGS.getPlugin()
  ],
  watchOptions: {
    ignored: 'node_modules'
  }
};