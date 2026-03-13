/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RemoteEntryComponent } from './entry.component';
import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  { path: '', redirectTo: 'pago', pathMatch: 'full' },
  {
    path: 'pago', loadChildren: () => import('./../application/app.module').then(module => module.AppSemarnatModule)
  }
];
