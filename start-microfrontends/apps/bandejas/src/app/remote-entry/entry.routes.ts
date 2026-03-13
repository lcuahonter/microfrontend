import { Route } from '@angular/router';

export const REMOTE_ROUTES: Route[] = [
  { path: '', redirectTo: 'pago', pathMatch: 'full' },
  {
    path: 'pago', loadChildren: () => import('./../application/app.module').then(module => module.AppBandejasModule)
  }
];
 