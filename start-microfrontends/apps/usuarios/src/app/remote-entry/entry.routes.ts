import { Route } from '@angular/router';

export const REMOTE_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./../application/app.module').then(
        (module) => module.AppUsuariosModule
      ),
  },
];
 