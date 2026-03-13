/* eslint-disable */
// @ts-nocheck
import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  { path: '', redirectTo: 'pago', pathMatch: 'full' },
  {
    path: 'pago', loadChildren: () => import('../application/app.module').then(module => module.AppConsultasModule)
  }
];
 