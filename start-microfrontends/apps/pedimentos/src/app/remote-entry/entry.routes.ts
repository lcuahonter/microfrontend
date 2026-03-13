import { Route } from '@angular/router';

export const REMOTE_ROUTES: Route[] = [
  { path: '', redirectTo: 'tramites', pathMatch: 'full' },
  {
    path: 'tramites',
    loadChildren: () =>
      import('./../application/app.module').then(
        (module) => module.AppPedimentosModule
      ),
  },
];
