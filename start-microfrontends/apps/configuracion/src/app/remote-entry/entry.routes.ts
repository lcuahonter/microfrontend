/* eslint-disable */
// @ts-nocheck
import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '', loadChildren: () => import('./../application/app.module').then(module => module.AppConfiguracionModule)
  }
];
 