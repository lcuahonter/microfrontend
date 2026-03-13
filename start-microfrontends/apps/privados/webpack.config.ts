/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */
/* Este archivo se utiliza para configurar Webpack para la aplicación privados en una configuración de federación de módulos */

const { ModuleFederationPlugin } = require('webpack').container;
const mf = require('@angular-architects/module-federation/webpack');
const webpack = require("webpack");
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
  /* mapped paths to share */
]);

// Determinar dinámicamente la publicPath para que los chunks se carguen desde el servidor correcto
// function getPublicPath() {
//   if (process.env.NODE_ENV === 'production') {
//     // En producción, usar la URL del servidor de producción
//     return 'https://privados.v30.ultrasist.net/';
//   }
//   // En desarrollo, usar localhost con el puerto asignado
//   return 'http://localhost:4225/';
// }

module.exports = {
  output: {
    uniqueName: 'privados',
    publicPath: 'auto',
    scriptType: 'text/javascript'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/app'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/app/shared'),
      '@core': path.resolve(__dirname, 'src/app/core'),
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
      name: 'privados',
      filename: 'remoteAppEntry.js',
      exposes: {
        './Routes': './apps/privados/src/app/remote-entry/entry.routes.ts',
        './Module': './apps/privados/src/app/app.module.ts'
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
